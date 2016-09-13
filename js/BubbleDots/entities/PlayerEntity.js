/**
 File:
 BubbleDots.CircleEntity
 Created By:
 Mario Gonzalez
 Project:
 BubbleDots
 Abstract:
 This is the base entity for the demo game
 Basic Usage:

 Version:
 1.0
 */
(function () {
    BubbleDots.PlayerEntity = function (anEntityid, aClientid) {
        BubbleDots.PlayerEntity.superclass.constructor.call(this, anEntityid, aClientid);
        this.entityType = BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY;
    };

    BubbleDots.PlayerEntity.prototype = {
        /**
         * Update position of this entity - this is only called on the serverside
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            this.handleInput(speedFactor);
            BubbleDots.PlayerEntity.superclass.updatePosition.call(this, speedFactor, gameClock, gameTick);
        },
        bullets: [],
        handleInput: function (speedFactor) {
            var moveSpeed = 0.2;

            if (this.input.isLeft()) this.acceleration.x -= moveSpeed;
            if (this.input.isRight()) this.acceleration.x += moveSpeed;
            if (this.input.isDown()) this.acceleration.y += moveSpeed;
            if (this.input.isUp()) this.acceleration.y -= moveSpeed;

            if (this.input.isSpace()||this.input.isMouse()) {
                var self = this;
                var radius = BubbleDots.Constants.BULLET_DEFAULT_RADIUS;
                var createPosition = self.position.clone();
                createPosition.x += -40 * self.input.lookAtVector[0] / Math.sqrt(Math.pow(self.input.lookAtVector[0], 2) + Math.pow(self.input.lookAtVector[1], 2));
                createPosition.y += -40 * self.input.lookAtVector[1] / Math.sqrt(Math.pow(self.input.lookAtVector[0], 2) + Math.pow(self.input.lookAtVector[1], 2));

                self.test.createBulletEntity(
                    BubbleDots.BulletEntity,
                    radius,
                    self.test.getNextEntityID(),
                    self.clientid,
                    createPosition,
                    self.input.lookAtVector);
            }

        },

        test: function () {

        },

        setTest: function (aTest) {
            this.test = aTest;
        },

        ///// ACCESSORS
        /**
         * Set the CollisionCircle for this game entity.
         * @param aCollisionCircle
         */
        setCollisionCircle: function (aCollisionCircle) {
            BubbleDots.PlayerEntity.superclass.setCollisionCircle.call(this, aCollisionCircle);
            this.collisionCircle.collisionMask = 2;
            this.collisionCircle.collisionGroup = 1;
            this.collisionCircle.isFixed = true;
        },
        setInput: function (input) {
            this.input = input;
        }
    };

    // extend RealtimeMultiplayerGame.model.GameEntity
    RealtimeMultiplayerGame.extend(BubbleDots.PlayerEntity, BubbleDots.CircleEntity, null);
})();
