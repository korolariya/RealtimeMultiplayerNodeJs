/// <reference path="./AbstractGame.ts" />
namespace RealtimeMultiplayerGame {
    export class AbstractServerGame extends RealtimeMultiplayerGame.AbstractGame {
        constructor() {
            super();
            this.intervalFramerate += 6;
        }

        /**
         * Map the CMD constants to functions
         * @type {{}}
         */
        public cmdMap: any = {};
        /**
         * Incremented for everytime a new object is created
         * @type {number}
         */
        public nextEntityID: number = 0;

        // Methods
        public   setupNetChannel() {
            // this.netChannel = new RealtimeMultiplayerGame.network.ServerNetChannel(this);
        };

        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
         * If it is set, it will call that CMD on its delegate
         */
        public setupCmdMap() {
        }

        /**
         * Updates the gameworld
         * Creates a WorldEntityDescription which it sends to NetChannel
         */
        public  tick() {
            super.tick();
            // Allow all entities to update their position
            this.fieldController.getEntities().forEach(function (key:any, entity:any) {
                entity.updatePosition(this.speedFactor, this.gameClock, this.gameTick);
            }, this);

            // Create a new world-entity-description,
            // var worldEntityDescription = new RealtimeMultiplayerGame.model.WorldEntityDescription(this, this.fieldController.getEntities());
            // this.netChannel.tick(this.gameClock, worldEntityDescription);

            if (this.gameClock > this.gameDuration) {
                this.shouldEndGame();
            }
        }

        public  shouldEndGame() {
            // console.log("(AbstractServerGame)::shouldEndGame");
        };


        public shouldUpdatePlayer(client: number, data: any) {
            // console.log("(AbstractServerGame)::onPlayerUpdate");
        };


        public  shouldRemovePlayer(clientid: number) {
            this.fieldController.removePlayer(clientid);
        };

        //         ///// Accessors
        public  getNextEntityID(): number {
            return ++this.nextEntityID;
        }


    }
}
