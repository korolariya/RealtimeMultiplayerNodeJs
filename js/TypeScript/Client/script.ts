/// <reference path="../../../typings/index.d.ts" />
/// <reference path="BubbleDotsClientGame.ts" />
(function () {
    // Callback for when browse is ready
    var onDocumentReady = function () {
        var that = this;

        // Preload images
        var imagePreloader = new CAAT.ImagePreloader();

        // Callback for image preloader
        imagePreloader.loadImages(BubbleDots.Constants.IMAGE_ASSETS, function (counter:any, images:any) {

            BubbleDots.DemoClientGame.log("Preloading image...");

            if (counter != images.length) return;

            BubbleDots.IMAGE_CACHE = images;

            // Image preload complete - START THE GAME!
            var clientGame = new BubbleDots.DemoClientGame();
        });
    };


    // Adjust aside to match game dimensions
    var newHeight = BubbleDots.Constants.GAME_HEIGHT;
    newHeight -= parseFloat($("aside").css("padding-top")) * 2;
    $("aside").height(newHeight + "px");

    // Listen for ready
    window.addEventListener('load', onDocumentReady, false);
})();
