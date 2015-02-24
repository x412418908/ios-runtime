var tnsapi = require('TNSApi');

describe(module.id, function () {
    afterEach(function () {
        TNSClearOutput();
    });

    it("Enumeration", function () {
        expect(tnsapi.TNSEnums.TNSEnum1).toBe(-1);
        expect(tnsapi.TNSEnums.TNSEnum2).toBe(0);
        expect(tnsapi.TNSEnums.TNSEnum3).toBe(1);

        expect(tnsapi.TNSEnums[-1]).toBe('TNSEnum1');
        expect(tnsapi.TNSEnums[0]).toBe('TNSEnum2');
        expect(tnsapi.TNSEnums[1]).toBe('TNSEnum3');
    });

    it("Options", function () {
        expect(tnsapi.TNSOptions.TNSOption1).toBe(1);
        expect(tnsapi.TNSOptions.TNSOption2).toBe(2);
        expect(tnsapi.TNSOptions.TNSOption3).toBe(4);

        expect(tnsapi.TNSOptions[1]).toBe('TNSOption1');
        expect(tnsapi.TNSOptions[2]).toBe('TNSOption2');
        expect(tnsapi.TNSOptions[4]).toBe('TNSOption3');
    });

    it("AnonymousEnum", function () {
        expect(tnsapi.AnonymousEnumField).toBe(-1);
    });
});
