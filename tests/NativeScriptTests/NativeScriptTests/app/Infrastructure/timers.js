// https://github.com/telerik/xPlatCore/blob/master/JS/BCL/timer/timer.ios.ts
var foundation = require('Foundation');
var objectivec = require('ObjectiveC');

var timeoutCallbacks = {};

var TimerCallbackTarget = objectivec.NSObject.extend({
    "tick:": function (timer) {
        this.callback.call(null);
    }
}, {
    exposedMethods: {
        "tick:": { returns: interop.types.void, params: [ foundation.NSTimer ] }
    }
});

function createTimerAndGetId(callback, milliseconds, shouldRepeat) {
    var id = new Date().getUTCMilliseconds();

    var target = new TimerCallbackTarget();
    target.callback = callback;
    var timer = foundation.NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(milliseconds / 1000, target, "tick:", null, shouldRepeat);

    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = timer;
    }

    return id;
}

function setTimeout(callback, milliseconds) {
    if (typeof milliseconds === "undefined") {
        milliseconds = 0;
    }
    return createTimerAndGetId(callback, milliseconds, false);
}
global.setTimeout = setTimeout;

function clearTimeout(id) {
    if (timeoutCallbacks[id]) {
        timeoutCallbacks[id].invalidate();
        timeoutCallbacks[id] = null;
    }
}
global.clearTimeout = clearTimeout;
