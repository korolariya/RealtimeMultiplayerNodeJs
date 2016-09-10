(function () {
    BubbleDots.BulletEntity = function (anEntityid, aClientid) {
        BubbleDots.BulletEntity.superclass.constructor.call(this, anEntityid, aClientid);
        this.entityType = BubbleDots.Constants.ENTITY_TYPES.BULLET_ENTITY;
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
        onCollision: function (a, b, collisionNormal) {
        },
        setCollisionCircle: function (aCollisionCircle) {
            this.collisionCircle = aCollisionCircle;
            this.collisionCircle.setDelegate(this);
            this.collisionCircle.setPosition(this.position.clone());
            this.collisionCircle.setRadius(this.radius);
            this.collisionCircle.collisionMask = 2;
            this.collisionCircle.collisionGroup = 1;
        }


    };
    RealtimeMultiplayerGame.extend(BubbleDots.BulletEntity, BubbleDots.CircleEntity, null);
})();
