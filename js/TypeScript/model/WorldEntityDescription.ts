namespace RealtimeMultiplayerGame.model {
    export class WorldEntityDescription {
        constructor(aGameInstance:any, allEntities:any) {
            this.gameClock = aGameInstance.getGameClock();
            this.gameTick = aGameInstance.getGameTick();
            this.allEntities = allEntities;
            // Ask each entity to create it's EntityDescriptionString
            this.entities = [];
        }

        public entities:any = null;
        public gameClock = 0;
        public gameTick = 0;
        public allEntities:any;

        /**
         * Ask each entity to create it's entity description
         * Returns a single snapshot of the worlds current state as a '|' delimited string
         * @return {String} A '|' delmited string of the current world state
         */
        public getEntityDescriptionAsString() {
            var len = this.allEntities.length;
            var fullDescriptionString = '';

            this.allEntities.forEach(function (key:any, entity:any) {
                var entityDescriptionString = entity.constructEntityDescription(this.gameTick);
                fullDescriptionString += "|" + entityDescriptionString;
            }, this);
            return fullDescriptionString;
        }
    }
}

