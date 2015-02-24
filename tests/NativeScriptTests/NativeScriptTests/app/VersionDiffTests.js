var mediaplayer = require('MediaPlayer');
var mapkit = require('MapKit');
var storekit = require('StoreKit');
var spritekit = require('SpriteKit');

describe(module.id, function() {
    afterEach(function () {
        TNSClearOutput();
    });

    it("InterfaceDiff", function() {
        if (SYSTEM_VERSION_LESS_THAN("7.1")) {
            expect(mediaplayer.MPContentItem).toBeUndefined();
        } else {
            var object = new mediaplayer.MPContentItem();
            expect(object).not.toBeUndefined();
        }
    });

    it("ConstantDiff", function() {
        if (SYSTEM_VERSION_LESS_THAN("7.1")) {
            expect(mapkit.MKLaunchOptionsCameraKey).toBeUndefined();
        } else {
            expect(mapkit.MKLaunchOptionsCameraKey).not.toBeUndefined();
        }
    });

    it("PropertyDiff", function() {
        var object = spritekit.SKView.alloc().init();
        if (SYSTEM_VERSION_LESS_THAN("8.0")) {
            expect(object.allowsTransparency).toBeUndefined();
        } else {
            expect(object.allowsTransparency).not.toBeUndefined();
        }
    });

    it("FunctionDiff", function() {
        if (SYSTEM_VERSION_LESS_THAN("7.1")) {
            expect(storekit.SKTerminateForInvalidReceipt).toBeUndefined();
        } else {
            expect(storekit.SKTerminateForInvalidReceipt).not.toBeUndefined();
        }
    });
});
