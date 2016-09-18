/// <reference path="../../model/Point.ts" />
namespace RealtimeMultiplayerGame.modules.circlecollision {
    import Point = RealtimeMultiplayerGame.model.Point;
    export class PackedCircle {
        constructor() {
            this.boundsRule = RealtimeMultiplayerGame.modules.circlecollision.PackedCircle.BOUNDS_RULE_IGNORE;
            this.position = new RealtimeMultiplayerGame.model.Point();
            this.offset = new RealtimeMultiplayerGame.model.Point();
            this.targetPosition = new RealtimeMultiplayerGame.model.Point();
        }

        public id = 0;
        public delegate: any = null;
        /**
         * @type {RealtimeMultiplayerGame.model.Point}
         */
        public position: Point = new Point();
        /**
         * Offset from delegates position by this much
         * @type {RealtimeMultiplayerGame.model.Point}
         */
        public offset: Point = new Point();
        public radius = 0;
        public radiusSquared = 0;
        /**
         * Where it wants to go
         * @type {any}
         */
        public targetPosition: Point = null;
        public targetChaseSpeed = 0.02;

        public isFixed = false;
        public boundsRule = 0;
        public collisionMask = 0;
        public collisionGroup = 0;
        /**
         * Wrap to otherside
         * @type {number}
         */
        static BOUNDS_RULE_WRAP = 1;
        /**
         * Constrain within bounds
         * @type {number}
         */
        static BOUNDS_RULE_CONSTRAINT = 2;
        /**
         * Destroy when it reaches the edge
         * @type {number}
         */
        static BOUNDS_RULE_DESTROY = 4;
        /**
         * Ignore when reaching bounds
         * @type {number}
         */
        static BOUNDS_RULE_IGNORE = 8;

        public containsPoint(aPoint: Point) {
            var distanceSquared = this.position.getDistanceSquared(aPoint);
            return distanceSquared < this.radiusSquared;
        };

        public getDistanceSquaredFromPosition(aPosition: Point) {
            var distanceSquared = this.position.getDistanceSquared(aPosition);
            // if it's shorter than either radius, we intersect
            return distanceSquared < this.radiusSquared;
        };

        public intersects(aCircle: any) {
            var distanceSquared = this.position.getDistanceSquared(aCircle.position);
            return (distanceSquared < this.radiusSquared || distanceSquared < aCircle.radiusSquared);
        };


        /**
         * ACCESSORS
         */
        public setPosition(aPosition: Point) {
            this.position = aPosition;
            return this;
        };

        public setDelegate(aDelegate: any) {
            this.delegate = aDelegate;
            return this;
        };

        public setOffset(aPosition: Point) {
            this.offset = aPosition;
            return this;
        };

        public setTargetPosition(aTargetPosition: Point) {
            this.targetPosition = aTargetPosition;
            return this;
        };

        public setTargetChaseSpeed(aTargetChaseSpeed: any) {
            this.targetChaseSpeed = aTargetChaseSpeed;
            return this;
        };

        public setIsFixed(value: any) {
            this.isFixed = value;
            return this;
        };

        public setCollisionMask(aCollisionMask: any) {
            this.collisionMask = aCollisionMask;
            return this;
        };

        public setCollisionGroup(aCollisionGroup: any) {
            this.collisionGroup = aCollisionGroup;
            return this;
        };

        public setRadius(aRadius: any) {
            this.radius = aRadius;
            this.radiusSquared = this.radius * this.radius;
            return this;
        };

        public initialize(overrides: any) {
            if (overrides) {
                // for (let i:number in overrides) {
                // this[i] = overrides[i]; TODO should be fixed
                // }
            }

            return this;
        };

        public dealloc() {
            this.position = null;
            this.offset = null;
            this.delegate = null;
            this.targetPosition = null;
        }
    }
}
