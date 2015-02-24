var objectivec = require('ObjectiveC');
var tnsmethodcalls = require('TNSMethodCalls');
var tnsrecords = require('TNSRecords');
var tnsobjctypes = require('TNSObjCTypes');
var tnsprimitivepointers = require('TNSPrimitivePointers');
var tnsfunctionpointers = require('TNSFunctionPointers');

var NSObject = objectivec.NSObject;

describe(module.id, function () {
    afterEach(function () {
        TNSClearOutput();
    });

    it("SimplePointer", function () {
        var pointer = new interop.Pointer(1);
        expect(pointer instanceof interop.Pointer).toBe(true);
        expect(pointer.toString()).toBe('<Pointer: 0x1>');
    });

    it("PointerArithmetic", function () {
        var pointer = new interop.Pointer(0xFFFFFFFF);
        expect(pointer.toNumber()).toBe(0xFFFFFFFF);

        pointer = pointer.subtract(4);
        expect(pointer.toNumber()).toBe(0xFFFFFFFB);

        pointer = pointer.add(4);
        expect(pointer.toNumber()).toBe(0xFFFFFFFF);
    });

    it("NullPointer", function () {
        expect(new interop.Pointer()).toBeNull();
        expect(new interop.Pointer(0)).toBeNull();
        expect(new interop.Pointer(4).subtract(4)).toBeNull();
    });

    it("PointerEquality", function () {
        expect(new interop.Pointer(4)).toBe(new interop.Pointer(2).add(2));
    });

    it("Handleof", function () {
        expect(interop.handleof(NSObject) instanceof interop.Pointer).toBe(true);
        expect(interop.handleof(NSObject.alloc().init()) instanceof interop.Pointer).toBe(true);

        expect(interop.handleof(NSObject.extend({})) instanceof interop.Pointer).toBe(true);
        expect(interop.handleof(NSObject.extend({}).alloc().init()) instanceof interop.Pointer).toBe(true);

        expect(interop.handleof(tnsmethodcalls.TNSBaseProtocol1) instanceof interop.Pointer).toBe(true);
        expect(interop.handleof(tnsprimitivepointers.functionWithInt) instanceof interop.Pointer).toBe(true);
        expect(interop.handleof(tnsobjctypes.TNSObjCTypes.alloc().init().methodWithBlockScope(4)) instanceof interop.Pointer).toBe(true);

        expect(interop.handleof(new tnsrecords.TNSSimpleStruct()) instanceof interop.Pointer).toBe(true);
        expect(interop.handleof(interop.alloc(4)) instanceof interop.Pointer).toBe(true);

        var reference = new interop.Reference();
        expect(function () {
            interop.handleof(reference);
        }).toThrowError();
        tnsprimitivepointers.functionWithIntPtr(reference);
        expect(interop.handleof(reference) instanceof interop.Pointer).toBe(true);

        var functionReference = new interop.FunctionReference(function () {
        });
        expect(function () {
            interop.handleof(functionReference);
        }).toThrowError();
        tnsfunctionpointers.functionWithSimpleFunctionPointer(functionReference);
        expect(interop.handleof(functionReference) instanceof interop.Pointer).toBe(true);

        expect(interop.handleof(null)).toBe(null);
    });

    it("Sizeof", function () {
        expect(interop.sizeof(NSObject)).toBeGreaterThan(0);
        expect(interop.sizeof(NSObject.alloc().init())).toBeGreaterThan(0);

        expect(interop.sizeof(NSObject.extend({}))).toBeGreaterThan(0);
        expect(interop.sizeof(NSObject.extend({}).alloc().init())).toBeGreaterThan(0);

        expect(interop.sizeof(tnsmethodcalls.TNSBaseProtocol1)).toBeGreaterThan(0);
        expect(interop.sizeof(tnsprimitivepointers.functionWithInt)).toBeGreaterThan(0);
        expect(interop.sizeof(tnsobjctypes.TNSObjCTypes.alloc().init().methodWithBlockScope(4))).toBeGreaterThan(0);

        expect(interop.sizeof(interop.Reference)).toBeGreaterThan(0);
        expect(interop.sizeof(new interop.Reference())).toBeGreaterThan(0);

        expect(interop.sizeof(interop.FunctionReference)).toBeGreaterThan(0);
        expect(interop.sizeof(new interop.FunctionReference(function () {
        }))).toBeGreaterThan(0);

        expect(interop.sizeof(interop.Pointer)).toBeGreaterThan(0);
        expect(interop.sizeof(new interop.Pointer(0xFFFFFF))).toBeGreaterThan(0);

        expect(interop.sizeof(TNSSimpleStruct)).toBeGreaterThan(0);
        expect(interop.sizeof(new TNSSimpleStruct())).toBeGreaterThan(0);
    });
});
