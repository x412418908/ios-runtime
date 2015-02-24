var foundation = require('Foundation');
var objectivec = require('ObjectiveC');
var tnsrecords = require('TNSRecords');
var tnsprimitivepointers = require('TNSPrimitivePointers');

describe(module.id, function () {
    afterEach(function () {
        TNSClearOutput();
    });

    it("SimpleReference", function () {
        var reference = new interop.Reference();
        expect(reference instanceof interop.Reference).toBe(true);
        expect(reference.toString()).toBe('<Reference: 0x0>');
    });

    it("ReferenceValue", function () {
        var reference = new interop.Reference();
        expect(reference.value).toBeUndefined();
        expect(function () {
            interop.handleof(reference);
        }).toThrow();

        reference.value = 5;
        expect(reference.value).toBe(5);

        tnsprimitivepointers.functionWithIntPtr(reference);
        expect(reference.value).toBe(5);
        expect(interop.handleof(reference) instanceof interop.Pointer).toBe(true);

        reference.value = 10;
        expect(reference.value).toBe(10);
        expect(interop.handleof(reference) instanceof interop.Pointer).toBe(true);

        var oldHandle = interop.handleof(reference);
        tnsprimitivepointers.functionWithIntPtr(reference);
        expect(oldHandle).toBe(interop.handleof(reference));
        expect(reference.value).toBe(10);

        expect(TNSGetOutput()).toBe('510');
    });

    it("LiveReference", function () {
        var manager = new tnsprimitivepointers.TNSPointerManager();
        expect(manager.data().value).toBe(0);

        manager.increment();
        expect(manager.data().value).toBe(1);

        manager.increment();
        expect(manager.data().value).toBe(2);
    });

    it("NullPtr", function () {
        expect(tnsprimitivepointers.functionWithNullPointer(null)).toBeNull();
        expect(TNSGetOutput()).toBe('0x0');
    });

    it("functionWith_VoidPtr", function () {
        expect(tnsprimitivepointers.functionWith_VoidPtr(interop.alloc(4)) instanceof interop.Pointer).toBe(true);
        expect(TNSGetOutput().length).toBeGreaterThan(0);
    });

    it("functionWith_BoolPtr", function () {
        expect(tnsprimitivepointers.functionWith_BoolPtr(new interop.Reference(true)).value).toBe(true);
        expect(TNSGetOutput()).toBe('1');
    });

    it("functionWithUShortPtr", function () {
        expect(tnsprimitivepointers.functionWithUShortPtr(new interop.Reference(65535)).value).toBe(65535);
        expect(TNSGetOutput()).toBe('65535');
    });

    it("functionWithUIntPtr", function () {
        expect(tnsprimitivepointers.functionWithUIntPtr(new interop.Reference(4294967295)).value).toBe(4294967295);
        expect(TNSGetOutput()).toBe('4294967295');
    });

    it("functionWithULongPtr", function () {
        expect(tnsprimitivepointers.functionWithULongPtr(new interop.Reference(4294967295)).value).toBe(4294967295);
        expect(TNSGetOutput()).toBe('4294967295');
    });

    // TODO
    // it("functionWithULongLongPtr", function () {
    //     expect(functionWithULongLongPtr(new interop.Reference(1)).value).toBe(1);
    //     expect(TNSGetOutput()).toBe('1');
    // });

    it("functionWithShortPtr", function () {
        expect(tnsprimitivepointers.functionWithShortPtr(new interop.Reference(32767)).value).toBe(32767);
        expect(TNSGetOutput()).toBe('32767');
    });

    it("functionWithIntPtr", function () {
        expect(tnsprimitivepointers.functionWithIntPtr(new interop.Reference(2147483647)).value).toBe(2147483647);
        expect(TNSGetOutput()).toBe('2147483647');
    });

    it("functionWithLongPtr", function () {
        expect(tnsprimitivepointers.functionWithLongPtr(new interop.Reference(2147483647)).value).toBe(2147483647);
        expect(TNSGetOutput()).toBe('2147483647');
    });

    // TODO
    // it("functionWithLongLongPtr", function () {
    //     expect(functionWithLongLongPtr(new interop.Reference(1)).value).toBe(0);
    //     expect(TNSGetOutput()).toBe('1');
    // });

    it("functionWithFloatPtr", function () {
        expect(tnsprimitivepointers.functionWithFloatPtr(new interop.Reference(3.4028234663852886e+38)).value).toBe(3.4028234663852886e+38);
        expect(TNSGetOutput()).toBe('340282346638528859811704183484516925440.000000000000000000000000000000000000000000000');
    });

    it("functionWithDoublePtr", function () {
        expect(tnsprimitivepointers.functionWithDoublePtr(new interop.Reference(1.7976931348623157e+308)).value).toBe(1.7976931348623157e+308);
        expect(TNSGetOutput()).toBe('179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    });

    it("functionWithStructPtr", function () {
        var struct = new tnsrecords.TNSNestedStruct({a: {x: 1, y: 2}, b: {x: 3, y: 4}});
        expect(tnsrecords.TNSNestedStruct.equals(tnsprimitivepointers.functionWithStructPtr(new interop.Reference(struct)).value, struct)).toBe(true);
        expect(TNSGetOutput()).toBe('1 2 3 4');
    });

    it("CString1", function () {
        expect(foundation.NSString.stringWithUTF8String(tnsprimitivepointers.functionWithCharPtr('test')).toString()).toBe('test');
    });

    it("CString2", function () {
        expect(foundation.NSString.stringWithUTF8String(tnsprimitivepointers.functionWithUCharPtr('test')).toString()).toBe('test');
    });

    // TODO: Create array type and constructor
    it("IncompleteCArrayParameter", function () {
        var handle = interop.alloc(4 * interop.sizeof(interop.types.int32));
        var reference = new interop.Reference(interop.types.int32, handle);
        expect(interop.handleof(reference)).toBe(handle);

        reference[0] = 1;
        reference[1] = 2;
        reference[2] = 3;
        reference[3] = 0;

        tnsprimitivepointers.functionWithIntIncompleteArray(reference);
        expect(TNSGetOutput()).toBe('123');
    });

    it("ConstantCArrayParameter", function () {
        var handle = interop.alloc(5 * interop.sizeof(interop.types.int32));
        var reference = new interop.Reference(interop.types.int32, handle);
        reference[0] = 1;
        reference[1] = 2;
        reference[2] = 3;
        reference[3] = 4;
        reference[4] = 5;

        tnsprimitivepointers.functionWithIntConstantArray(reference);
        expect(TNSGetOutput()).toBe('12345');
    });

    it("ConstantCArrayParameter2", function () {
        var handle = interop.alloc(4 * interop.sizeof(interop.types.int32));
        var reference = new interop.Reference(interop.types.int32, handle);
        reference[0] = 1;
        reference[1] = 2;
        reference[2] = 3;
        reference[3] = 4;

        tnsprimitivepointers.functionWithIntConstantArray2(reference);
        expect(TNSGetOutput()).toBe('1234');
    });

    it("NSArrayWithObjects", function () {
        var handle = interop.alloc(4 * interop.sizeof(interop.types.id));
        var reference = new interop.Reference(interop.types.id, handle);
        reference[0] = new objectivec.NSObject();
        reference[1] = new objectivec.NSObject();
        reference[2] = new objectivec.NSObject();
        reference[3] = new objectivec.NSObject();

        var array = foundation.NSArray.arrayWithObjectsCount(reference, 4);
        expect(array[0].class()).toBe(objectivec.NSObject);
        expect(array[1].class()).toBe(objectivec.NSObject);
        expect(array[2].class()).toBe(objectivec.NSObject);
        expect(array[3].class()).toBe(objectivec.NSObject);
    });

    it("SmallArrayBuffer", function () {
        var view = new Int32Array([1, 2, 3, 4, 5, 0]);
        tnsprimitivepointers.functionWithIntIncompleteArray(view);
        expect(TNSGetOutput()).toBe('12345');
        TNSClearOutput();

        tnsprimitivepointers.functionWithIntIncompleteArray(view.buffer);
        expect(TNSGetOutput()).toBe('12345');
        TNSClearOutput();
    });

    it("LargeArrayBuffer", function () {
        var array = new Array(10000);

        for (var i = 0; i < array.length; i++) {
            array[i] = i + 1;
        }

        var expected = array.join('');

        array.push(0);
        var view = new Int32Array(array);

        tnsprimitivepointers.functionWithIntIncompleteArray(view);
        expect(TNSGetOutput()).toBe(expected);
        TNSClearOutput();

        tnsprimitivepointers.functionWithIntIncompleteArray(view.buffer);
        expect(TNSGetOutput()).toBe(expected);
        TNSClearOutput();
    });

    it("CastPointerToNSObject", function () {
        var x = objectivec.NSObject.alloc().init();
        var y = objectivec.NSObject(interop.handleof(x));
        expect(x).toBe(y);
        expect(x.toString()).toBe(y.toString());
        expect(interop.handleof(x)).toBe(interop.handleof(y));
    });
});
