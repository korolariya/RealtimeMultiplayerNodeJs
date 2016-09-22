/// <reference path="../Server/BubbleDotsConstants.ts" />
/// <reference path="../lib/CAAT.d.ts" />
namespace BubbleDots {
    export class DemoView {
        constructor() {
            this.setupCAAT();
            this.setupStats();
        }

        // Properties
        public caatDirector: any = null;				// CAAT Director instance
        public caatScene: any = null;				// CAAT Scene instance
        public caatRoot: any = null;
        public focusCharacter: any = null;				// The 'camera' will follow this player
        public stats: any = null;				// Stats.js instance
        public textfield: any = null;				// CAAT text
        public healthPlayer: any = null;
        public CAATSprite: any;
        public director: any;


        // Methods
        public setupCAAT() {
            this.caatScene = new CAAT.Scene(); // Create a scene, all directors must have at least one scene - this is where all your stuff goes
            this.caatScene.create();	// Notice we call create when creating this, and ShapeActor below. Both are Actors
            this.caatScene.setFillStyle('#323232');

            this.caatDirector = new CAAT.Director().initialize(BubbleDots.Constants.GAME_WIDTH, BubbleDots.Constants.GAME_HEIGHT); // Create the director instance
            this.caatDirector.addScene(this.caatScene); // Immediately add the scene once it's created
            // this.caatDirector.setImagesCache(BubbleDots.IMAGE_CACHE);//TODO should be fixed


            this.caatRoot = new CAAT.ActorContainer()
                .setBounds(0, 0, this.caatScene.width, this.caatScene.height)
                .create()
                .enableEvents(false);
            this.caatScene.addChild(this.caatRoot);

            this.setupTextfield();
            this.createGround();
            this.healthPlayerField();
        };

        public setupTextfield() {
            // Create a textfield
            this.textfield = new CAAT.TextActor();
            this.textfield.setFont("12px sans-serif");
            this.textfield.textAlign = "left";
            this.textfield.textBaseline = "top";
            this.textfield.calcTextSize(this.caatDirector);
            this.textfield.setSize(this.textfield.textWidth, this.textfield.textHeight);
            this.textfield.create();
            this.textfield.fillStyle = "#EEEEEE";
            this.textfield.setLocation(10, 10);
            this.caatScene.addChild(this.textfield);
        };

        public healthPlayerField() {
            // Create a healthPlayer
            this.healthPlayer = new CAAT.TextActor();
            this.healthPlayer.setFont("12px sans-serif");
            this.healthPlayer.textAlign = "left";
            this.healthPlayer.textBaseline = "top";
            this.healthPlayer.calcTextSize(this.caatDirector);
            this.healthPlayer.setSize(this.healthPlayer.textWidth, this.healthPlayer.textHeight);
            this.healthPlayer.create();
            this.healthPlayer.fillStyle = "#EEEEEE";
            this.healthPlayer.setLocation(100, 10);
            this.caatScene.addChild(this.healthPlayer);
        };

        /**
         * Updates our current view, passing along the current actual time (via Date().getTime());
         * @param {Number} gameClockReal The current actual time, according to the game
         */
        public update(gameClockReal: any) {
            var delta = gameClockReal - this.caatDirector.timeline;

            if (this.focusCharacter) {
                this.followFocusCharacter();
            }

            this.caatDirector.render(delta);
            this.caatDirector.timeline = gameClockReal;
        };

        public  followFocusCharacter() {
            var camSpeed = 0.1;
            var targetX = -this.focusCharacter.x + this.caatScene.width / 2;
            var targetY = -this.focusCharacter.y + this.caatScene.height / 2;
            this.caatRoot.x -= (this.caatRoot.x - targetX) * camSpeed;
            this.caatRoot.y -= (this.caatRoot.y - targetY) * camSpeed * 2;
        };

        /**
         * Creates a Stats.js instance and adds it to the page
         */
        public setupStats() {
            var container = document.createElement('div');
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '0px';
            container.appendChild(this.stats.domElement);
            document.body.appendChild(container);
        };

        public  addEntity(anEntityView: any) {
            this.caatRoot.addChild(anEntityView);
        };


        public  removeEntity(anEntityView: any) {
            // console.log("Removing Entity From CAAT", anEntityView);
            this.caatRoot.removeChild(anEntityView);
        };

        /**
         * Create a view for an entity in CAAT using the entity description
         * @param {Object} entityDesc An object containing properties for this entity, sent from the server
         */
        public  createEntityView(entityDesc: any) {
            // Retrieve the image from caatDirector (stored in the preloading sequence in script.js)
            var imageName = "particle" + entityDesc.color;
            var imageRef = this.caatDirector.getImage(imageName);
            var caatImage = new CAAT.CompoundImage()
                .initialize(imageRef, 1, 1);

            // Create the actor using the image
            return this.CAATSprite = new CAAT.SpriteActor()
                .create()
                .setSpriteImage(caatImage)
                .setScale(0.5, 0.5)
                .setLocation(entityDesc.x, entityDesc.y);
        };


        public createGround() {
            // Retrieve the image from caatDirector (stored in the preloading sequence in script.js)
            var imageRef = this.caatDirector.getImage("ground");
            var caatImage = new CAAT.CompoundImage()
                .initialize(imageRef, 1, 1);

            for (var i = 0; i < 10; ++i) {
                // Create the actor using the image
                var actor = this.CAATSprite = new CAAT.SpriteActor()
                    .create()
                    .setSpriteImage(caatImage)
                    .setLocation(i * caatImage.width, 470);

                this.caatRoot.addChild(actor);
            }

            return actor;
        };

        /**
         * Insert the CAATDirector canvas into an HTMLElement
         * @param {String} id An HTMLElement id
         */
        public insertIntoHTMLElementWithId(id: any) {
            document.getElementById(id).appendChild(this.caatDirector.canvas);
        };

        // Memory
        public dealloc() {
            this.director.destroy();
        };

        public setFocusCharacter(entity: any) {
            this.focusCharacter = entity;
        };


    }
}
