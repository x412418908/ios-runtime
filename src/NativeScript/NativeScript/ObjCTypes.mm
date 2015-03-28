//
//  ObjCTypes.mm
//  NativeScript
//
//  Created by Yavor Georgiev on 13.06.14.
//  Copyright (c) 2014 г. Telerik. All rights reserved.
//

#include <JavaScriptCore/JSArrayBuffer.h>
#include <JavaScriptCore/DateInstance.h>
#include <JavaScriptCore/JSMap.h>
#include "ObjCTypes.h"
#include "ObjCSuperObject.h"
#include "ObjCConstructorBase.h"
#include "ObjCConstructorCall.h"
#include "ObjCProtocolWrapper.h"
#include "ObjCConstructorDerived.h"
#include "Interop.h"

#import "TNSArrayAdapter.h"
#import "TNSDictionaryAdapter.h"

using namespace JSC;

class TNSValueWrapperWeakHandleOwner : public WeakHandleOwner {
    virtual void finalize(Handle<Unknown> handle, void* context) {
        [reinterpret_cast<TNSValueWrapper*>(context) detach];

        WeakSet::deallocate(WeakImpl::asWeakImpl(handle.slot()));
    }
};

static WeakHandleOwner* weakHandleOwner() {
    static WeakHandleOwner* owner;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        owner = new TNSValueWrapperWeakHandleOwner();
    });

    return owner;
}

@implementation TNSValueWrapper {
    Weak<JSObject> _valueWrapper;
    id _host;
    void* _associationKey;
}

+ (void)attachValue:(JSObject*)value toHost:(id)host {
    TNSValueWrapper* wrapper = [[self alloc] initWithValue:value
                                                      host:host];
    objc_setAssociatedObject(host, value->globalObject()->JSC::JSScope::vm(), wrapper, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
#if DEBUG_MEMORY
    NSLog(@"TNSValueWrapper attached to %@(%p)", object_getClass(host), host);
#endif
    [wrapper release];
}

- (instancetype)initWithValue:(JSObject*)value host:(id)host {
    if (self = [super init]) {
        self->_valueWrapper = Weak<JSObject>(value, weakHandleOwner(), self);
        self->_host = host;
        self->_associationKey = value->globalObject()->JSC::JSScope::vm();
    }

    return self;
}

- (JSObject*)value {
    return self->_valueWrapper.get();
}

- (void)detach {
    objc_setAssociatedObject(self->_host, self->_associationKey, nil, OBJC_ASSOCIATION_ASSIGN);
#if DEBUG_MEMORY
    NSLog(@"TNSValueWrapper detached from %@(%p)", object_getClass(self->_host), self->_host);
#endif
}

@end

namespace NativeScript {

static NSData* toObject(ExecState* execState, ArrayBuffer* arrayBuffer) {
    return [NSData dataWithBytes:arrayBuffer->data()
                          length:arrayBuffer->byteLength()];
}

static NSData* toObject(ExecState* execState, JSArrayBuffer* arrayBuffer) {
    return toObject(execState, arrayBuffer->impl());
}

static NSData* toObject(ExecState* execState, JSArrayBufferView* arrayBufferView) {
    return toObject(execState, arrayBufferView->buffer());
}

id toObject(ExecState* execState, const JSValue& value) {
    if (value.inherits(ObjCWrapperObject::info())) {
        return jsCast<ObjCWrapperObject*>(value.asCell())->wrappedObject();
    }

    if (value.inherits(ObjCConstructorBase::info())) {
        return jsCast<ObjCConstructorBase*>(value.asCell())->klass();
    }

    if (value.isUndefinedOrNull()) {
        return nil;
    }

    if (value.isInt32()) {
        return @(value.toInt32(execState));
    }

    if (value.isUInt32()) {
        return @(value.toUInt32(execState));
    }

    if (value.isDouble()) {
        return @(value.asDouble());
    }

    if (value.isBoolean()) {
        return @((BOOL)value.asBoolean());
    }

    if (value.isString()) {
        return [NSString stringWithString:(NSString*)value.toString(execState)->value(execState).createCFString().get()];
    }

    if (JSArray* array = jsDynamicCast<JSArray*>(value)) {
        return [[[TNSArrayAdapter alloc] initWithJSObject:array execState:execState->lexicalGlobalObject()->globalExec()] autorelease];
    }

    if (value.inherits(ObjCSuperObject::info())) {
        return jsCast<ObjCSuperObject*>(value.asCell())->wrapperObject()->wrappedObject();
    }

    if (value.inherits(DateInstance::info())) {
        return [NSDate dateWithTimeIntervalSince1970:(value.toNumber(execState) / 1000)];
    }

    if (JSMap* map = jsDynamicCast<JSMap*>(value)) {
        return [[[TNSDictionaryAdapter alloc] initWithJSObject:map execState:execState->lexicalGlobalObject()->globalExec()] autorelease];
    }

    if (value.inherits(JSArrayBuffer::info())) {
        return toObject(execState, jsCast<JSArrayBuffer*>(value.asCell()));
    }

    if (value.inherits(JSArrayBufferView::info())) {
        return toObject(execState, jsCast<JSArrayBufferView*>(value.asCell()));
    }

    bool hasHandle;
    void* handle = tryHandleofValue(value, &hasHandle);
    if (hasHandle) {
        return static_cast<id>(handle);
    }

    throwVMError(execState, createError(execState, WTF::String::format("Could not marshall \"%s\" to id.", value.toWTFString(execState).utf8().data())));
    return nil;
}

JSValue toValue(ExecState* execState, id object, Class klass) {
    if (object == nil) {
        return jsNull();
    }

    if (object == [NSNull null]) {
        return jsNull();
    }

    if ([object isKindOfClass:[NSString class]] && klass != [NSMutableString class]) {
        return jsString(execState, (CFStringRef)object);
    }

    if ([object isKindOfClass:[@YES class]]) {
        return jsBoolean([object boolValue]);
    }

    if ([object isKindOfClass:[NSNumber class]]) {
        return jsNumber([object doubleValue]);
    }

    if ([object isKindOfClass:[NSDate class]]) {
        return DateInstance::create(execState->vm(), execState->lexicalGlobalObject()->dateStructure(), [object timeIntervalSince1970] * 1000.0);
    }

    GlobalObject* globalObject = jsCast<GlobalObject*>(execState->lexicalGlobalObject());

    if (class_isMetaClass(object_getClass(object))) {
        return globalObject->constructorFor(object_getClass(object), klass);
    }

    return toValue(execState, object, ^{ return globalObject->constructorFor(object_getClass(object), klass)->instancesStructure(); });
}

JSValue toValue(ExecState* execState, id object, Structure* (^structureResolver)()) {
    if (JSObject* wrapper = [static_cast<TNSValueWrapper*>(objc_getAssociatedObject(object, execState->scope()->vm())) value]) {
        return wrapper;
    }

    if (object == nil) {
        return jsNull();
    }

    ObjCWrapperObject* wrapper = ObjCWrapperObject::create(execState->vm(), structureResolver(), object);
    [TNSValueWrapper attachValue:wrapper
                          toHost:object];
    return wrapper;
}
}
