/**
 File:
 PoisonTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:

 Basic Usage:

 */
(function () {
    BubbleDots.namespace("BubbleDots.traits");

    BubbleDots.traits.ShotTrait = function (aServerGame) {
        BubbleDots.traits.ShotTrait.superclass.constructor.call(this);
        this._serverGame = aServerGame;
    };

    BubbleDots.traits.ShotTrait.prototype = {
        displayName: "ShotTrait",					// Unique string name for this Trait
        color: "2",
        _serverGame: null,
        lockedShot: false,

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.BulletTrait.superclass.attach.call(this, anEntity);
            this.intercept(['otherControls']);
        },
        otherControls: function (gameTick) {
            var player = this;
            if (player.input.isSpace()) {
                var trait = player.getTraitWithName("ShotTrait");
                if (!trait.lockedShot) {
                    trait.createBulletEntity(trait.calculatePositionShotGun(player), player.input.lookAtVector);
                }
            }
        },

        calculatePositionShotGun: function (player) {
            var position = player.position.clone();
            position.x += -40 * player.input.lookAtVector[0] / Math.sqrt(Math.pow(player.input.lookAtVector[0], 2) + Math.pow(player.input.lookAtVector[1], 2));
            position.y += -40 * player.input.lookAtVector[1] / Math.sqrt(Math.pow(player.input.lookAtVector[0], 2) + Math.pow(player.input.lookAtVector[1], 2));
            return position;
        },
        createBulletEntity: function (position, targetVector) {
            var trait = this;
            // // Create the GameEntity
            var gunEntity = new BubbleDots.BulletEntity(trait._serverGame.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID);
            gunEntity.position.set(position.x, position.y);
            var targetPointVector = new RealtimeMultiplayerGame.model.Point(-targetVector[0], -targetVector[1]);
            gunEntity.targetVector = targetPointVector.clone();
            gunEntity.addTraitAndExecute(new BubbleDots.traits.BulletTrait(trait._serverGame.collisionManager, trait._serverGame.fieldController));
            // Create a randomly sized circle, that will represent this entity in the collision manager
            var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
            gunEntity.setCollisionCircle(collisionCircle);
            gunEntity.setRadius(BubbleDots.Constants.BULLET_DEFAULT_RADIUS);

            // Place the circle and collision circle into corresponding containers
            trait._serverGame.collisionManager.addCircle(gunEntity.getCollisionCircle());
            trait._serverGame.fieldController.addEntity(gunEntity);
            trait.enableLockShot();
            setTimeout(function () {
                trait.disableLockShot();
            }, gunEntity.timeShot);

            return gunEntity;
        },
        enableLockShot: function () {
            this.lockedShot = true;
        },
        disableLockShot: function () {
            this.lockedShot = false;
        }


    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.ShotTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();
