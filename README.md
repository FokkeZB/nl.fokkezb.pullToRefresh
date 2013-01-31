**WANTED**: Help to make the widget Android and Mobile Web compatible

# PullToRefresh Widget
## Overview
The *PullToRefresh* widget is an [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) implementation of the [TableView Refresh with headerPullView](http://docs.appcelerator.com/titanium/latest/#!/guide/TableView_Refresh_with_headerPullView) found in the docs for [Titanium](http://www.appcelerator.com/platform) by [Appcelerator](http://www.appcelerator.com).

## Screenshot
![Pull to refresh](https://raw.github.com/FokkeZB/nl.fokkezb.pullToRefresh/master/app/widgets/nl.fokkezb.pullToRefresh/docs/screenshot.png)

## Features
* Initialize the widget through one simple call.
* Change (localize) any of the messages displayed.
* Localized date and time of last update.
* Manually trigger the widget, e.g. for first load.

## Future work
* Android and Mobile Web compatibility and testing.
* Localization of messages by the widget itself.
* Find out how to override the view/style from outside the widget.

## Quick Start
* Download the repository of the [widget as a ZIP file](https://github.com/FokkeZB/nl.fokkezb.pullToRefresh/archive/master.zip).
* Move the file to your project's root folder.
* Unzip the file and you'll find the widget under `app/widgets/nl.fokkezb.pullToRefresh`.
* Add the widget as a dependency to your `app/config.json` file like so:

```javascript
	"dependencies": {
		"nl.fokkezb.pullToRefresh":"1.1"
	}
```

* Attach the widget to any *Ti.UI.TableView*. Please note the change of *load* to *loader* as from 1.1. 

```javascript
var ptrCtrl = Alloy.createWidget('nl.fokkezb.pullToRefresh', null, {
	table: $.myTable,
	loader: myLoaderCallback
});
```

**or**

```javascript
var ptrCtrl = Alloy.createWidget('nl.fokkezb.pullToRefresh');
ptrCtrl.init({
	table: $.myTable,
	loader: myLoaderCallback
});
```

* As from 1.1 your *myLoaderCallback* gets passed a callback that should be called upon completion. If you pass *FALSE* when calling the callback, the *Last Updated* date will *NOT* be updated.

```javascript
function myLoaderCallback(widgetCallback) {
	// DO YOUR LOADING
	widgetCallback(true);
}
```

## Additonal parameters
The only required parameters are the `table` and `loader` parameters. You can change the displayed texts using the following additional ones:

| Parameter | Type | Default |
| --------- | ---- | ----------- |
| msgPull | `string` | Pull down to refresh... |
| msgRelease | `string`  | Release to refresh... |
| msgUpdating | `string` | Updating... |
| msgUpdated | `string` | Last Updated: %s %s |
| backgroundColor | `string` | #e2e7ed |
| fontColor | `string` | #576c89 |

## Addtional API functions
As from 1.1 you can also manually show and hide the view, update it's *Last Updated* date or trigger the complete cycle of the widget. Use this for example upon first load of the table or as long the table is empty.

| Function | Parameters | Usage |
| -------- | ---------- | ----- |
| init     | `Object`   | Initialize the widget (see Quick Start) | 
| trigger  |            | Manually trigger show > load > date > hide cycle 
| show     |            | Show the headerPullView |
| hide     |            | Hide the headerPullView |
| date     | `Date` or `FALSE` | Set the date of last update or FALSE to hide it |
| remove   |            | Undo the init |

## Changelog
* 1.2
  * Exposed color options
* 1.1
  * Exposed new API functions to show/hide the view, set the date and trigger the widget manually.
  * Renamed 'load' parameter to 'loader' in line with upcomming widgets.
* 1.0
  * Initial version