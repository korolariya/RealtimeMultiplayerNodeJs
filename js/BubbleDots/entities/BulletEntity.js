(function () {
    BubbleDots.BulletEntity = function (anEntityid, aClientid) {
        BubbleDots.BulletEntity.superclass.constructor.call(this, anEntityid, aClientid);
        this.entityType = BubbleDots.Constants.ENTITY_TYPES.BULLET_ENTITY;
        var self = this;
        setTimeout(function () {
            self.destroy();
        }, 1000)
    };

    BubbleDots.BulletEntity.prototype = {

        updatePosition: function (speedFactor, gameClock, gameTick) {
            var moveSpeed = 0.5;
            this.acceleration.x += moveSpeed * this.targetVector.x / Math.sqrt(Math.pow(this.targetVector.x, 2) + Math.pow(this.targetVector.y, 2));
            this.acceleration.y += moveSpeed * this.targetVector.y / Math.sqrt(Math.pow(this.targetVector.x, 2) + Math.pow(this.targetVector.y, 2));
            this.handleAcceleration(speedFactor, gameClock, gameTick);
            // console.log(gameClock);
        },
        targetVector: {
            x: 0,
            y: 0
        },
        test: {},
        destroy: function (aClientid) {
            var self = this;
            self.test.collisionManager.removeCircle(self.getCollisionCircle());
            self.test.fieldController.removeEntity(self.entityid);

        },
        setTest: function (aTest) {
            this.test = aTest;
        }

    };
    RealtimeMultiplayerGame.extend(BubbleDots.BulletEntity, BubbleDots.CircleEntity, null);
})();
