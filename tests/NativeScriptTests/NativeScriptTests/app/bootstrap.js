// Inform the test results runner that the runtime is up.
console.log('TNSRuntime is running...');

require('./Infrastructure/timers');
var common = require('TNSTestCommon');
var foundation = require('Foundation');
var uikit = require('UIKit');

global.TNSGetOutput = common.TNSGetOutput;
global.TNSClearOutput = common.TNSClearOutput;
global.TNSLog = common.TNSLog;

global.UNUSED = function (param) {
};

global.SYSTEM_VERSION_LESS_THAN = function (version) {
    var systemVersion = foundation.NSString.stringWithString(uikit.UIDevice.currentDevice().systemVersion);
    return systemVersion.compareOptions(version, foundation.NSStringCompareOptions.NSNumericSearch) === foundation.NSComparisonResult.NSOrderedAscending;
};

var args = foundation.NSProcessInfo.processInfo().arguments;
var logjunit = args.containsObject("-logjunit");

// Provides an output channel for jasmine JUnit test result xml.
global.__JUnitSaveResults = function (text) {
    TNSSaveResults(text);

    if (logjunit) {
        text.split('\n').forEach(function (line) {
            console.log("TKUnit: " + line);
        });
    }
};

global.__approot = foundation.NSBundle.mainBundle().bundlePath;

require('./Infrastructure/Jasmine/jasmine-2.0.1/boot');

require('./Marshalling/Primitives/Function');
require('./Marshalling/Primitives/Static');
require('./Marshalling/Primitives/Instance');
require('./Marshalling/Primitives/Derived');

require('./Marshalling/ObjCTypesTests');
require('./Marshalling/ConstantsTests');
require('./Marshalling/RecordTests');
require('./Marshalling/NSStringTests');
require('./Marshalling/TypesTests');
require('./Marshalling/PointerTests');
require('./Marshalling/ReferenceTests');
require('./Marshalling/FunctionPointerTests');
require('./Marshalling/EnumTests');

// require('./Inheritance/ConstructorResolutionTests');
require('./Inheritance/InheritanceTests');
require('./Inheritance/ProtocolImplementationTests');
require('./Inheritance/TypeScriptTests');

require('./MethodCallsTests');
require('./FunctionsTests');
require('./VersionDiffTests');
require('./ApiTests');

require('./MetadataTests');

// Tests common for all runtimes.
require('./shared');

execute();

uikit.UIApplicationMain(0, null, null, null);
