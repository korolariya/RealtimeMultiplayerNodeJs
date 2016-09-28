/// <reference path="../lib/SortedLookupTable.ts" />
/// <reference path="../network/Client.ts" />
/// <reference path="../network/ClientNetChannel.ts" />
/// <reference path="../model/NetChannelMessage.ts" />
namespace RealtimeMultiplayerGame.network {
    import SortedLookupTable = RealtimeMultiplayerGame.lib.SortedLookupTable;
    export class ServerNetChannel {
        constructor(aDelegate:any) {
            this.clients = new SortedLookupTable();
            this.setDelegate(aDelegate);
            this.setupSocketIO();
            this.setupCmdMap();
        }

        public socketio: any = null;					// Socket.IO server
        public clients: any = null;					// SortedLookupTable
        public delegate: any = null;					// Should conform to ServerNetChannel delegate
        public outgoingSequenceNumber: any = 0;					// A unique ID for each message
        public cmdMap: any = {};					// Map the CMD constants to functions

        public clientCount = 0;
        public maxClients = 8;
        public maxChars = 128;
        public socketClients:any = [];
        public wsServer:any = null;
        public removeClient:any;


        // Methods
        /**
         * Initializes socket.io
         */
        public setupSocketIO() {
            var server = require('http').createServer(function (req: any, res: any) {
            });
            server.listen(RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT);
            this.socketio = require('socket.io').listen(server);

            var that = this;
            this.socketio.configure('production', function () {
                that.socketio.enable('browser client etag');
                that.socketio.set('log level', 1);

                that.socketio.set('transports', [
                    'websocket'
                    , 'flashsocket'
                    , 'htmlfile'
                    , 'xhr-polling'
                    , 'jsonp-polling'
                ]);
            });

            this.socketio.configure('development', function () {
                that.socketio.set('transports', ['websocket']);
            });

            this.socketio.on('connection', function (socket: any) {
                // console.log(socket);
                that.onSocketConnection(socket);

                socket.on('message', function (data:any) {
                    //  console.log(data)
                    that.onSocketMessage(data, socket)
                });
                socket.on('disconnect', function () {
                    console.log("disconnecting...");
                    that.onSocketClosed(socket)
                });
            });
        };

        public setupWSServer() {

            var profiler = require('v8-profiler');
            var util = require('util');
            var ws = require("../lib/bonsai-ws/ws.js");

            this.clientCount = 0;
            this.maxClients = 8;
            this.maxChars = 128;
            this.socketClients = [];
            var that = this;

            this.wsServer = new ws.Server(false);
            this.wsServer.onConnect = function (conn:any) {
                var aClient = new RealtimeMultiplayerGame.network.Client(conn, RealtimeMultiplayerGame.network.ServerNetChannel.getNextClientID());

                // Send the first message back to the client, which gives them a clientid
                var connectMessage = new RealtimeMultiplayerGame.model.NetChannelMessage(++this.outgoingSequenceNumber, aClient.getClientid(), true, RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT, {gameClock: that.delegate.getGameClock()});
                connectMessage.messageTime = that.delegate.getGameClock();
                aClient.getConnection().json.send(connectMessage);

                // Add to our list of connected users
                that.clients.setObjectForKey(aClient, aClient.getSessionId());
            };

            this.wsServer.onMessage = function (conn:any, msg:any) {
                console.log("MESSAGE RECEIVED", msg);
            };

            this.wsServer.onClose = function (conn:any) {
                that.removeClient(conn.$clientID);
                console.log("Disconnected!");
            };

            this.removeClient = function (id:any) {
                if (this.socketClients[id]) {
                    this.clientCount--;
                    this.socketClients[id].remove();
                    delete this.socketClients[id];
                }
            };

            this.wsServer.listen(RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT);
        };


        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         */
        setupCmdMap() {
            this.cmdMap = {};
            this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_JOINED] = this.onPlayerJoined;
        };


