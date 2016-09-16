/// <reference path="../controller/FieldController.ts" />
namespace RealtimeMultiplayerGame {
    export abstract class AbstractGame {
        constructor() {
            this.setupNetChannel();
            this.setupCmdMap();
            this.fieldController = new RealtimeMultiplayerGame.Controller.FieldController();
        }

        // Properties
        public gameClockReal: number = 0;											// Actual time via "new Date().getTime();"
        public gameClock: number = 0;											// Seconds since start
        public gameTick: number = 0;											// Ticks since start
        public isRunning: boolean = true;
        public speedFactor: number = 1;											// Used to create Framerate Independent Motion (FRIM) - 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
        public intervalGameTick: NodeJS.Timer = null;											// Setinterval for gametick
        public intervalFramerate: number = 60;											// Try to call our tick function this often, intervalFramerate, is used to determin how often to call settimeout - we can set to lower numbers for slower computers
        public intervalTargetDelta: number = NaN;	// this.targetDelta, milliseconds between frames. Normally it is 16ms or 60FPS. The framerate the game is designed against - used to create framerate independent motion
        public gameDuration: number = Number.MAX_VALUE;								// Gameduration

        public netChannel: any = null;											// ServerNetChannel / ClientNetChannel determined by subclass
        public fieldController: any = null;											// FieldController
        public cmdMap = {};

        /**
         * Setup the ClientNetChannel or ServerNetChannel
         */
        public setupNetChannel() {
        };

        /**
         * setup the command mapping for the events recevied from netchannel
         */
        public setupCmdMap() {
        };

        // Methods
        public tick() {
            // Store previous time and update current
            var oldTime = this.gameClockReal;
            this.gameClockReal = new Date().getTime();

            // Our clock is zero based, so if for example it says 10,000 - that means the game started 10 seconds ago
            var delta = this.gameClockReal - oldTime;
            this.gameClock += delta;
            this.gameTick++;

            // Framerate Independent Motion -
            // 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
            this.speedFactor = delta / ( this.intervalTargetDelta );
            if (this.speedFactor <= 0) this.speedFactor = 1;

            this.fieldController.tick(this.speedFactor, this.gameClockReal, this.gameTick);
        }

        /**
         * Start/Restart the game tick
         */
        public startGameClock() {
            this.gameClockReal = new Date().getTime();
            this.intervalTargetDelta = Math.floor(1000 / this.intervalFramerate);
            this.intervalGameTick = setInterval(() => this.tick(), this.intervalTargetDelta);
        };

        /**
         * Stop the game tick
         */
        public stopGameClock() {
            clearInterval(this.intervalGameTick);
            clearTimeout(this.intervalGameTick);
        }

        public  setGameDuration() {
        };

        // Memory
        public dealloc() {
            if (this.netChannel) this.netChannel.dealloc();
            this.netChannel = null;

            clearInterval(this.intervalGameTick);
        };

        public   log() {
            // OVERRIDE or USE CONSOLE.LOG
        };

        // Accessors
        public  getGameClock() {
            return this.gameClock;
        };

        public getGameTick() {
            return this.gameTick;
        };

    }
}
