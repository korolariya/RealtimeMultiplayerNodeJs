(function () {
    BubbleDots.BulletEntity = function (anEntityid, aClientid) {
        BubbleDots.BulletEntity.superclass.constructor.call(this, anEntityid, aClientid);
        this.entityType = BubbleDots.Constants.ENTITY_TYPES.BULLET_ENTITY;
        this.radius = BubbleDots.Constants.BULLET_DEFAULT_RADIUS;
        this.timeShot = 1000;
        this.live = false;
        this.timeBirth = 0;
        this.speed = 10;
        this.playerVelocity = new RealtimeMultiplayerGame.model.Point(0, 0);
    };

    BubbleDots.BulletEntity.prototype = {

        updatePosition: function (speedFactor, gameClock, gameTick) {
            // var moveSpeed = 0.5;

            this.velocity = this.playerVelocity.clone();

            this.acceleration.x += this.speed * this.targetVector.x / Math.sqrt(Math.pow(this.targetVector.x, 2) + Math.pow(this.targetVector.y, 2));
            this.acceleration.y += this.speed * this.targetVector.y / Math.sqrt(Math.pow(this.targetVector.x, 2) + Math.pow(this.targetVector.y, 2));



            this.handleAcceleration(speedFactor, gameClock, gameTick);
            if (!this.live) {
                this.live = true;
                this.timeBirth = gameClock;
            }
            if (this.live) {
                if (this.timeBirth + this.timeShot <= gameClock) {
                    this.destroy();
                }
            }
        },
        destroy: function () {
            var trait = this.getTraitWithName("BulletTrait");
            trait._collisionManager.removeCircle(this.getCollisionCircle());
            trait._fieldController.removeEntity(this.entityid);
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
            this.collisionCircle.collisionMask = 3;
            this.collisionCircle.collisionGroup = 3;
        }


    };
    RealtimeMultiplayerGame.extend(BubbleDots.BulletEntity, BubbleDots.CircleEntity, null);
})();