        /**
         * Checks all the clients to see if its ready for a new message.
         * If they are, have the client perform delta-compression on the worldDescription and send it off.
         * @param gameClock       The current (zero-based) game clock
         * @param worldDescription A description of all the entities currently in the world
         */
        public tick(gameClock: any, worldDescription: any) {
            var worldEntityDescriptionString = worldDescription.getEntityDescriptionAsString();
            var entityDescriptionObject = {
                entities: worldEntityDescriptionString,
                gameClock: worldDescription.gameClock,
                gameTick: worldDescription.gameTick
            };

            // Send client the current world info
            this.clients.forEach(function (key: any, client: any) {
                // Collapse delta - store the world state
                client.entityDescriptionBuffer.push(entityDescriptionObject);

                // Ask if enough time passed, and send a new world update
                if (client.canSendMessage(gameClock)) {
                    client.sendQueuedCommands(gameClock);
                }

            }, this);
        };


        // Socket.IO callbacks
        /**
         * Callback from socket.io when a client has connected
         * @param clientConnection
         */
        public  onSocketConnection(clientConnection: any) {

            var aClient = new RealtimeMultiplayerGame.network.Client(clientConnection, RealtimeMultiplayerGame.network.ServerNetChannel.getNextClientID());

            // Send the first message back to the client, which gives them a clientid
            var connectMessage = new RealtimeMultiplayerGame.model.NetChannelMessage(++this.outgoingSequenceNumber, aClient.getClientid(), true, RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT, {gameClock: this.delegate.getGameClock()});
            connectMessage.messageTime = this.delegate.getGameClock();
            aClient.getConnection().json.send(connectMessage);

            // Add to our list of connected users
            this.clients.setObjectForKey(aClient, aClient.getSessionId());
        };


        /**
         * Callback from socket.io when a client has disconnected
         * @param clientConnection
         */
        public onSocketClosed(clientConnection: any) {
            var client = this.clients.objectForKey(clientConnection.sessionId);
            if (!client) {
                console.warn("(ServerNetChannel)::onSocketClosed - ERROR - Attempting to remove client that was not found in our list! ");
                return;
            }

            this.delegate.shouldRemovePlayer(client.getClientid());
            this.clients.remove(clientConnection.sessionId);
            client.dealloc();

        };

        /**
         * Callback from socket.io when a ClientNetChannel has sent us a message
         * @param data
         * @param connection
         */
        public  onSocketMessage(data: any, connection: any) {
            var client = this.clients.objectForKey(connection.sessionId);
            //that.CMD_TO_FUNCTION[decodedMessage.cmds.cmd].apply(that, [connection, decodedMessage]);

            // Allow the client to track that data was received
            if (client) {
                client.onMessage(data);
            } else {
                console.log("(NetChannel)::onSocketMessage - no such client!");
                return;
            }

            //// Call the mapped function, always pass the connection. Also pass data if available
            if (this.cmdMap[data.cmd]) {
                this.cmdMap[data.cmd].call(this, client, data);
            } else if (this.delegate.cmdMap[data.cmd]) { // See if delegate has function mapped
                this.delegate.cmdMap[data.cmd].call(this.delegate, client, data);
            } else { // Display error
                console.log("(NetChannel)::onSocketMessage could not map '" + data.cmd + "' to function!");
            }
        };

        ////// Game callbacks
        /**
         * Callback for when a player has joined the match.
         * Note that joining the match, happens after connecting.
         * For example a player might be able to connect to the match, and watch the game for a while then want to join the match
         * @param client
         * @param data
         */
        public onPlayerJoined(client: any, data: any) {
            console.log(client.getClientid() + " joined the game!");
            this.delegate.shouldAddPlayer(client.getClientid(), data);
            client.getConnection().json.send(data);
        };


        /*************
         * ACCESSORS *
         *************/


        static getNextClientID() {
            return ++RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID;
        };

        /**
         * Checks that an object contains the required methods and sets it as the delegate for this ServerNetChannel instance
         * @param {RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol} aDelegate A delegate that conforms to RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol
         */
        setDelegate(aDelegate: any) {
            // Checks passed
            this.delegate = aDelegate;
        };

    }
}
