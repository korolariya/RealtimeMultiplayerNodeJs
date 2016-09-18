namespace RealtimeMultiplayerGame.model {
    export class NetChannelMessage {
        constructor(aSequenceNumber, aClientid, isReliable, aCommandType, aPayload) {
            // Info
            this.seq = aSequenceNumber;
            this.id = aClientid; 					// Server gives us one when we first  connect to it
            this.cmd = aCommandType;

            // Data
            this.payload = aPayload;

            // State
            this.messageTime = -1;
            this.isReliable = isReliable;
        }

        // This message MUST be sent if it is 'reliable' (Connect / Disconnect).
        // If not it can be overwritten by newer messages (for example moving is unreliable, because once it's outdates its worthless if new information exist)
        public isReliable = false;
        public cmd = 0;
        public aPayload = null;
        public seq = -1;
        public id = -1;
        public messageTime = -1;

        /**
         * Wrap the message with useful information before sending, optional BiSON or something can be used to compress the message
         */
        public  encodeSelf() {
            if (this.id == -1) {
                console.log("(Message) Sending message without clientid. Note this is ok, if it's the first message to the server.");
            }

            if (this.messageTime == -1) {
                console.log("(Message) Sending message without messageTime. Expected result is undefined");
            }

            return {id: this.clientid, seq: this.sequenceNumber, cmds: this.unencodedMessage, t: this.messageTime}
        }
    }
}

