/// <reference path="../../../typings/index.d.ts" />

namespace BubbleDots {
    export class DemoView {
        constructor() {
            this.setupPixi();
            this.setupStats();
        }

        public stage: PIXI.Container;
        public renderer: any;
        public loader: PIXI.loaders.Loader;

        public bunny: any;

        public setupPixi() {
            this.renderer = PIXI.autoDetectRenderer(800, 600, {autoResize: true}, true);
            $('#gameContainer').append(this.renderer.view);

            this.stage = new PIXI.Container();

            this.loader = PIXI.loader;

            this.loader.add('bunny', "../../assets/bubbledots/blueParticle.png");
            this.loader.add('tad', "../../assets/bubbledots/blueParticle.png");
            // this.loader.once('complete', this.onAssetsLoaded);
            this.loader.load(this.onAssetsLoaded.bind(this));
        };

        public setupStats() {

        };

        public onAssetsLoaded() {
            this.bunny = new PIXI.Sprite(PIXI.loader.resources.bunny.texture);
            this.bunny.anchor.x = 0.5;
            this.bunny.anchor.y = 0.5;
            this.bunny.position.x = 200;
            this.bunny.position.y = 150;
            this.stage.addChild(this.bunny);
            this.update(1);
        }

        /**
         * Updates our current view, passing along the current actual time (via Date().getTime());
         * @param {Number} gameClockReal The current actual time, according to the game
         */
        public update(gameClockReal: any) {
            // var delta = gameClockReal - this.caatDirector.timeline;
            //
            // if (this.focusCharacter) {
            //     this.followFocusCharacter();
            // }
            //
            // this.caatDirector.render(delta);
            // this.caatDirector.timeline = gameClockReal;
            this.bunny.rotation += 0.01;
            this.renderer.render(this.stage);
            // requestAnimationFrame(this.update.bind(this));
        };
    }
}

var test = new BubbleDots.DemoView();
