/// <reference path="../../controller/traits/BaseTrait.ts" />
/// <reference path="../../input/Keyboard.ts" />
namespace RealtimeMultiplayerGame.controller.traits {
    export class KeyboardInputTrait extends BaseTrait {

        public displayName = "KeyboardInputTrait";
        public entityid:any;
        public input:any;

        /**
         * Attach the trait to the host object
         * @param anEntity
         */
        public attach(anEntity:any) {
            super.attach(anEntity);

            // Intercept those two properties from the attached enitity with our own
            this.intercept(['constructEntityDescription', 'handleInput']);
            this.attachedEntity.input = new RealtimeMultiplayerGame.Input.Keyboard();
            this.attachedEntity.input.attachEvents();
        };


        /**
         * Implement our own intercepted version of the methods/properties
         */
        public constructEntityDescription(gameTick:any, wantsFullUpdate:any) {
            return {
                entityid: this.entityid,
                input: this.input.constructInputBitmask(),
                mouse: this.input.getLookAtVector()
            }
        };

        // Do nothing
        public  handleInput(gameClock:any) {
        };

    }
}
