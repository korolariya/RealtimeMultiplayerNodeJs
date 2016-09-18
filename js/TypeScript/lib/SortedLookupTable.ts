namespace RealtimeMultiplayerGame.lib {
    export class LookupTable {
        constructor() {
            this._keys = [];
            this._data = {};
            this.nextUUID = 0;
        }

        protected _keys:any;
        protected _data:any;
        public nextUUID:any;

        public setObjectForKey(value:any, key:any) {
            if (!this._data.hasOwnProperty(key)) this._keys.push(key);
            this._data[key] = value;
            return value;
        }

        public objectForKey(key:any) {
            return this._data[key];
        };

        public forEach(block:any, context:any) {
            var keys = this._keys,
                data = this._data,
                i = keys.length,
                key:any;

            while (i--) {
                key = keys[i];
                block.call(context, key, data[key]);
            }
        };

        count() {
            return this._keys.length;
        };

        dealloc() {
            delete this._keys;
            delete this._data;
        };

    }
    export class SortedLookupTable extends LookupTable {
        constructor() {
            super();
        }

        public setObjectForKey(value:any, key:any) {
            if (!this._data.hasOwnProperty(key)) {
                var index = this._indexOf(key);
                this._keys.splice(index, 0, key);
            }
            this._data[key] = value;

            return value;
        };

        public remove(key:any) {
            if (!this._data.hasOwnProperty(key)) return;
            delete this._data[key];
            var index = this._indexOf(key);
            this._keys.splice(index, 1);
        };


        public _indexOf(key:any) {
            var keys = this._keys,
                n = keys.length,
                i = 0,
                d = n;

            if (n === 0) return 0;
            if (key < keys[0]) return 0;
            if (key > keys[n - 1]) return n;

            while (key !== keys[i] && d > 0.5) {
                d = d / 2;
                i += (key > keys[i] ? 1 : -1) * Math.round(d);
                if (key > keys[i - 1] && key < keys[i]) d = 0;
            }
            return i;
        };
    }
}
