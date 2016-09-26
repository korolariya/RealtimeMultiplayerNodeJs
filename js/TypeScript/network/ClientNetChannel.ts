/// <reference path="../model/Constants.ts" />
/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../model/NetChannelMessage.ts" />
/// <reference path="../core/AbstractClientGame.ts" />
/// <reference path="../Client/BubbleDotsClientGame.ts" />
namespace RealtimeMultiplayerGame.network {
    import SortedLookupTable = RealtimeMultiplayerGame.lib.SortedLookupTable;
    export class ClientNetChannel {
        constructor(aDelegate: any) {
            this.setDelegate(aDelegate);
            this.setupSocketIO();
            this.setupCmdMap();
        }

        /**
         *  Object informed when ClientNetChannel does interesting stuff
         * @type {any}
         */
        public delegate: any = null;
        /**
         * Reference to singluar Socket.IO instance
         * @type {any}
         */
        public socketio: any = null;
        /**
         * A client id is set by the server on first connect
         * @type {any}
         */
        public clientid: any = null;

        // Settings
        /**
         * How often we can receive messages per sec
         */
        public cl_updateRate: any = RealtimeMultiplayerGame.Constants.CLIENT_SETTING.CMD_RATE;

        // connection info
        /**
         * Current latency time from server
         * @type {number}
         */
        public latency: any = 1000;
        /**
         * Time of last sent message
         * @type {number}
         */
        public lastSentTime: any = -1;
        /**
         * Time of last recieved message
         * @type {number}
         */
        public lastRecievedTime: any = -1;

        // Data
        /**
         * Store last N messages to be sent
         * @type {Array}
         */
        public messageBuffer: any = [];
        public outgoingSequenceNumber: any = 0;
        /**
         * Store last N received WorldDescriptions
         * @type {Array}
         */
        public incomingWorldUpdateBuffer: any = [];
        /**
         * We sent a 'reliable' message and are waiting for acknowledgement that it was sent
         * @type {any}
         */
        public reliableBuffer: any = null;
        /**
         * Map the CMD constants to functions
         * @type {{}}
         */
        public cmdMap: any = {};

        public connection: any;

        public lastReceivedTime: any;

        public nextUnreliable: any;

        public setupSocketIO() {
            // debugger;
            this.socketio = io.connect(RealtimeMultiplayerGame.Constants.SERVER_SETTING.GET_URI(), {
                transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
                reconnect: false,
                rememberTransport: false
            });

            var that = this;
            this.socketio.on('connect', function () {
                that.onSocketConnect()
            });
            this.socketio.on('message', function (obj: any) {
                that.onSocketDidAcceptConnection(obj)
            });
            this.socketio.on('disconnect', function () {
                that.onSocketDisconnect()
            });
        };

        public  setupWSClient() {
            var that = this;
            this.connection = new WebSocket("ws://localhost:" + RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT + "/");
            this.socketio = this.connection;
            this.connection.onopen = function () {
            };

            this.connection.onmessage = function (event: any) {
                var message = event.data;
                that.onSocketDidAcceptConnection(message);
            };
            this.connection.onclose = function (event: any) {
                that.onSocketDisconnect();
            };
        };

        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         */
        public  setupCmdMap() {
            this.cmdMap = {};
            this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.SERVER_FULL_UPDATE] = this.onServerWorldUpdate;
        };

        // SocketIO Callbacks
        public  onSocketConnect() {
            console.log("(ClientNetChannel):onSocketConnect", arguments, this.socketio);
        };

        /**
         * Called when ServerNetChannel has accepted your connection and given you a client id
         * This is only called once, use the info to set some properties
         */
        public onSocketDidAcceptConnection(aNetChannelMessage: any) {

            //  console.log("(ClientNetChannel)::onSocketDidAcceptConnection", aNetChannelMessage);

            // Should not have received this msg
            if (aNetChannelMessage.cmd != RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT) {
                throw "(ClientNetChannel):onSocketDidAcceptConnection recieved but cmd != SERVER_CONNECT ";
            }

            this.clientid = aNetChannelMessage.id;
            this.delegate.log("(ClientNetChannel)::ClientID - ");
            this.delegate.netChannelDidConnect(aNetChannelMessage);
            this.onSocketDidAcceptConnection = this.onSocketMessage;
        };


