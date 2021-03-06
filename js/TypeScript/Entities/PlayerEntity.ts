namespace BubbleDots {
    export class PlayerEntity extends CircleEntity {
        constructor(anEntityid: number, aClientid: number) {
            super(anEntityid, aClientid);
            this.entityType = BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY;
        }

        public input:any;
        public speed: number = 0.2;

        /**
         * Update position of this entity - this is only called on the serverside
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        public updatePosition(speedFactor: number, gameClock: number, gameTick: number) {
            this.handleInput(speedFactor, gameTick);
            super.updatePosition(speedFactor, gameClock, gameTick);
        };

        public handleInput(speedFactor:number, gameTick:number) {

            if (this.input.isLeft()) this.acceleration.x -= this.speed;
            if (this.input.isRight()) this.acceleration.x += this.speed;
            if (this.input.isDown()) this.acceleration.y += this.speed;
            if (this.input.isUp()) this.acceleration.y -= this.speed;

            this.otherControls(gameTick);

        };

        /**
         * released by trait
         */
        public otherControls(gameTick:number) {

        };

        ///// ACCESSORS
        /**
         * Set the CollisionCircle for this game entity.
         * @param aCollisionCircle
         */
        public setCollisionCircle(aCollisionCircle:any) {
            super.setCollisionCircle(aCollisionCircle);
            this.collisionCircle.collisionMask = 2;
            this.collisionCircle.collisionGroup = 1;
            this.collisionCircle.isFixed = true;
        };

        public setInput(input:any) {
            this.input = input;
        }
    }
}

