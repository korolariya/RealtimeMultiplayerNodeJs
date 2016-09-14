/**
 File:
 FoodTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:

 Basic Usage:

 */
(function () {
    BubbleDots.namespace("BubbleDots.traits");

    BubbleDots.traits.MobTrait = function (aCollisionManager, aFieldController) {
        BubbleDots.traits.MobTrait.superclass.constructor.call(this);
        this._collisionManager = aCollisionManager;
        this._fieldController = aFieldController;
    };

    BubbleDots.traits.MobTrait.prototype = {
        displayName: "MobTrait",					// Unique string name for this Trait
        color: "3",
        _collisionManager: null,
        _fieldController: null,
        hp:100,

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.MobTrait.superclass.attach.call(this, anEntity);
            this.intercept(['onCollision', 'color']);
        },

        /**
         * @inheritDoc
         */
        execute: function () {
            BubbleDots.traits.MobTrait.superclass.execute.call(this);
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

        }

    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.MobTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();
