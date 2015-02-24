//
// Created by Yavor Ivanov on 12/1/14.
// Copyright (c) 2014 Telerik. All rights reserved.
//


#ifndef __ModuleObject_H_
#define __ModuleObject_H_

namespace NativeScript {
class ModuleObject : public JSC::JSNonFinalObject {
public:
    typedef JSC::JSNonFinalObject Base;

    static const unsigned StructureFlags;

    static ModuleObject* create(JSC::VM& vm, JSC::Structure* structure, const WTF::String& name) {
        ModuleObject* object = new (NotNull, JSC::allocateCell<ModuleObject>(vm.heap)) ModuleObject(vm, structure);
        object->finishCreation(vm, name);
        return object;
    }

    DECLARE_INFO;

    static JSC::Structure* createStructure(JSC::VM& vm, JSC::JSGlobalObject* globalObject, JSC::JSValue prototype) {
        return JSC::Structure::create(vm, globalObject, prototype, JSC::TypeInfo(JSC::ObjectType, StructureFlags), info());
    }

    static WTF::String className(const JSObject* object);

    static bool getOwnPropertySlot(JSC::JSObject* object, JSC::ExecState* execState, JSC::PropertyName propertyName, JSC::PropertySlot& propertySlot);

    static void getOwnPropertyNames(JSC::JSObject* object, JSC::ExecState* execState, JSC::PropertyNameArray& propertyNames, JSC::EnumerationMode enumerationMode);

private:
    ModuleObject(JSC::VM& vm, JSC::Structure* structure)
        : Base(vm, structure)
    { }

    void finishCreation(JSC::VM& vm, const WTF::String& name);

    WTF::String _name;

    std::map<Class, JSC::Strong<ObjCConstructorBase>> _objCConstructors;

    std::map<const Protocol*, JSC::Strong<ObjCProtocolWrapper>> _objCProtocolWrappers;
};
}

#endif //__ModuleObject_H_
