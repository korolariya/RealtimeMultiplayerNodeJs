/// <reference path="../core/AbstractServerGame.ts" />
/// <reference path="./BubbleDotsConstants.ts" />
/// <reference path="../lib/circlecollision/CircleManager.ts" />
/// <reference path="../model/Constants.ts" />
/// <reference path="../Entities/CircleEntity.ts" />
/// <reference path="../Entities/PlayerEntity.ts" />
/// <reference path="../Traits/PoisonTrait.ts" />
namespace BubbleDots {
    export class DemoServerGame extends RealtimeMultiplayerGame.AbstractServerGame {
        constructor() {
            super();
            this.setGameDuration(BubbleDots.Constants.GAME_DURATION);
            this.setupCollisionManager();
            this.setupRandomField();
        }

        public collisionManager: any = null;

        public setupCollisionManager() {
            // Collision simulation
            this.collisionManager = new RealtimeMultiplayerGame.modules.circlecollision.CircleManager();
            this.collisionManager.setCallback(BubbleDots.DemoServerGame.onCollisionManagerCollision, this);
        };

        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
         * If it is set, it will call that CMD on its delegate
         */
        public setupCmdMap() {
            super.setupCmdMap();
            this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
        };

        /**
         * Called when the collision manager detects a collision
         */
        public static onCollisionManagerCollision(ci:any, cj:any, v:any) {
            ci.delegate.onCollision(ci.delegate, cj.delegate, v.clone());
            cj.delegate.onCollision(ci.delegate, cj.delegate, v.clone());
        };


        /**
         * Randomly places some CircleEntities into game
         */
        public setupRandomField() {
            //RealtimeMultiplayerGame.model.noise(10, 10, i/total)
            var total = BubbleDots.Constants.MAX_CIRCLES;
            for (var i = 0; i < total; i++) {
                var radius = BubbleDots.Constants.ENTITY_DEFAULT_RADIUS;
                var entity = this.createEntity(BubbleDots.CircleEntity, radius, this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID);

                // Randomly make the object 'food' or 'poison'
                if (i % 5 === 0) {
                    entity.addTraitAndExecute(new BubbleDots.traits.PoisonTrait());
                } else {
                    entity.addTraitAndExecute(new BubbleDots.traits.MobTrait(this));
                    entity.addTraitAndExecute(new BubbleDots.traits.HuntTrait(this.fieldController));
                }
            }
        };


        /**
         * Helper method to create a single CircleEntity
         * @param aBubbleDotEntityConstructor
         * @param {Number} aRadius
         * @param {Number} anEntityid
         * @param {Number} aClientid
         */
        public  createEntity(aBubbleDotEntityConstructor:any, aRadius:number, anEntityid:number, aClientid:number) {
            // Create the GameEntity
            var circleEntity = new aBubbleDotEntityConstructor(anEntityid, aClientid);
            circleEntity.position.set(Math.random() * BubbleDots.Constants.GAME_WIDTH * 20, Math.random() * BubbleDots.Constants.GAME_HEIGHT);

            // Create a randomly sized circle, that will represent this entity in the collision manager
            var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
            circleEntity.setCollisionCircle(collisionCircle);
            circleEntity.setRadius(aRadius);

            // Place the circle and collision circle into corresponding containers
            this.collisionManager.addCircle(circleEntity.getCollisionCircle());
            this.fieldController.addEntity(circleEntity);

            return circleEntity;
        };


        /**
         * @inheritDoc
         */
        public tick() {
            this.collisionManager.handleCollisions();
            // BubbleDots.lib.TWEEN.update();
            // Note we call superclass's implementation after we're done
            super.tick();
        };


        /**
         * @inheritDoc
         */
        public   shouldAddPlayer(aClientid:number, data:any) {
            var center = new RealtimeMultiplayerGame.model.Point(BubbleDots.Constants.GAME_WIDTH / 2, BubbleDots.Constants.GAME_HEIGHT / 2);
            var playerEntity = this.createEntity(BubbleDots.PlayerEntity, BubbleDots.Constants.ENTITY_DEFAULT_RADIUS, this.getNextEntityID(), aClientid);
            playerEntity.position = center.clone();
            playerEntity.getCollisionCircle().setPosition(center.clone());
            playerEntity.setInput(new RealtimeMultiplayerGame.Input.Keyboard());
            playerEntity.setColor("4");
            playerEntity.addTraitAndExecute(new BubbleDots.traits.ShotTrait(this));
            this.fieldController.addPlayer(playerEntity);
        };


        /**
         * @inheritDoc
         */
        public   shouldUpdatePlayer(aClientid: number, data: any) {
            var entity = this.fieldController.getEntityWithid(data.payload.entityid);
            entity.input.deconstructInputBitmask(data.payload.input);
            entity.input.lookAtVector = data.payload.mouse;
        };

        /**
         * @inheritDoc
         */
        public  shouldRemovePlayer(aClientid: number) {
            var entity = this.fieldController.getPlayerWithid(aClientid);
            if (entity) {
                this.collisionManager.removeCircle(entity.getCollisionCircle());
            }
            super.shouldRemovePlayer(aClientid);
        };


    }
}