        /**
         * Called when Socket.io has received a new message
         * @param aNetChannelMessage
         */
        public  onSocketMessage(aNetChannelMessage: any) {
            this.lastReceivedTime = this.delegate.getGameClock();
            this.adjustRate(aNetChannelMessage);

            if (aNetChannelMessage.id == this.clientid) // We sent this, clear our reliable buffer que
            {
                if (aNetChannelMessage.cmd == RealtimeMultiplayerGame.Constants.CMDS.SERVER_FULL_UPDATE) {
                    //  IF CALLED THIS IS A BUG
                }

                var messageIndex = aNetChannelMessage.seq & RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_BUFFER;
                var message = this.messageBuffer[messageIndex];

                // Free up reliable buffer to allow for new message to be sent
                if (this.reliableBuffer === message) {
                    this.reliableBuffer = null;
                }

                // Remove from memory
                this.messageBuffer[messageIndex] = null;
                message = null;

                return;
            }

            // Call the mapped function
            if (this.cmdMap[aNetChannelMessage.cmd])
                this.cmdMap[aNetChannelMessage.cmd].call(this, aNetChannelMessage);
            else
                console.log("(NetChannel)::onSocketMessage could not map '" + aNetChannelMessage.cmd + "' to function!");
        };


        public onSocketDisconnect() {
            this.delegate.netChannelDidDisconnect();
            this.connection = null;
            this.socketio = null;
            console.log("(ClientNetChannel)::onSocketDisconnect", arguments);
        };


        /**
         * Send queued messages
         */
        public  tick() {
            // Can't send new message, still waiting for last imporant message to be returned
            if (this.reliableBuffer !== null) return;

            var hasReliableMessages = false;
            var firstUnreliableMessageFound: any = null;

            var len = this.messageBuffer.length;
            for (var i = 0; i < len; i++) {
                var message = this.messageBuffer[i];
                if (!message) continue;	// Slot is empty

                // We have more important things to tend to sir.
                if (message.isReliable) {
                    hasReliableMessages = true;
                    this.sendMessage(message);
                    return;
                }
            }

            // No reliable messages waiting, enough time has passed to send an update
            if (!hasReliableMessages && this.canSendMessage() && this.nextUnreliable != null) {
                this.sendMessage(this.nextUnreliable);
                this.nextUnreliable = null;
            }
        };


        /**
         *
         * @param aNetChannelMessage
         */
        public  onServerWorldUpdate(aNetChannelMessage: any) {
            var len = aNetChannelMessage.data.length;
            var i = -1;

            // Store all world updates contained in the message.
            while (++i < len) // Want to parse through them in correct order, so no fancy --len
            {
                var singleWorldUpdate = aNetChannelMessage.data[i];
                var worldEntityDescription = this.createWorldEntityDescriptionFromString(singleWorldUpdate);

                // Add it to the incommingCmdBuffer and drop oldest element
                this.incomingWorldUpdateBuffer.push(worldEntityDescription);
                if (this.incomingWorldUpdateBuffer.length > RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_BUFFER)
                    this.incomingWorldUpdateBuffer.shift();
            }
        };


