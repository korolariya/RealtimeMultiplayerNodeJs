import SortedLookupTable from "../lib/SortedLookupTable.d.ts";
namespace RealtimeMultiplayerGame.Controller {
    export class FieldController {
        constructor() {
            this.entities = new SortedLookupTable();
            this.players = new SortedLookupTable();
        }

        /**
         * A SortedLookupTable for all entities
         * @type {any}
         */
        public entities: any = null;
        /**
         * A SortedLookupTable for players only, stored using client.getClientid()
         * @type {any}
         */
        public players: any = null;

        public view: any;

        /**
         * Update all entities
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        public tick(speedFactor: number, gameClock: number, gameTick: number) {
            // DO SOME STUFF
        };


        /**
         * Internal function. Adds an entity to our collection, and adds it to the view if we have one
         * @param anEntity    An entity to add, should already be created and contain a unique entityid
         */
        public addEntity(anEntity: any) {
            this.entities.setObjectForKey(anEntity, anEntity.entityid);

            // If we have a view, then add the player to it
            if (this.view) {
                this.view.addEntity(anEntity.getView());
            }

        };


        /**
         * Updates the entity based on new information (called by AbstractClientGame::renderAtTime)
         * @param {int}        entityid    entityid we want to update
         * @param {RealtimeMultiplayerGame.model.Point}    newPosition    position
         * @param {Number}    newRotation    rotation
         * @param {Object}    newEntityDescription The full contents of the the snapshots newEntityDescription
         */
        public  updateEntity(entityid: number, newPosition: any, newRotation: number, newEntityDescription: any) {
            var entity = this.entities.objectForKey(entityid);

            if (entity != null) {
                entity.position.x = newPosition.x;
                entity.position.y = newPosition.y;
                entity.rotation = newRotation;
                entity.setHealth(newEntityDescription.health);
                entity.lastReceivedEntityDescription = newEntityDescription;
            } else {
                console.log("(FieldController)::updateEntity - Error: Cannot find entity with entityid", entityid);
            }
        };

// Memory

        public addPlayer(aPlayerEntity: any) {
            this.addEntity(aPlayerEntity);
            this.players.setObjectForKey(aPlayerEntity, aPlayerEntity.clientid);
        };


        /**
         * Remove a player.
         * Does player stuff, then calls removeEntity.
         * @param clientid    ConnectionID of the player who jumped out of the game
         */
        public  removePlayer(clientid: any) {
            var player = this.players.objectForKey(clientid);
            if (!player) {
                console.log("(FieldController), No 'Character' with clientid " + clientid + " ignoring...");
                return;
            }

            this.removeEntity(player.entityid);
            this.players.remove(player.clientid);
        };


        /**
         * Removes an entity by it's ID
         * @param entityid
         */
        public removeEntity(entityid: number) {
            var entity = this.entities.objectForKey(entityid);

            if (this.view)
                this.view.removeEntity(entity.view);

            entity.dealloc();
            this.entities.remove(entityid);
        };

        /**
         * Checks an array of "active entities", against the existing ones.
         * It's used to remove entities that expired in between two updates
         * @param activeEntities
         */
        public removeExpiredEntities(activeEntities: any) {
            var entityKeysArray = this.entities._keys;
            var i = entityKeysArray.length;
            var key: number;
            var totalRemoved = 0;

            while (i--) {
                key = entityKeysArray[i];

                // This entity is still active. Move along.
                if (activeEntities[key])
                    continue;

                // This entity is not active, check if it belongs to the server
                var entity = this.entities.objectForKey(key);
                var isPlayer = this.players.objectForKey(entity.clientid) != null;


                // Remove special way if player (which calls removeEntity on itself as well), or just remove it as an entity
                if (isPlayer) {
                    this.removePlayer(entity.clientid);
                } else {
                    this.removeEntity(entity.entityid);
                }

                totalRemoved++;
            }

        };

        public dealloc() {
            this.players.forEach(function (key: number, entity: any) {
                this.removePlayer(entity.clientid);
            }, this);
            this.players.dealloc();
            this.players = null;

            this.entities.forEach(function (key: number, entity: any) {
                this.removeEntity(entity.entityid);
            }, this);
            this.entities.dealloc();
            this.entities = null;


            this.view = null;
        };

        // Accessors
        /**
         *  Will be called on client side
         */
        public   setView(aView: any) {
            // Checks passed
            this.view = aView;
        };

        public getView() {
            return this.view
        };

        public getEntities() {
            return this.entities
        };

        public getPlayers() {
            return this.players;
        };

        public getEntityWithid(anEntityid: number) {
            return this.entities.objectForKey(anEntityid);
        };

        public getPlayerWithid(aClientid: number) {
            return this.players.objectForKey(aClientid);
        };


    }
}
