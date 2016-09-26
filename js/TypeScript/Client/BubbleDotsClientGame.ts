/// <reference path="../core/AbstractClientGame.ts" />
/// <reference path="../Entities/CircleEntity.ts" />
/// <reference path="../controller/traits/KeyboardInputTrait.ts" />
/// <reference path="../Server/BubbleDotsConstants.ts" />
/// <reference path="./BubbleDotsView.ts" />
namespace BubbleDots {
    export class DemoClientGame extends RealtimeMultiplayerGame.AbstractClientGame {
        constructor() {
            super();
            this.startGameClock();
        }
        public images: any;

        public setupView() {
            console.log(BubbleDots.IMAGE_CACHE);
            this.view = new BubbleDots.DemoView(this.images);//TODO param images
            this.view.insertIntoHTMLElementWithId("gamecontainer");

            super.setupView(BubbleDots.IMAGE_CACHE);
        };

        /**
         * @inheritDoc
         */
        public tick() {
            super.tick();
            this.view.stats.update();
            this.view.update(this.gameClockReal);
            this.view.textfield.setText("Ping: " + this.netChannel.getLatency());
            this.followCursor();

            if (this.clientCharacter) {
                this.view.healthPlayer.setText(this.clientCharacter.getHealth());
            }
        };

        /**
         * @inheritDoc
         */
        public   createEntityFromDesc(entityDesc: any) {

            // Create a new BubbleDots entity
            var newEntity = new BubbleDots.CircleEntity(entityDesc.entityid, entityDesc.clientid);
            newEntity.position.set(entityDesc.x, entityDesc.y);
            newEntity.setHealth(entityDesc.health);

            var entityView = this.view.createEntityView(entityDesc);
            newEntity.setView(entityView);

            this.fieldController.addEntity(newEntity);

            // Our own character
            if (entityDesc.clientid == this.netChannel.getClientid() && entityDesc.entityType & BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY) {
                this.setupClientPlayer(newEntity);
                this.view.setFocusCharacter(entityView);
            }
        };

        /**
         * Called when the player that represents this user is created
         * @param anEntity
         */
        public   setupClientPlayer(anEntity: any) {
            anEntity.addTraitAndExecute(new RealtimeMultiplayerGame.controller.traits.KeyboardInputTrait());
            this.clientCharacter = anEntity;
        };

        /**
         * Look at cursor
         */
      public  followCursor() {
            if (this.clientCharacter) {
                var position = {x: 0, y: 0};
                position.x = this.view.caatRoot.x + this.clientCharacter.position.x;
                position.y = this.view.caatRoot.y + this.clientCharacter.position.y;
                 this.clientCharacter.view.setRotation(this.clientCharacter.input.calculateAngleRotation(position));
            }
        };

        /**
         * @inheritDoc
         */
      public  netChannelDidConnect(messageData: any) {
            console.log('netChannelDidConnect');
            super.netChannelDidConnect(messageData);
            BubbleDots.DemoClientGame.log("DemoClientGame: Joining Game");
            this.joinGame("Player" + this.netChannel.getClientid()); // Automatically join the game with some name
        };

        /**
         * @inheritDoc
         */
       public netChannelDidDisconnect(messageData: any) {
            console.log('netChannelDidDisconnect');
            super.netChannelDidDisconnect(messageData);
            BubbleDots.DemoClientGame.log("DemoClientGame: netChannelDidDisconnect"); // Display disconnect
        };

        /**
         * An array containing values received from the entity
         * @param entityDescAsArray
         */
     static parseEntityDescriptionArray(entityDescAsArray: any) {
            var entityDescription: any = {};
            // It is up to the user to make sure that their objects are following a certain order
            // We do this because we need the performance of sending the tiniest strings possible
            entityDescription.entityid = entityDescAsArray[0];
            entityDescription.clientid = entityDescAsArray[1];
            entityDescription.entityType = +entityDescAsArray[2];
            entityDescription.x = +entityDescAsArray[3];
            entityDescription.y = +entityDescAsArray[4];
            entityDescription.scale = +entityDescAsArray[5];
            entityDescription.color = entityDescAsArray[6];
            entityDescription.health = entityDescAsArray[7];
            return entityDescription;
        };

        /**
         * This function logs something to the right panel
         * @param message
         */
        public static log(message: any) {
            var el = document.createElement('p');
            el.innerHTML = '<b>' + message.replace(/</g, '&lt;').replace(/>/g, '&gt;') + ':</b> ';
            // Log if possible
            console.log(message);
        };

    }


}

