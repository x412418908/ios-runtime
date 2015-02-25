var foundation = require('Foundation');
var uikit = require('UIKit');

function getURLSession() {
    return foundation.NSURLSession.sessionWithConfigurationDelegateDelegateQueue(foundation.NSURLSessionConfiguration.defaultSessionConfiguration(), null, foundation.NSOperationQueue.mainQueue());
}

function imageViewLoadFromURL(imageView, path, completionHandler) {
    var url = foundation.NSURL.URLWithString(path);
    var session = getURLSession();
    var dataTask = session.dataTaskWithURLCompletionHandler(url, function(data, response, error) {
        if (error) {
            console.error(error.localizedDescription);
        } else {
            var image = uikit.UIImage.imageWithData(data);
            if (image) {
                imageView.image = image;
			}
        }

        if (completionHandler) {
            completionHandler(error);
        }
    });
    dataTask.resume();
    session.finishTasksAndInvalidate();
}

exports.getURLSession = getURLSession;
exports.imageViewLoadFromURL = imageViewLoadFromURL;
