var uikit = require('UIKit');
require('./CanvasViewController');
require('./DetailViewController');
require('./MasterViewController');

var TNSAppDelegate = uikit.UIResponder.extend({
	get window() {
		return this._window;
	},
	set window(aWindow) {
		this._window = aWindow;
	}
}, {
	protocols: [uikit.UIApplicationDelegate]
});

uikit.UIApplicationMain(0, null, null, TNSAppDelegate.name);