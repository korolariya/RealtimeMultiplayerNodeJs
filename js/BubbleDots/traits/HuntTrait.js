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

    BubbleDots.traits.HuntTrait = function (aFieldController) {
        BubbleDots.traits.HuntTrait.superclass.constructor.call(this);
        this._fieldController = aFieldController;
    };

    BubbleDots.traits.HuntTrait.prototype = {
        displayName: "HuntTrait",					// Unique string name for this Trait
        _fieldController: null,
        agrDistance: 400,
        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.HuntTrait.superclass.attach.call(this, anEntity);
            this.intercept(['updatePosition']);
        },


        updatePosition: function (speedFactor, gameClock, gameTick) {
            var hunter = this;
            var trait = hunter.getTraitWithName("HuntTrait");
            var players = trait._fieldController.getPlayers();

            var playerMinLength = trait.agrDistance;
            var resultVectorToPlayer = null;
            var playersProcessed = 0;
            players._keys.forEach(function (item) {
                var playerPosition = trait._fieldController.getPlayerWithid(item).position;
                var vectorToPlayer = trait.getVector(hunter.position, playerPosition);
                var tempLengthToPlayer = trait.getLengthVector(vectorToPlayer);
                if (playerMinLength > tempLengthToPlayer) {
                    playerMinLength = tempLengthToPlayer;
                    resultVectorToPlayer = vectorToPlayer;
                }
                playersProcessed++;
                if (playersProcessed == players._keys.length) {
                    if (resultVectorToPlayer !== null) {
                        trait.followPlayer(hunter, resultVectorToPlayer);
                    }
                }
            });

            trait.interceptedProperties._data.updatePosition.call(this, speedFactor, gameClock, gameTick);
        },
        getVector: function (begin, end) {
            return {x: begin.x - end.x, y: begin.y - end.y};
        },
        getLengthVector: function (vector) {
            return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        },
        arrayMin: function arrayMin(arr) {
            var len = arr.length, key = 0, min = arr[0];
            while (len--) {
                if (arr[len] < min) {
                    min = arr[len];
                    key = len;
                }
            }
            return key;
        },
        followPlayer: function (entity, vectorToPlayer) {
            var moveSpeed = 0.05;
            entity.acceleration.x -= moveSpeed * vectorToPlayer.x / Math.sqrt(Math.pow(vectorToPlayer.x, 2) + Math.pow(vectorToPlayer.y, 2));
            entity.acceleration.y -= moveSpeed * vectorToPlayer.y / Math.sqrt(Math.pow(vectorToPlayer.x, 2) + Math.pow(vectorToPlayer.y, 2));
        }


    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.HuntTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();
