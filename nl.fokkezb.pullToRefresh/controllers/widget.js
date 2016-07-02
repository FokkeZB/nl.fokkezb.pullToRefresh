var refreshControl;
var list;

$.refresh = refresh;

$.show = show;
$.hide = hide;
$.setTitle = setTitle;
$.getList = getList;
$.getControl = getControl;

(function constructor(args) {

  if (!OS_IOS && !OS_ANDROID) {
    console.warn('[pullToRefresh] only supports iOS and Android.');

    if (_.isArray(args.children)) {
      _.map(args.children, $.addTopLevelView);
    }

    return;
  }

  if (!_.isArray(args.children) || !_.contains(['Titanium.UI.ListView', 'Titanium.UI.TableView', 'Ti.UI.ListView', 'Ti.UI.TableView', 'de.marcelpociot.CollectionView'], args.children[args.children.length-1].apiName)) {
    console.error('[pullToRefresh] is missing required Ti.UI.ListView or Ti.UI.TableView or de.marcelpociot.CollectionView as first child element.');
    return;
  }

  list = _.last(args.children);
  delete args.children;

  _.extend($, args);

  if (OS_IOS) {
    refreshControl = Ti.UI.createRefreshControl();

    if (_.has(args, 'title')) refreshControl.setTitle(args.title);
    if (_.has(args, 'tintColor')) refreshControl.setTintColor(args.tintColor);

    refreshControl.addEventListener('refreshstart', onRefreshstart);

    if (args.title) {
      setTitle(args.title);
    }

    list.refreshControl = refreshControl;

    $.addTopLevelView(list);

  } else if (OS_ANDROID) {
    refreshControl = require('com.rkam.swiperefreshlayout').createSwipeRefresh({
      view: list
    });

    refreshControl.addEventListener('refreshing', onRefreshstart);

    $.addTopLevelView(refreshControl);
  }

})(arguments[0] || {});

function refresh() {

  if (!list) {
    return;
  }

  show();

  onRefreshstart();
}

function hide() {

  if (!refreshControl) {
    return;
  }

  if (OS_IOS) {
    refreshControl.endRefreshing();

  } else if (OS_ANDROID) {
    refreshControl.setRefreshing(false);
  }
}

function show() {

  if (!refreshControl) {
    return;
  }

  if (OS_IOS) {
    refreshControl.beginRefreshing();

  } else if (OS_ANDROID) {
    refreshControl.setRefreshing(true);
  }
}

function setTitle(text){

  if (!refreshControl) {
    return;
  }

  if (OS_IOS) {

  	if (text.apiName && text.apiName == 'Ti.UI.AttributedString'){
  		refreshTitle = text;

  	} else {
  		refreshTitle = Ti.UI.createAttributedString({
      		text: text
    		});
  	}

  	refreshControl.title = refreshTitle;
  }
}

function getList() {
  return list;
}

function getControl() {
  return refreshControl;
}

function onRefreshstart() {

  $.trigger('release', {
    source: $,
    hide: hide
  });

}
