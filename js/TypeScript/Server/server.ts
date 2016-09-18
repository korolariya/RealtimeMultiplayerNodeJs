
/// <reference path="../../../typings/index.d.ts" />
/// <reference path="./BubbleDotsServerGame.ts" />

require("../../lib/SortedLookupTable.js");
require("../../model/WorldEntityDescription.js");
// require("../../network/ServerNetChannel.ts");
// require("../../network/Client.ts");

var game = new BubbleDots.DemoServerGame();
game.startGameClock();
