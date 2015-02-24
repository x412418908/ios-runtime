var objectivec = require('ObjectiveC');
var tnstestnativecallbacks = require('TNSTestNativeCallbacks');
var tnsmethodcalls = require('TNSMethodCalls');

describe(module.id, function () {
    afterEach(function () {
        TNSClearOutput();
    });

    it('Methods', function () {
        var object = objectivec.NSObject.extend({
            baseProtocolMethod1: function () {
                TNSLog('baseProtocolMethod1 called');
            }
        }, {
            protocols: [tnsmethodcalls.TNSBaseProtocol1]
        }).alloc().init();

        var actual;
        var expected = "baseProtocolMethod1 called";

        object.baseProtocolMethod1();

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();

        tnstestnativecallbacks.TNSTestNativeCallbacks.protocolImplementationMethods(object);

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();
    });

    it('Properties', function () {
        var object = objectivec.NSObject.extend({
            get baseProtocolProperty1() {
                TNSLog('baseProtocolProperty1 called');
            },
            set baseProtocolProperty1(x) {
                TNSLog('setBaseProtocolProperty1: called');
            },

            get baseProtocolProperty1Optional() {
                TNSLog('baseProtocolProperty1Optional called');
            },
            set baseProtocolProperty1Optional(x) {
                TNSLog('setBaseProtocolProperty1Optional: called');
            },
        }, {
            protocols: [tnsmethodcalls.TNSBaseProtocol1]
        }).alloc().init();

        var actual;
        var expected =
            "setBaseProtocolProperty1: called" +
            "baseProtocolProperty1 called" +
            "setBaseProtocolProperty1Optional: called" +
            "baseProtocolProperty1Optional called";

        object.baseProtocolProperty1 = 0;
        UNUSED(object.baseProtocolProperty1);
        object.baseProtocolProperty1Optional = 0;
        UNUSED(object.baseProtocolProperty1Optional);

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();

        tnstestnativecallbacks.TNSTestNativeCallbacks.protocolImplementationProperties(object);

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();
    });

    it("ProtocolInheritance", function () {
        var object = objectivec.NSObject.extend({
            baseProtocolMethod1: function () {
                TNSLog('baseProtocolMethod1 called');
            },
            baseProtocolMethod2: function () {
                TNSLog('baseProtocolMethod2 called');
            },
        }, {
            protocols: [tnsmethodcalls.TNSBaseProtocol2]
        }).alloc().init();

        var actual;
        var expected =
            "baseProtocolMethod1 called" +
            "baseProtocolMethod2 called";

        object.baseProtocolMethod1();
        object.baseProtocolMethod2();

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();

        tnstestnativecallbacks.TNSTestNativeCallbacks.protocolImplementationProtocolInheritance(object);

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();
    });

    it('OptionalMethods', function () {
        var object = objectivec.NSObject.extend({
            baseProtocolMethod1Optional: function () {
                TNSLog('baseProtocolMethod1Optional called');
            },
        }, {
            protocols: [tnsmethodcalls.TNSBaseProtocol2]
        }).alloc().init();

        var actual;
        var expected = "baseProtocolMethod1Optional called";

        object.baseProtocolMethod1Optional();

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();

        tnstestnativecallbacks.TNSTestNativeCallbacks.protocolImplementationOptionalMethods(object);

        actual = TNSGetOutput();
        expect(actual).toBe(expected);
        TNSClearOutput();
    });

    it('AlreadyImplementedProtocol', function () {
        tnsmethodcalls.TNSDerivedInterface.extend({}, {
            protocols: [tnsmethodcalls.TNSBaseProtocol1]
        });
    });
});
