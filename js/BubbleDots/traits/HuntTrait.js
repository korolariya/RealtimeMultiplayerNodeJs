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
        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.HuntTrait.superclass.attach.call(this, anEntity);
            this.intercept(['updatePosition']);
        },


        updatePosition: function (speedFactor, gameClock, gameTick) {
            var trait = this.getTraitWithName("HuntTrait");
            var players = trait._fieldController.getPlayers();
            var self = this;

            var playersLength = [];
            var playersVector = [];
            players.forEach(function (item) {
                var position = trait._fieldController.getPlayerWithid(item).position;
                var vectorToPlayer = trait.getVector(self.position, position);
                playersVector.push(vectorToPlayer);
                var lengthToPlayer = trait.getLengthVector(vectorToPlayer);
                playersLength.push(lengthToPlayer);
            });

            if (playersLength.length) {

                var minLengthToPlayerKey = trait.arrayMin(playersLength);

                var vectorToMinPlayer = playersVector[minLengthToPlayerKey];
                var moveSpeed = 0.05;
                this.acceleration.x -= moveSpeed * vectorToMinPlayer.x / Math.sqrt(Math.pow(vectorToMinPlayer.x, 2) + Math.pow(vectorToMinPlayer.y, 2));
                this.acceleration.y -= moveSpeed * vectorToMinPlayer.y / Math.sqrt(Math.pow(vectorToMinPlayer.x, 2) + Math.pow(vectorToMinPlayer.y, 2));
            }
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
        }


    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.HuntTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();
