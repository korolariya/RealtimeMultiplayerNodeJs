/// <reference path="../controller/traits/BaseTrait.ts" />
namespace BubbleDots.traits {
    import BaseTrait = RealtimeMultiplayerGame.controller.traits.BaseTrait;
    export class PoisonTrait extends BaseTrait {
        constructor() {
            super();
        }

        /**
         *  Unique string name for this Trait
         */
        public displayName: string = "PoisonTrait";
        public color: string = "2";

        /**
         * @inheritDoc
         */
        public attach(anEntity: any) {
            super.attach(anEntity);
            this.intercept(['onCollision', 'color']);
        };

        /**
         * @inheritDoc
         */
        public execute() {
            super.execute();
        };

        /**
         * Intercepted properties
         */
        /**
         * Called when this object has collided with another
         * @param a        Object A in the collision pair, note this may be this object
         * @param b        Object B in the collision pair, note this may be this object
         * @param collisionNormal    A vector describing the collision
         */
        public  onCollision(a: any, b: any, collisionNormal: any) {
            // We're either A or B, so perform a simple check against A to figure out which of the two objects we are
            var me = this === a ? a : b;
            var them = this === a ? b : a;
            them.acceleration.translatePoint(collisionNormal.multiply(1));
        }
    }
}

