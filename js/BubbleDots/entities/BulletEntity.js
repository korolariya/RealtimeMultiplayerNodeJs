(function () {
    BubbleDots.BulletEntity = function (anEntityid, aClientid) {
        BubbleDots.BulletEntity.superclass.constructor.call(this, anEntityid, aClientid);
        this.entityType = BubbleDots.Constants.ENTITY_TYPES.BULLET_ENTITY;
        var self = this;
        setTimeout(function () {
            self.destroy();
        }, 500)
    };

    BubbleDots.BulletEntity.prototype = {

        updatePosition: function (speedFactor, gameClock, gameTick) {
            var moveSpeed = 1;
            this.acceleration.y -= moveSpeed;
            this.handleAcceleration(speedFactor, gameClock, gameTick);
            // console.log(gameClock);
        },
        test: {},
        destroy: function () {
            console.log('test');
            // this.test.collisionManager.removeCircle(this);
            this.test.fieldController.removeEntity(this);
        },
        setTest: function (aTest) {
            this.test = aTest;
        }

    };
    RealtimeMultiplayerGame.extend(BubbleDots.BulletEntity, BubbleDots.CircleEntity, null);
})();
