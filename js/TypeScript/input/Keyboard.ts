namespace RealtimeMultiplayerGame.Input {
    export class Keyboard {
        /**
         * A helper class to detect the current state of the controls of the game.
         */

        public keys: any = {
            'tab': false,
            'shift': false,
            'space': false,
            'up': false,
            'down': false,
            'left': false,
            "right": false,
            'mouse': false
        };
        public lookAtPoint = {
            x: 0, y: 0
        };
        public lookAtVector: any = [];

        public keyCodes: any = {
            '16': 'shift',
            '32': 'space',
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down',
            '9': 'tab'
        };
        public keyPressed = 0;

        public dealloc() {
            // TODO: remove keyup/keydown events
        };

        public  keyDown(e: any) {
            if (e.keyCode in this.keyCodes) {
                // if we're already pressing down on the same key, then we don't want to increment
                // our key pressed count
                if (!this.keys[this.keyCodes[e.keyCode]]) {
                    this.keyPressed++;
                }

                this.handler(e.keyCode, true);
                e.preventDefault();
            }
        };

        public keyUp(e: any) {
            if (e.keyCode in this.keyCodes) {
                this.handler(e.keyCode, false);
                this.keyPressed--;
                e.preventDefault();
            }
        };

        public mouseMove(e: any) {
            // console.log(e);
            this.lookAtPoint.x = e.layerX;
            this.lookAtPoint.y = e.layerY;
            e.preventDefault();
        };

        /**
         * Attach events to the HTML element
         * We don't care about a time clock here, we attach events, we only want
         * to know if something's happened.
         */
        public  attachEvents() {
            var that = this;
            document.addEventListener('keydown', function (e) {
                that.keyDown(e);
            }, false);
            document.addEventListener('keyup', function (e) {
                that.keyUp(e);
            }, false);
            document.getElementById('gamecontainer').addEventListener('mousemove', function (e) {
                that.mouseMove(e);
            }, false);
            document.getElementById('gamecontainer').addEventListener('mousedown', function (e) {
                that.keyPressed++;
                that.keys.mouse = true;
            }, false);
            document.getElementById('gamecontainer').addEventListener('mouseup', function (e) {
                that.keyPressed--;
                that.keys.mouse = false;
            }, false);
        };

        public   isKeyPressed() {
            return this.keyPressed > 0;
        };

        /**
         * Map it to something useful so we know what it is
         */
        public handler(keyCode: any, enabled: any) {
            this.keys[this.keyCodes[keyCode]] = enabled;
        };

        /**
         * Constructs a bitmask based on current keyboard state
         * @return A bitfield containing input states
         */
        public  constructInputBitmask() {
            var input = 0;

            // Check each key
            if (this.keys['up']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.UP;
            if (this.keys['down']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.DOWN;
            if (this.keys['left']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.LEFT;
            if (this.keys['right']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.RIGHT;
            if (this.keys['space']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SPACE;
            if (this.keys['shift']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SHIFT;
            if (this.keys['tab']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.TAB;
            if (this.keys['mouse']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.MOUSE;

            return input;
        };


        /**
         * Sets the 'key down' properties based on an input mask
         * @param inputBitmask    A bitfield containing input flags
         */
        public deconstructInputBitmask(inputBitmask: any) {
            this.keys['up'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.UP);
            this.keys['down'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.DOWN);
            this.keys['left'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.LEFT);
            this.keys['right'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.RIGHT);
            this.keys['space'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SPACE);
            this.keys['shift'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SHIFT);
            this.keys['mouse'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.MOUSE);
        };

        /**
         * Accessors
         */
        // Some helper methods to find out if we're going in a specific direction
        public isLeft() {
            return this.keys['left'];
        };

        public  isUp() {
            return this.keys['up'];
        };

        public isRight() {
            return this.keys['right'];
        };

        public isDown() {
            return this.keys['down'];
        };

        public  isSpace() {
            return this.keys['space'];
        };

        public isShift() {
            return this.keys['shift'];
        };

        public isTab() {
            return this.keys['tab'];
        };

        public  isMouse() {
            return this.keys['mouse'];
        };

        public  getLookAtPoint() {
            return [this.lookAtPoint.x, this.lookAtPoint.y];
        };

        public getLookAtVector() {
            return [this.lookAtVector.x, this.lookAtVector.y];
        };

        public static getVector(begin: any, end: any) {
            return {x: begin.x - end.x, y: begin.y - end.y};
        };

        public calculateAngleRotation(position: any) {
            this.lookAtVector = RealtimeMultiplayerGame.Input.Keyboard.getVector(position, this.lookAtPoint);
            return Math.atan2(this.lookAtVector.y, this.lookAtVector.x);
        }


    }
}

