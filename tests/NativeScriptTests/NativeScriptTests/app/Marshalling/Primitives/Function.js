var tnsprimitives = require('TNSPrimitives');
var tnsmethodcalls = require('TNSMethodCalls');
var objectivec = require('ObjectiveC');

describe(module.id, function () {
    afterEach(function () {
        TNSClearOutput();
    });

    it("FunctionWithChar1", function () {
        var result = tnsprimitives.functionWithChar(127);
        expect(result).toBe(127);

        var actual = TNSGetOutput();
        expect(actual).toBe("127");
    });
    it("FunctionWithChar2", function () {
        var result = tnsprimitives.functionWithChar(-128);
        expect(result).toBe(-128);

        var actual = TNSGetOutput();
        expect(actual).toBe("-128");
    });

    it("FunctionWithShort1", function () {
        var result = tnsprimitives.functionWithShort(32767);
        expect(result).toBe(32767);

        var actual = TNSGetOutput();
        expect(actual).toBe("32767");
    });
    it("FunctionWithShort2", function () {
        var result = tnsprimitives.functionWithShort(-32768);
        expect(result).toBe(-32768);

        var actual = TNSGetOutput();
        expect(actual).toBe("-32768");
    });

    it("FunctionWithInt1", function () {
        var result = tnsprimitives.functionWithInt(2147483647);
        expect(result).toBe(2147483647);

        var actual = TNSGetOutput();
        expect(actual).toBe("2147483647");
    });
    it("FunctionWithInt2", function () {
        var result = tnsprimitives.functionWithInt(-2147483648);
        expect(result).toBe(-2147483648);

        var actual = TNSGetOutput();
        expect(actual).toBe("-2147483648");
    });

    it("FunctionWithLong1", function () {
        var result = tnsprimitives.functionWithLong(2147483647);
        expect(result).toBe(2147483647);

        var actual = TNSGetOutput();
        expect(actual).toBe("2147483647");
    });
    it("FunctionWithLong2", function () {
        var result = tnsprimitives.functionWithLong(-2147483648);
        expect(result).toBe(-2147483648);

        var actual = TNSGetOutput();
        expect(actual).toBe("-2147483648");
    });

    //TODO
    // it("FunctionWithLongLong1", function() {
    //     var result = functionWithLongLong('9223372036854775807');
    //     expect(result).toBe(ring() === '9223372036854775807');
    //     result = functionWithLongLong(result);
    //     expect(result).toBe(ring() === '9223372036854775807');

    //     var actual = TNSGetOutput();
    //     expect(actual).toBe("92233720368547758079223372036854775807");
    // });
    // it("FunctionWithLongLong2", function() {
    //     var result = functionWithLongLong('-9223372036854775808');
    //     expect(result).toBe(ring() === '-9223372036854775808');
    //     result = functionWithLongLong(result);
    //     expect(result).toBe(ring() === '-9223372036854775808');

    //     var actual = TNSGetOutput();
    //     expect(actual).toBe("-9223372036854775808-9223372036854775808");
    // });

    it("FunctionWithUChar", function () {
        var result = tnsprimitives.functionWithUChar(255);
        expect(result).toBe(255);

        var actual = TNSGetOutput();
        expect(actual).toBe("255");
    });
    it("FunctionWithUShort", function () {
        var result = tnsprimitives.functionWithUShort(65535);
        expect(result).toBe(65535);

        var actual = TNSGetOutput();
        expect(actual).toBe("65535");
    });

    it("FunctionWithUInt", function () {
        var result = tnsprimitives.functionWithUInt(4294967295);
        expect(result).toBe(4294967295);

        var actual = TNSGetOutput();
        expect(actual).toBe("4294967295");
    });

    it("FunctionWithULong", function () {
        var result = tnsprimitives.functionWithULong(4294967295);
        expect(result).toBe(4294967295);

        var actual = TNSGetOutput();
        expect(actual).toBe("4294967295");
    });

    // TODO
    // it("FunctionWithULongLong", function() {
    //     var result = functionWithULongLong('18446744073709551615');
    //     expect(result).toBe(ring() === '18446744073709551615');
    //     result = functionWithULongLong(result);
    //     expect(result).toBe(ring() === '18446744073709551615');

    //     var actual = TNSGetOutput();
    //     expect(actual).toBe("1844674407370955161518446744073709551615");
    // });

    it("FunctionWithFloat1", function () {
        var result = tnsprimitives.functionWithFloat(3.40282347e+38);
        expect(result).toBe(3.4028234663852886e+38);

        var actual = TNSGetOutput();
        expect(actual).toBe("340282346638528859811704183484516925440.000000000000000000000000000000000000000000000");
    });

// TODO: This test passes only on iPhone 5s
//    it("FunctionWithFloat2", function () {
//        var result = functionWithFloat(1.17549435e-38);
//        expect(result).toBe(1.1754943508222875e-38);
//
//        var actual = TNSGetOutput();
//        expect(actual).toBe("0.000000000000000000000000000000000000011754944");
//    });

    it("FunctionWithDouble1", function () {
        var result = tnsprimitives.functionWithDouble(1.7976931348623157e+308);
        expect(result).toBe(1.7976931348623157e+308);

        var actual = TNSGetOutput();
        expect(actual).toBe("179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    });
    it("FunctionWithDouble2", function () {
        var result = tnsprimitives.functionWithDouble(2.2250738585072014e-308);
        expect(result).toBe(2.2250738585072014e-308);

        var actual = TNSGetOutput();
        expect(actual).toBe("0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000222507385850720138");
    });

    it("FunctionWithSelector", function () {
        var result = tnsprimitives.functionWithSelector('init');
        expect(result).toBe('init');

        var actual = TNSGetOutput();
        expect(actual).toBe("init");
    });

    it("FunctionWithClass", function () {
        var result = tnsprimitives.functionWithClass(objectivec.NSObject);
        expect(result).toBe(objectivec.NSObject);

        var actual = TNSGetOutput();
        expect(actual).toBe("NSObject");
    });

    it("FunctionWithProtocol", function () {
        var result = tnsprimitives.functionWithProtocol(tnsmethodcalls.TNSBaseProtocol1);
        expect(result).toBe(tnsmethodcalls.TNSBaseProtocol1);

        var actual = TNSGetOutput();
        expect(actual).toBe("TNSBaseProtocol1");
    });

    it("FunctionWithNull", function () {
        var result = tnsprimitives.functionWithNull(null);
        expect(result).toBe(null);

        var actual = TNSGetOutput();
        expect(actual).toBe("(null)");
    });

    it("FunctionWithBool", function () {
        var result = tnsprimitives.functionWithBool(true);
        expect(result).toBe(true);

        var actual = TNSGetOutput();
        expect(actual).toBe("1");
    });

    it("FunctionWithBool2", function () {
        var result = tnsprimitives.functionWithBool2(true);
        expect(result).toBe(true);

        var actual = TNSGetOutput();
        expect(actual).toBe("1");
    });

    it("FunctionWithBool3", function () {
        var result = tnsprimitives.functionWithBool3(true);
        expect(result).toBe(true);

        var actual = TNSGetOutput();
        expect(actual).toBe("1");
    });

    it("FunctionWithUnichar", function () {
        var result = tnsprimitives.functionWithUnichar('i');
        expect(result).toBe('i');

        var actual = TNSGetOutput();
        expect(actual).toBe("i");

        expect(function () {
            tnsprimitives.functionWithUnichar('iPhone');
        }).toThrowError();
    });
});
