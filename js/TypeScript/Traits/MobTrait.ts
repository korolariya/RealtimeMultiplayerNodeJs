/// <reference path="../controller/traits/BaseTrait.ts" />
namespace BubbleDots.traits {
    import BaseTrait = RealtimeMultiplayerGame.controller.traits.BaseTrait;
    export class MobTrait extends BaseTrait {

    }
}
// /**
//  File:
//  FoodTrait.js
//  Created By:
//  Mario Gonzalez
//  Project    :
//  RealtimeMultiplayerNodeJS
//  Abstract:
//
//  Basic Usage:
//
//  */
// (function () {
//     BubbleDots.namespace("BubbleDots.traits");
//
//     BubbleDots.traits.MobTrait = function (server) {
//         BubbleDots.traits.MobTrait.superclass.constructor.call(this);
//         this._collisionManager = server.collisionManager;
//         this._fieldController = server.fieldController;
//         this.server = server;
//     };
//
//     BubbleDots.traits.MobTrait.prototype = {
//         displayName: "MobTrait",					// Unique string name for this Trait
//         color: "3",
//         _collisionManager: null,
//         _fieldController: null,
//         hp: 100,
//         damage: 10,
//         timeLastAttack: 0,
//         timeAttack: 100,
//
//         /**
//          * @inheritDoc
//          */
//         attach: function (anEntity) {
//             BubbleDots.traits.MobTrait.superclass.attach.call(this, anEntity);
//             this.intercept(['onCollision', 'color']);
//         },
//
//         /**
//          * @inheritDoc
//          */
//         execute: function () {
//             BubbleDots.traits.MobTrait.superclass.execute.call(this);
//         },
//
//         /**
//          * Intercepted properties
//          */
//         /**
//          * Called when this object has collided with another
//          * @param a        Object A in the collision pair, note this may be this object
//          * @param b        Object B in the collision pair, note this may be this object
//          * @param collisionNormal    A vector describing the collision
//          */
//         onCollision: function (a, b, collisionNormal) {
//
//             // We're either A or B, so perform a simple check against A to figure out which of the two objects we are
//             var me = this === a ? a : b;
//             var them = this === a ? b : a;
//
//             if (them.entityType == BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY) {
//                 var mobTrait = me.getTraitWithName("MobTrait");
//
//                 if (mobTrait.server.getGameTick() >= mobTrait.timeLastAttack) {
//                     var nextHealth = them.getHealth() - mobTrait.damage;
//                     them.setHealth((nextHealth > 0) ? nextHealth : 0);
//                     mobTrait.timeLastAttack = mobTrait.server.getGameTick() + mobTrait.timeAttack;
//                 }
//                 if (!them.getHealth()) {
//                     var start = new RealtimeMultiplayerGame.model.Point(512, 384);
//                     them.collisionCircle.position = start.clone();
//                     them.position = them.collisionCircle.position.clone();
//                     them.setHealth(100);
//                 }
//             }
//         }
//
//     };
//
//     // Extend BaseTrait
//     RealtimeMultiplayerGame.extend(BubbleDots.traits.MobTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
// })();
