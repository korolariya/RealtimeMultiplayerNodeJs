/// <reference path="../model/Point.ts" />
namespace RealtimeMultiplayerGame.model {
    export class GameEntity {
        constructor(anEntityid: number, aClientid: number) {
            this.clientid = aClientid;
            this.entityid = anEntityid;
            this.traits = [];
            this.position = new RealtimeMultiplayerGame.model.Point();
        }

        // Connection info
        /**
         * Owner of this object
         * @type {number}
         */
        public clientid = -1;
        /**
         * UUID for this entity
         * @type {number}
         */
        public entityid = -1;
        /**
         * A special interger representing the entityType sent via along with other network info
         * @type {number}
         */
        public entityType = -1;
        /**
         * Current position of this entity
         * @type {number}
         */
        public position:Point = new RealtimeMultiplayerGame.model.Point();
        /**
         *
         * @type {number}
         */
        public rotation = 0;
        /**
         * An array of our Traits, in reverse added order
         * @type {any}
         */
        public traits: any = null;
        public view: any = null;
        /**
         * The last received entity description (set by renderAtTime)
         * @type {any}
         */
        public lastReceivedEntityDescription: any = null;

        /**
         * Update the view's position
         */
        public  updateView() {
            // OVERRIDE
        };

        /**
         * Updates the position of this GameEntity based on it's movement properties (velocity, acceleration, damping)
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        public  updatePosition(speedFactor: any, gameClock: any, gameTick: any) {
            // OVERRIDE
        };

        /**
         * Construct an entity description for this object, it is essentually a CSV so you have to know how to read it on the receiving end
         * @param gameTick
         * @param wantsFullUpdate    If true, certain things that are only sent when changed are always sent
         */
        public constructEntityDescription(gameTick: any, wantsFullUpdate: any) {
            // Note: "~~" is just a way to round the value without the Math.round function call
            let returnString: string;
            returnString = String(this.entityid);
            returnString += "," + this.clientid;
            returnString += "," + this.entityType;
            returnString += "," + ~~this.position.x;
            returnString += "," + ~~this.position.y;

            return returnString;
        };

        ////// TRAIT SUPPORT
        /**
         * Adds and attaches a trait (already created), to this entity.
         * The trait is only attached if we do not already have one of the same type attached, or don't care (aTrait.canStack = true)
         * @param {RealtimeMultiplayerGame.controller.traits.BaseTrait} aTrait A BaseTrait instance
         * @return {Boolean} Whether the trait was added
         */
        public addTrait(aTrait: any) {
            // Check if we already have this trait, if we do - make sure the trait allows stacking
            var existingVersionOfTrait = this.getTraitWithName(aTrait.displayName);
            if (existingVersionOfTrait && !existingVersionOfTrait.canStack) {
                return false;
            }

            // Remove existing version
            if (existingVersionOfTrait) {
                this.removeTraitWithName(aTrait.displayName);
            }

            this.traits.push(aTrait);
            aTrait.attach(this);

            return aTrait;
        };


        /**
         * Calls addTrait and executes it immediately
         * @param aTrait
         */
        public addTraitAndExecute(aTrait: any) {
            var wasAdded = this.addTrait(aTrait);
            if (wasAdded) {
                aTrait.execute();
                return aTrait;
            }

            return null;
        };

        /**
         * Removes a trait with a matching .displayName property
         * @param aTraitName
         */
        public  removeTraitWithName(aTraitName: any) {
            var len = this.traits.length;
            var removedTraits: any = null;
            for (var i = 0; i < len; ++i) {
                if (this.traits[i].displayName === aTraitName) {
                    removedTraits = this.traits.splice(i, 1);
                    break;
                }
            }

            // Detach removed Traits
            if (removedTraits) {
                i = removedTraits.length;
                while (i--) {
                    removedTraits[i].detach();
                }
            }
        };

        /**
         * Removes all Traits contained in this entity
         */
        public removeAllTraits() {
            var i = this.traits.length;
            while (i--) {
                this.traits[i].detach();
            }

            this.traits = [];
        };

        ///// MEMORY
        public  dealloc() {
            this.position = null;
            this.removeAllTraits();
            this.traits = null;
        };

        ////// ACCESSORS
        public   setView(aView: any) {
            this.view = aView;
        };

        public  getView() {
            return this.view;
        };

        /**
         * Returns a trait with a matching .displayName property
         * @param aTraitName
         */
        public  getTraitWithName(aTraitName: any) {
            var len = this.traits.length;
            var trait:any = null;
            for (var i = 0; i < len; ++i) {
                if (this.traits[i].displayName === aTraitName) {
                    trait = this.traits[i];
                    break;
                }
            }
            return trait;
        }
    }
}

