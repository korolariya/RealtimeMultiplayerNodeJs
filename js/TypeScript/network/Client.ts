namespace RealtimeMultiplayerGame.network {
    import SortedLookupTable = RealtimeMultiplayerGame.lib.SortedLookupTable;
    export class Client {
        constructor(aConnection:any, aClientid:any) {
            this.clientid = aClientid;
            this.connection = aConnection;

            if (!this.connection.sessionId) { // No sessionId variable means we're not using socket.io - just set that property to use our clientid
                this.connection.sessionId = aClientid;
            }

            this.stagnantEntities = new SortedLookupTable();
        }

        /**
         * SocketIO connection for this specific client
         */
        public connection: any = null;
        /**
         *  UUID for this client
         * @type {number}
         */
        public clientid:any = -1;
        // Configuration
        public cl_updateRate:any = RealtimeMultiplayerGame.Constants.CLIENT_SETTING.UPDATE_RATE;		// How often we can receive messages per sec
        /**
         * Store array of incoming messages, slots are resused
         * @type {Array}
         */
        public outgoingMessageBuffer:any = [];
        /**
         * Number of total outgoing messages received
         * @type {number}
         */
        public outgoingSequenceNumber:any = 0;
        /**
         * Store array of incoming messages, slots are resused
         */
        public incomingMessageBuffer:any = [];
        /**
         * Number of total incoming messages received
         * @type {number}
         */
        public incomingSequenceNumber:any = 0;
        /**
         * Store WorldEntityDescriptions before ready to send
         */
        public entityDescriptionBuffer:any = [];

        /**
         * Used to track if we can send a new message to this user
         * @type {number}
         */
        public lastSentMessageTime:any = -1;
        public lastReceivedMessageTime:any = -1;

        // Entries that have not changed since the last frame
        public stagnantEntities:any = null;

        public onMessage(messageData:any) {
            var messageIndex = this.incomingSequenceNumber & RealtimeMultiplayerGame.Constants.CLIENT_SETTING.UPDATE_RATE;
            this.incomingSequenceNumber++;
        };


        public dealloc() {
            this.outgoingMessageBuffer = null;
            this.incomingMessageBuffer = null;
            this.entityDescriptionBuffer = null;
            this.stagnantEntities.dealloc();
            this.stagnantEntities = null;
            this.connection.removeAllListeners();
            this.connection = null;
        };

        /**
         * Compares the worldDescription to the last one we sent - removes unchanged values
         * @param worldDescription A description of all the entities currently in the world
         * @param gameClock           The current (zero-based) game clock
         */
        public compressDeltaAndQueueMessage(worldDescription:any, gameClock:any) {
            //debugger;
            var allEntities = worldDescription.entities,
                len = allEntities.length;

            var resultDescStr = '';
            while (len--) {
                var anEntityDescStr = allEntities[len],
                    anEntityDesc = anEntityDescStr.split(','),
                    entityid = +anEntityDesc[0],
                    clientid = +anEntityDesc[1];


                var hasNewData = true;
                if (clientid == RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID) {
                    var previouslySentEntityDescription = this.stagnantEntities.objectForKey(entityid);
                    if (previouslySentEntityDescription) {
                        // hasNewData = false;
                    }
                }

                // Only send if it has new data
                if (hasNewData) {
                    resultDescStr += "|" + anEntityDescStr;
                }
            }
            var entityDescriptionObject:any = {};
            entityDescriptionObject.entities = resultDescStr;
            entityDescriptionObject.gameClock = worldDescription.gameClock;
            entityDescriptionObject.gameTick = worldDescription.gameTick;

            this.entityDescriptionBuffer.push(entityDescriptionObject);
        };

        /**
         * Sends the current cmdBuffer
         */
        public sendQueuedCommands(gameClock:any) {
            var message:any = {
                gameClock: gameClock,
                id: RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID,
                seq: this.outgoingSequenceNumber,
                cmd: RealtimeMultiplayerGame.Constants.CMDS.SERVER_FULL_UPDATE,
                data: this.entityDescriptionBuffer
            };

            this.sendMessage(message, gameClock);

            this.entityDescriptionBuffer = [];
        };

        /**
         * Send an encoded (and delta compressed) message to the connection
         * @param message
         * @param gameClock           The current (zero-based) game clock
         */
        public sendMessage(message:any, gameClock:any) {
            this.lastSentMessageTime = gameClock;

            // Send and increment our message count
            this.connection.json.send(message);
            this.outgoingSequenceNumber++;
        };


///// MEMORY


///// ACCESSORS
        /**
         * Returns true if its ok to send this client a new message
         * @param {Number} gameClock
         */
        canSendMessage(gameClock:any) {
            return (gameClock - this.lastSentMessageTime) > this.cl_updateRate;
        };

        /**
         * Returns the sessionId as created by Socket.io for this client
         * @return {String} A hash representing the session id
         */
        getSessionId() {
            return this.connection.sessionId;
        };

        /**
         * UUID given to us by ServerNetChannel
         * This is used instead of sessionid since we send this around a lot and sessionid is a 12 digit string
         */
        getClientid() {
            return this.clientid;
        };

        /**
         * @return {
		 */
        getConnection() {
            return this.connection;
        };


    }
}
