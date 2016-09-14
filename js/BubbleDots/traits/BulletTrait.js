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

    BubbleDots.traits.BulletTrait = function (aCollisionManager, aFieldController) {
        BubbleDots.traits.BulletTrait.superclass.constructor.call(this);
        this._collisionManager = aCollisionManager;
        this._fieldController = aFieldController;
    };

    BubbleDots.traits.BulletTrait.prototype = {
        displayName: "BulletTrait",					// Unique string name for this Trait
        color: "2",
        _collisionManager: null,
        _fieldController: null,
        damage: 25,

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.BulletTrait.superclass.attach.call(this, anEntity);
            this.intercept(['onCollision', 'color']);
        },

        /**
         * @inheritDoc
         */
        execute: function () {
            BubbleDots.traits.BulletTrait.superclass.execute.call(this);
        },

        /**
         * Intercepted properties
         */
        /**
         * Called when this object has collided with another
         * @param a        Object A in the collision pair, note this may be this object
         * @param b        Object B in the collision pair, note this may be this object
         * @param collisionNormal    A vector describing the collision
         */
        onCollision: function (a, b, collisionNormal) {
            // We're either A or B, so perform a simple check against A to figure out which of the two objects we are
            var me = this === a ? a : b;
            var them = this === a ? b : a;

            if (them) {
                var mob = them.getTraitWithName("MobTrait");
                var hunter = them.getTraitWithName("HuntTrait");
                var trait = me.getTraitWithName("BulletTrait");
                var targetTrait = them.getTraitWithName("BulletTrait");
                if (mob) {
                    mob.hp -= trait.damage;
                    them.acceleration.translatePoint(collisionNormal.multiply(-1));
                    if (hunter) {
                        hunter.agrDistance = 1000;
                    }

                    if (mob.hp <= 0) {
                        trait.destroyEntity(them);
                    }
                }
                if (!targetTrait) {
                    trait.destroyEntity(me);
                }
            }
        },
        destroyEntity: function (entity) {
            this._collisionManager.removeCircle(entity.getCollisionCircle());
            this._fieldController.removeEntity(entity.entityid);
        }

    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.BulletTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();
