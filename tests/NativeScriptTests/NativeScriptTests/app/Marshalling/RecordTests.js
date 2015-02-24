var foundation = require('Foundation');
var tnsrecords = require('TNSRecords');
var tnstestnativecallbacks = require('TNSTestNativeCallbacks');

describe(module.id, function () {
    afterEach(function () {
        TNSClearOutput();
    });

    it("SimpleRecord", function () {
        var record = new tnsrecords.TNSSimpleStruct();
        expect(record instanceof tnsrecords.TNSSimpleStruct).toBe(true);

        expect(record.x).toBe(0);
        expect(record.y).toBe(0);
    });

    it("SimpleRecordEqualsFastPath", function () {
        var record1 = new tnsrecords.TNSSimpleStruct();
        var record2 = new tnsrecords.TNSSimpleStruct();
        expect(tnsrecords.TNSSimpleStruct.equals(record1, record2)).toBe(true);
    });

    it("SimpleRecordEqualsSlowPath", function () {
        var record1 = {x: 1, y: 2};
        var record2 = {x: 1, y: 2};
        expect(tnsrecords.TNSSimpleStruct.equals(record1, record2)).toBe(true);
    });

    it("NestedRecordEqualsSlowPath1", function () {
        var record1 = new tnsrecords.TNSNestedStruct();
        var record2 = {a: {x: 0, y: 0}, b: {x: 0, y: 0}};
        expect(tnsrecords.TNSNestedStruct.equals(record1, record2)).toBe(true);
    });

    it("NestedRecordEqualsSlowPath2", function () {
        var record1 = {a: {x: 0, y: 0}, b: {x: 0, y: 0}};
        var record2 = {a: {x: 0, y: 0}, b: {x: 0, y: 0}};
        expect(tnsrecords.TNSNestedStruct.equals(record1, record2)).toBe(true);
    });

    it("RecordConstructorLiteral", function () {
        var record = new tnsrecords.TNSNestedStruct({a: {x: 1, y: 2}, b: {x: 3, y: 4}});
        tnstestnativecallbacks.TNSTestNativeCallbacks.recordsNestedStruct(record);
        expect(TNSGetOutput()).toBe('1 2 3 4');
    });

    it("RecordConstructorPointer", function () {
        (function () {
            var size = interop.sizeof(tnsrecords.TNSNestedStruct);
            expect(size).toBeGreaterThan(0);
            var buffer = interop.alloc(size);
            var record = new tnsrecords.TNSNestedStruct(buffer);
            tnstestnativecallbacks.TNSTestNativeCallbacks.recordsNestedStruct(record);
            expect(TNSGetOutput()).toBe('0 0 0 0');
        }());
        __collect();
    });

    it("RecordFunctionPointer", function () {
        (function () {
            var size = interop.sizeof(tnsrecords.TNSNestedStruct);
            expect(size).toBeGreaterThan(0);
            var buffer = interop.alloc(size);
            var record = tnsrecords.TNSNestedStruct(buffer);
            tnstestnativecallbacks.TNSTestNativeCallbacks.recordsNestedStruct(record);
            expect(TNSGetOutput()).toBe('0 0 0 0');
            expect(interop.handleof(record)).toBe(buffer);
        }());
        __collect();
    });

    it("RecordStrings", function () {
        var record = new tnsrecords.TNSNestedStruct();
        expect(JSON.stringify(record)).toBe('{"a":{"x":0,"y":0},"b":{"x":0,"y":0}}');
        expect(record.toString()).toMatch(/^<struct TNSNestedStruct: 0x\w+>$/)
    });

    it("SimpleStructWraper", function () {
        var record = new tnsrecords.TNSSimpleStruct();
        record.x = 7;
        record.y = 8;

        var result = tnstestnativecallbacks.TNSTestNativeCallbacks.recordsSimpleStruct(record);
        expect(TNSGetOutput()).toBe('7 8');

        expect(result.x).toBe(record.x);
        expect(result.y).toBe(record.y);
    });

    it("SimpleStructLiteral", function () {
        var object = {
            x: 7,
            y: 8
        };

        var result = tnstestnativecallbacks.TNSTestNativeCallbacks.recordsSimpleStruct(object);
        expect(TNSGetOutput()).toBe('7 8');

        expect(result.x).toBe(object.x);
        expect(result.y).toBe(object.y);
    });

    // TODO
    // it("StructWithArray", function() {
    //     var object = {
    //         x: 1,
    //         arr: [2, 3, 4, 5],
    //     };

    //     var result = tnstestnativecallbacks.TNSTestNativeCallbacks.recordsStructWithArray(object);
    //     expect(TNSGetOutput()).toBe('1 2 3 4 5');

    //     expect(result).toEqual(object);
    // });

    it("NestedAnonymousStruct", function () {
        var object = {
            x1: 1,
            y1: {
                x2: 2,
                y2: {
                    x3: 3
                }
            }
        };

        var result = tnstestnativecallbacks.TNSTestNativeCallbacks.recordsNestedAnonymousStruct(object);
        expect(TNSGetOutput()).toBe('1 2 3');

        expect(result.x1).toBe(object.x1);
        expect(result.y1.x2).toBe(object.y1.x2);
        expect(result.y1.y2.x3).toBe(object.y1.y2.x3);
    });

    it("NSRangeMake", function () {
        expect(foundation.NSRange.equals(NSMakeRange(1, 2), {
            location: 1,
            length: 2
        })).toBe(true);
    });

    it("LinkedList", function () {
        var record = new tnsrecords.TNSStructWithPointers();
        record.z = new tnsrecords.TNSStructWithPointers();
        expect(record.z.value.z).toBe(null);
    });

    // TODO
    // it("ComplexStruct", function() {
    //     var object = {
    //         x1: 1,
    //         y1: [{
    //             x2: 2,
    //             y2: {
    //                 x3: [3, 4],
    //             },
    //         }, {
    //             x2: 5,
    //             y2: {
    //                 x3: [6, 7],
    //             },
    //         }],
    //     };

    //     var result = tnstestnativecallbacks.TNSTestNativeCallbacks.recordsComplexStruct(object);
    //     expect(TNSGetOutput()).toBe('1 2 3 4 5 6 7');
    //     expect(result).toEqual(object);
    // });
});
