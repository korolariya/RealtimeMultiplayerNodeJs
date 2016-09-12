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
        var self = this;
        setTimeout(function () {
            self.destroy();
        }, 1000);
    };

    BubbleDots.traits.BulletTrait.prototype = {
        displayName: "BulletTrait",					// Unique string name for this Trait
        color: "2",
        _collisionManager: null,
        _fieldController: null,

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.BulletTrait.superclass.attach.call(this, anEntity);
            this.intercept(['onCollision', 'color', 'destroy']);
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
        },
        destroy: function () {
            // var trait = this.getTraitWithName("BulletTrait");
            // console.log(this.attachedEntity);
            this._collisionManager.removeCircle(this.attachedEntity.getCollisionCircle());
            this._fieldController.removeEntity(this.attachedEntity.entityid);
        }

    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.BulletTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();