        /**
         * Takes a WorldUpdateMessage that contains the information about all the elements inside of a string
         * and creates SortedLookupTable out of it with the entityid's as the keys
         * @param {String} aWorldUpdateMessage
         */
        public createWorldEntityDescriptionFromString(aWorldUpdateMessage: any) {
            // Create a new WorldEntityDescription and store the clock and gametick in it
            var worldDescription = new SortedLookupTable();
            worldDescription.gameTick = aWorldUpdateMessage.gameTick;
            worldDescription.gameClock = aWorldUpdateMessage.gameClock;


            var allEntities = aWorldUpdateMessage.entities.split('|'),
                allEntitiesLen = allEntities.length; //

            // Loop through each entity
            while (--allEntitiesLen)   // allEntities[0] is garbage, so by using prefix we avoid it
            {
                // Loop through the string representing the entities properties
                var entityDescAsArray = allEntities[allEntitiesLen].split(',');
                var entityDescription = BubbleDots.DemoClientGame.parseEntityDescriptionArray(entityDescAsArray); //TODO not work this

                // Store the final result using the entityid
                worldDescription.setObjectForKey(entityDescription, entityDescription.entityid);
            }


            return worldDescription;
        };

        /**
         * Sends a message via socket.io
         * @param aMessageInstance
         */
        public sendMessage(aMessageInstance: any) {
            if (this.socketio == undefined) {
                console.log("(ClientNetChannel)::sendMessage - socketio is undefined!");
                return;
            }

            if (!this.socketio.socket.connected) { // Socket.IO is not connectd, probably not ready yet
                // console.log("(ClientNetChannel)::sendMessage - socketio is undefined!");
                return;      //some error here
            }

            aMessageInstance.messageTime = this.delegate.getGameClock(); // Store to determine latency

            this.lastSentTime = this.delegate.getGameClock();

            if (aMessageInstance.isReliable) {
                this.reliableBuffer = aMessageInstance; // Block new connections
            }

            this.socketio.json.send(aMessageInstance);

            if (RealtimeMultiplayerGame.Constants.DEBUG_SETTING.CLIENT_NETCHANNEL_DEBUG) {
                console.log('(NetChannel) Sending Message, isReliable', aMessageInstance.isReliable, aMessageInstance);
            }
        };


        /**
         * Prepare a message for sending at next available time
         * @param isReliable
         * @param aCommandConstant
         * @param payload
         */
        public addMessageToQueue(isReliable: any, aCommandConstant: any, payload: any) {
            // Create a NetChannelMessage
            var message = new RealtimeMultiplayerGame.model.NetChannelMessage(this.outgoingSequenceNumber, this.clientid, isReliable, aCommandConstant, payload);

            // Add to array the queue using bitmask to wrap values
            this.messageBuffer[this.outgoingSequenceNumber & RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_BUFFER] = message;

            if (!isReliable) {
                this.nextUnreliable = message;
            }

            ++this.outgoingSequenceNumber;
            if (RealtimeMultiplayerGame.Constants.DEBUG_SETTING.CLIENT_NETCHANNEL_DEBUG) console.log('(NetChannel) Adding Message to queue', this.messageBuffer[this.outgoingSequenceNumber & RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_BUFFER], " ReliableBuffer currently contains: ", this.reliableBuffer);
        };


        /**
         * Adjust the message chokerate based on latency
         * @param serverMessage
         */
        public  adjustRate(serverMessage: any) {
            this.latency = serverMessage.gameClock - this.delegate.getGameClock();
        };


        ///// Memory
        /**
         * Clear memory
         */
        public   dealloc() {
            this.connection.close();
            delete this.connection;
            delete this.messageBuffer;
            delete this.incomingWorldUpdateBuffer;
        };

        ///// Accessors
        /**
         * Set the NetChannelDelegate after validation
         * @param aDelegate
         */
        public setDelegate(aDelegate: any) {
            //TODO check instance
            // Checks passed
            this.delegate = aDelegate;
        };

        /**
         * Determines if it's ok for the client to send a unreliable new message yet
         */
        public  canSendMessage() {
            return (this.delegate.getGameClock() > this.lastSentTime + this.cl_updateRate);
        };

        public getClientid() {
            return this.clientid
        };

        public  getIncomingWorldUpdateBuffer() {
            return this.incomingWorldUpdateBuffer
        };

        public  getLatency() {
            return this.latency
        };


    }
}

