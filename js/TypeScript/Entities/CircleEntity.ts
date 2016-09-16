/// <reference path="../model/GameEntity.ts" />
/// <reference path="../model/Point.ts" />
namespace BubbleDots {
    export class CircleEntity extends RealtimeMultiplayerGame.model.GameEntity {
        constructor(anEntityid: number, aClientid: number) {
            super(anEntityid, aClientid);

            this.entityType = BubbleDots.Constants.ENTITY_TYPES.CANDY_ENTITY;
            this.originalColor = null;
            this.velocity = new RealtimeMultiplayerGame.model.Point(0, 0);
            this.acceleration = new RealtimeMultiplayerGame.model.Point(0, 0);
        }

        public health: any = 100;
        public radius: any = BubbleDots.Constants.ENTITY_DEFAULT_RADIUS;
        public velocity: any = new RealtimeMultiplayerGame.model.Point();
        public acceleration: any = new RealtimeMultiplayerGame.model.Point();
        public collisionCircle: any = null;										// An instance of RealtimeMultiplayerGame.modules.circlecollision.PackedCircle
        public entityType: any = null;
        public color: any = "2";
        public originalColor: any = "2";
        public tween: any = null;

        // Movement properties
        public velocityMax: number = 8.0;
        public velocityDamping: number = 0.98;
        public timeout: any = null;
        public scale: any = null;
        public view:any = null;


        /**
         * Update the entity's view - this is only called on the clientside
         */
        public updateView() {
            if (!this.view) return;

            this.view.x = this.position.x;// - this.radius;
            this.view.y = this.position.y;// - this.radius;
            this.view.setScale(this.lastReceivedEntityDescription.scale * 0.01, this.lastReceivedEntityDescription.scale * 0.01);
            return;

            // let diameter = this.lastReceivedEntityDescription.radius * 2;
            // this.view.setSize(diameter, diameter);
            // this.view.setFillStyle("#" + this.lastReceivedEntityDescription.color); // Random color
        };

        /**
         * Update position of this entity - this is only called on the serverside
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        public updatePosition(speedFactor: any, gameClock: any, gameTick: any) {
            this.handleAcceleration(speedFactor, gameClock, gameTick);
        };


        public handleAcceleration(speedFactor: any, gameClock: any, gameTick: any) {
            if (this.collisionCircle) {
                this.velocity.translatePoint(this.acceleration);
                this.velocity.multiply(this.velocityDamping);

                this.collisionCircle.position.translatePoint(this.velocity);
                this.position = this.collisionCircle.position.clone();

                this.acceleration.set(0, 0);
            }
        };


        /**
         * Called when this object has collided with another
         * @param a        Object A in the collision pair, note this may be this object
         * @param b        Object B in the collision pair, note this may be this object
         * @param collisionNormal    A vector describing the collision
         */
        public onCollision(a: any, b: any, collisionNormal: any) {
        };


        public tempColor() {
            clearTimeout(this.timeout);
            this.color = "1";
            this.timeout = setTimeout(()=> {
                this.setColor(this.originalColor);
            }, 50);
        };

        /**
         * Deallocate memory
         */
        public dealloc() {
            // this.collisionCircle.dealloc();
            this.collisionCircle = null;

            super.dealloc();
        };

        public constructEntityDescription(gameTick: any, wantsFullUpdate: any) {
            var entityDesc = super.constructEntityDescription(gameTick, wantsFullUpdate);
            entityDesc += ',' + ~~(this.scale * 100);
            entityDesc += ',' + this.color;
            entityDesc += ',' + this.getHealth();

            return entityDesc;
        };

        public getHealth() {
            return this.health;
        };

        public setHealth(health: number) {
            this.health = health;
        };

        ///// ACCESSORS
        /**
         * Set the CollisionCircle for this game entity.
         * @param aCollisionCircle
         */
        public setCollisionCircle(aCollisionCircle: any) {
            this.collisionCircle = aCollisionCircle;
            this.collisionCircle.collisionMask = 3;
            this.collisionCircle.collisionGroup = 2;
            this.collisionCircle.setDelegate(this);
            this.collisionCircle.setPosition(this.position.clone());
            this.collisionCircle.setRadius(this.radius);
        };

        public getCollisionCircle() {
            return this.collisionCircle
        };

        /**
         * Set the color of this entity, a property originalColor is also stored
         * @param aColor
         */
        public setColor(aColor: any) {
            if (!this.originalColor) {
                this.originalColor = aColor;
            }

            this.color = aColor;
        };

        public getColor() {
            return this.color
        };

        public getOriginalColor() {
            return this.originalColor
        };

        public setRadius(aRadius: any) {
            this.radius = aRadius;
            this.collisionCircle.setRadius(this.radius);
            this.scale = this.radius / BubbleDots.Constants.ENTITY_DEFAULT_RADIUS;
        };

        public getRadius() {
            return this.radius;
        };

    }
}
