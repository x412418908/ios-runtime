var foundation = require('Foundation');
var tnsapi = require('TNSApi');

describe(module.id, function () {
    afterEach(function () {
        TNSClearOutput();
    });

    it("SimpleNSStringConstant", function () {
        expect(foundation.NSRangeException).toBe('NSRangeException');
    });

    it("ConstantsEqulality", function () {
        expect(tnsapi.TNSConstant).toBe(tnsapi.TNSConstant);
        expect(tnsapi.TNSConstant.description).toBe(tnsapi.TNSConstant.description);
    });

// TODO
//    it("ChangeConstantValue", function () {
//        global.TNSConstant = null;
//        expect(TNSConstant).not.toBeNull();
//    });
//
//    it("DeleteConstant", function () {
//        expect(delete global.TNSConstant).toBe(false);
//    });
});
