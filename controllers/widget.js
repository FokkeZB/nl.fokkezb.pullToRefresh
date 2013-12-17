var args = arguments[0] || {};

var options = {
	msgPull: L('ptrPull', 'Pull to refresh...'),
	msgRelease: L('ptrRelease', 'Release to refresh...'),
	msgUpdating: L('ptrUpating', 'Updating...'),
	top: 0
};

var height = 50,
	attached = false,
	hidden = true,
	pulling = false,
	pulled = false,
	loading = false,
	offset = 0;

// delete special args
delete args.__parentSymbol;
delete args.__itemTemplate;
delete args.$model;

// set args as options
setOptions(args);

// Not in all Alloy versions (1.3.0-cr)
if (__parentSymbol) {
	init();
}

function show(msg) {

	if (!attached || pulled) {
		return false;
	}

	pulled = true;
	hidden = false;

	$.view.ptrText.text = msg || options.msgUpdating;
	$.view.ptrArrow.opacity = 0;
	$.view.ptrIndicator.show();
	$.view.prtCenter.show();

	if (OS_IOS) {

		__parentSymbol.setContentInsets({
			top: options.top + height
		}, {
			animated: true
		});

	} else {
		__parentSymbol.animate({
			top: 0
		});
	}

	return true;
}

function hide() {

	if (!attached || !pulled) {
		return false;
	}

	$.view.ptrIndicator.hide();
	$.view.ptrArrow.transform = Ti.UI.create2DMatrix();
	$.view.ptrArrow.opacity = 1;
	$.view.ptrText.text = options.msgPull;

	if (OS_IOS) {

		__parentSymbol.setContentInsets({
			top: options.top
		}, {
			animated: true,
			duration: 250
		});

	} else {
		__parentSymbol.animate({
			top: 0 - height,
			duration: 250
		});
	}

	setTimeout(function () {
		$.view.prtCenter.hide();
	}, 250);

	hidden = true;
	pulled = false;
	loading = false;

	return true;
}

function refresh() {

	if (!attached || loading) {
		return false;
	}

	loading = true;

	show();

	$.trigger('release', {
		hide: hide
	});

	return true;
}

function scrollListener(e) {

	if (typeof(e.contentOffset) === 'undefined') {
		return;
	}

	if (OS_IOS) {

		if (pulled) {
			return;
		}

		offset = e.contentOffset.y;

		if (offset >= 0 - options.top) {

			if (!hidden) {
				$.view.prtCenter.hide();
				hidden = true;
			}

		} else if (hidden) {
			$.view.prtCenter.show();
			hidden = false;
		}

		if (pulling && !loading && offset > 0 - options.top - height) {
			pulling = false;
			var unrotate = Ti.UI.create2DMatrix();
			$.view.ptrArrow.animate({
				transform: unrotate,
				duration: 180
			});
			$.view.ptrText.text = options.msgPull;

		} else if (!pulling && !loading && offset <= 0 - options.top - height) {
			pulling = true;
			var rotate = Ti.UI.create2DMatrix().rotate(180);
			$.view.ptrArrow.animate({
				transform: rotate,
				duration: 180
			});
			$.view.ptrText.text = options.msgRelease;
		}

	} else {
		offset = e.firstVisibleItem;
	}

	return;
}

function dragEndListener(e) {

	if (!pulled && pulling && !loading && offset <= 0 - options.top - height) {
		pulling = false;

		refresh();
	}

	return;
}

function swipeListener(e) {

	if (offset === 0 && e.direction === 'down') {
		refresh();
	}

	return;
}

function setOptions(_options) {
	_.extend(options, _options);

	return;
}

function attach() {

	if (attached) {
		return false;
	}

	if (OS_IOS) {
		__parentSymbol.headerPullView = $.view.ptr;
	}

	init();

	return true;
}

function init(_table) {

	// Override __parentSymbol
	if (_table) {
		__parentSymbol = _table;
	}

	__parentSymbol.addEventListener('scroll', scrollListener);

	height = $.view.ptr.height;
	attached = true;
	pulling = false;
	pulled = false;
	loading = false;

	offset = 0;

	if (OS_IOS) {
		__parentSymbol.addEventListener('dragEnd', dragEndListener);

	} else {
		__parentSymbol.top = 0 - height;

		__parentSymbol.addEventListener('swipe', swipeListener);
	}

	$.view.ptrText.text = options.msgPull;

	return;
}

function dettach() {

	if (!attached) {
		return false;
	}

	__parentSymbol.removeEventListener('scroll', scrollListener);

	if (OS_IOS) {
		__parentSymbol.removeEventListener('dragEnd', dragEndListener);

		__parentSymbol.headerPullView = null;

	} else {
		__parentSymbol.removeEventListener('swipe', swipeListener);

		hide();
	}

	attached = false;

	return true;
}

exports.setOptions = setOptions;
exports.show = show;
exports.hide = hide;
exports.refresh = refresh;
exports.dettach = dettach;
exports.attach = attach;
exports.init = init;
