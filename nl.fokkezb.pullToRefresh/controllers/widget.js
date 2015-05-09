var refreshControl;

$.refresh = refresh;

$.hide = hide;
$.show = show;

(function constructor(args) {

  if (!OS_IOS && !OS_ANDROID) {
    console.warn('[pullToRefresh] only supports iOS and Android.');
    return;
  }

  if (!_.isArray(args.children) || !_.contains(['Ti.UI.ListView', 'Ti.UI.TableView', 'de.marcelpociot.CollectionView'], args.children[0].apiName)) {
    console.error('[pullToRefresh] is missing required Ti.UI.ListView or Ti.UI.TableView or de.marcelpociot.CollectionView as first child element.');
    return;
  }

  var list = args.children[0];
  delete args.children;

  _.extend($, args);

  if (OS_IOS) {
    refreshControl = Ti.UI.createRefreshControl();

    if (_.has(args, 'title')) refreshControl.setTitle(args.title);
    if (_.has(args, 'tintColor')) refreshControl.setTintColor(args.tintColor);

    refreshControl.addEventListener('refreshstart', onRefreshstart);

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
  show();

  onRefreshstart();
}

function hide() {

  if (OS_IOS) {
    refreshControl.endRefreshing();

  } else if (OS_ANDROID) {
    refreshControl.setRefreshing(false);
  }
}

function show() {

  if (OS_IOS) {
    refreshControl.beginRefreshing();

  } else if (OS_ANDROID) {
    refreshControl.setRefreshing(true);
  }
}

function onRefreshstart() {

  $.trigger('release', {
    source: $,
    hide: hide
  });

}
