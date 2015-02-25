var uikit = require('UIKit');
var foundation = require('Foundation');
var utils = require('./Utils');

var dateFormatter = new foundation.NSDateFormatter();
dateFormatter.locale = foundation.NSLocale.currentLocale();
//dateFormatter.dateStyle = NSDateFormatterStyle.NSDateFormatterShortStyle;
//dateFormatter.timeStyle = NSDateFormatterStyle.NSDateFormatterShortStyle;
dateFormatter.doesRelativeDateFormatting = true;

var JSMasterViewController = uikit.UITableViewController.extend({
    viewDidLoad: function() {
        uikit.UITableViewController.prototype.viewDidLoad.call(this);

        this.items = [];

        this.refreshControl = new uikit.UIRefreshControl();
        this.refreshControl.addTargetActionForControlEvents(this, "loadData", uikit.UIControlEvents.UIControlEventValueChanged);
        this.refreshControl.beginRefreshing();

        this.loadData();
    },
    "aboutPressed:": function(sender) {
        var alertWindow = new uikit.UIAlertView();
        alertWindow.title = "About";
        alertWindow.message = "2014 Just Decompile Team";
        alertWindow.addButtonWithTitle("OK");
        alertWindow.show();
    },
    numberOfSectionsInTableView: function(tableView) {
        return 1;
    },
    tableViewNumberOfRowsInSection: function(tableView, section) {
        return this.items.length;
    },
    prepareForSegueSender: function(segue, sender) {
        if (segue.identifier == "showDetail") {
            var item = this.items[this.tableView.indexPathForSelectedRow().row];
            segue.destinationViewController.item = item;
        } else if (segue.identifier == "showCanvas") {
            segue.destinationViewController.items = this.items;
        }
    },
    tableViewCellForRowAtIndexPath: function(tableView, indexPath) {
        //log('tableViewCellForRowAtIndexPath');
        var cell = tableView.dequeueReusableCellWithIdentifierForIndexPath("Cell", indexPath);

        var item = this.items[indexPath.row];

        var textLabel = cell.contentView.viewWithTag(1);
        textLabel.text = item["title"];

        var created = foundation.NSDate.dateWithTimeIntervalSince1970(item["created_utc"]);
        var detailTextLabel = cell.contentView.viewWithTag(2);
        detailTextLabel.text = dateFormatter.stringFromDate(created);

        var imageView = cell.contentView.viewWithTag(3);

        utils.imageViewLoadFromURL(imageView, item["thumbnail"]);
        return cell;
    },
	tableViewHeightForRowAtIndexPath: function(tableView, indexPath) {
		return 44;
	},
    loadData: function() {
        var urlSession = utils.getURLSession();
        var self = this;
        var dataTask = urlSession.dataTaskWithURLCompletionHandler(foundation.NSURL.URLWithString("http://www.reddit.com/r/aww.json?limit=500"), (function(data, response, error) {
            if (error) {
                console.error(error.localizedDescription);
            } else {
				var jsonString = foundation.NSString.alloc().initWithDataEncoding(data, foundation.NSUTF8StringEncoding).toString();
                var json = JSON.parse(jsonString);
                self.items = json.data.children.map(function(child) {
                    return child["data"];
                });
				
                self.tableView.reloadData();
            }
            __collect();
            self.refreshControl.endRefreshing();
        }));
        dataTask.resume();
        urlSession.finishTasksAndInvalidate();
    }
}, {
    name: "JSMasterViewController",
    exposedMethods: {
        "loadData": { returns: interop.types.void },
        "aboutPressed:": { returns: interop.types.void, params: [ uikit.UIControl ] }
    }
});
