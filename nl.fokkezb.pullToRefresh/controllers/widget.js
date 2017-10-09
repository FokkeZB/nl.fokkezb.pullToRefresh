var refreshControl;
var list;

$.refresh = refresh;

$.show = show;
$.hide = hide;
$.getList = getList;
$.getControl = getControl;

(function constructor(args) {

  if (args.dontInit || (!OS_IOS && !OS_ANDROID)){
    if (!args.dontInit) console.warn('[pullToRefresh] only supports iOS and Android.');

    if (_.isArray(args.children)) {
      _.map(args.children, $.addTopLevelView);
    }

    return;
  }

  if (!_.isArray(args.children) || !_.contains(['Titanium.UI.ListView', 'Titanium.UI.TableView', 'Ti.UI.ListView', 'Ti.UI.TableView', 'de.marcelpociot.CollectionView', 'ti.collectionview'], args.children[args.children.length-1].apiName)) {
    console.error('[pullToRefresh] is missing required Ti.UI.ListView or Ti.UI.TableView or de.marcelpociot.CollectionView or ti.collectionview as first child element.');
    return;
  }

  list = _.last(args.children);
  delete args.children;

  _.extend($, args);

  if (OS_IOS) {
    refreshControl = Ti.UI.createRefreshControl(args);
    refreshControl.addEventListener('refreshstart', onRefreshstart);

    list.refreshControl = refreshControl;

    $.addTopLevelView(list);

  } else if (OS_ANDROID) {
    refreshControl = require('com.rkam.swiperefreshlayout').createSwipeRefresh(_.extend({
      view: list
    }, args));

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
