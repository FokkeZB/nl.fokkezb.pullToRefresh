var refreshControl;

$.refresh = refresh;
$.hide = hide;
$.show = show;
$.setPullText = setPullText;

var args = arguments[0] || {};

if (!_.isArray(args.children) || !_.contains(['Ti.UI.ListView', 'Ti.UI.TableView', 'de.marcelpociot.CollectionView'], args.children[0].apiName)) {
  console.error('[pullToRefresh] is missing required Ti.UI.ListView or Ti.UI.TableView or de.marcelpociot.CollectionView as first child element.');
}

var list = args.children[0];
var refreshText = args.refreshText ? args.refreshText : 'Loading';
var pullText = args.pullText ? args.pullText : 'Loading';

delete args.children;
delete args.refreshText;
delete args.pullText;

(function constructor(args) {

  if (!OS_IOS && !OS_ANDROID) {
    console.warn('[pullToRefresh] only supports iOS and Android.');
    return;
  }

  _.extend($, args);

    refreshControl = Ti.UI.createRefreshControl({
      title: createText(pullText, '#FFF'),
      tintColor: '#ededeb'
    });

    refreshControl.addEventListener('refreshstart', onRefreshstart);

    list.refreshControl = refreshControl;

    $.addTopLevelView(list);

})(args);

function refresh() {
  show();

  onRefreshstart();
}

function hide() {

    refreshControl.title = createText(pullText, '#FFF');
    refreshControl.endRefreshing();

}

function show() {
    refreshControl.beginRefreshing();
}

function onRefreshstart() {
    refreshControl.title = createText(refreshText, '#FFF');

  $.trigger('release', {
    source: $,
    hide: hide
  });

}

function createText(text, color) {
  return Ti.UI.createAttributedString({
    text: text,
    attributes: [
      {
        type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR ,
        value: color,
        range: [0, text.length]
      }
    ]
  });
}

function setPullText(text) {
  pullText = text;
}
