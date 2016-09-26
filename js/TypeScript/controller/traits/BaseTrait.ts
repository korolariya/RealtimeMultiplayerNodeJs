/// <reference path="../../lib/SortedLookupTable.ts" />
namespace RealtimeMultiplayerGame.controller.traits {
    export class BaseTrait {

        constructor() {
            this.interceptedProperties = new RealtimeMultiplayerGame.lib.SortedLookupTable();
        }

        /**
         * SortedLookupTable of Traits we've intercepted so they can be applied back
         * @type {any}
         */
        public interceptedProperties: any = null;
        /**
         * Trait host
         * @type {any}
         */
        public attachedEntity: any = null;
        /**
         * Store detach setTimeout
         * @type {number}
         */
        public detachTimeout: number = 0;
        /**
         * Unique string name for this Trait
         * @type {string}
         */
        public displayName: string = "BaseTrait";

        /**
         * If a trait can stack, then it doesn't matter if it's already attached.
         * If it cannot stack, it is not applied if it's currently active.
         * For example, you can not be frozen after being frozen.
         * However you can be sped up multiple times
         */
        public canStack: boolean = false;

        public interceptProperties: any;

        /**
         * Attach the trait to the host object
         * @param anEntity
         */
        public attach(anEntity: any) {
            this.attachedEntity = anEntity;
        };

        /**
         * Execute the trait
         * For example if you needed to cause an animation to start when a character is 'unfrozen', this is when you would do it
         */
        public execute() {

        };

        /**
         * Detaches a trait from an 'attachedEntity' and restores the properties
         */
        public detach(force: any) {
            clearTimeout(this.detachTimeout);
            this.restore();

            this.interceptedProperties.dealloc();
            this.interceptProperties = null;
            this.attachedEntity = null;
        };

        /**
         * Detach after N milliseconds, for example freeze trait might call this to unfreeze
         * @param aDelay
         */
        public detachAfterDelay(aDelay: any) {
            this.detachTimeout = setTimeout(()=> {
                this.attachedEntity.removeTraitWithName(this.displayName);
            }, aDelay);
        };

        /**
         * Intercept properties from the entity we are attached to.
         * For example, if we intercept handleInput, then our own 'handleInput' function gets called.
         * We can reset all the properties by calling, this.restore();
         * @param arrayOfProperties
         */
        public intercept(arrayOfProperties: any) {
            var len = arrayOfProperties.length;
            while (len--) {
                var aKey = arrayOfProperties[len];
                this.interceptedProperties.setObjectForKey(this.attachedEntity[aKey], aKey);
                 this.attachedEntity[aKey] = this[aKey]; //TODO should be fixed
            }
        };

        /**
         * Restores Traits that were intercepted.
         * Be sure to call this when removing the trait!
         */
        public  restore() {
            this.interceptedProperties.forEach((key: any, aStoredProperty: any) => {
                this.attachedEntity[key] = aStoredProperty;
            });
        };
    }
}
