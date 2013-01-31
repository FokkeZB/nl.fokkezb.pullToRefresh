var CONFIG = arguments[0] || {};

var options = null;
var initted = false;
var pulling = false;
var pulled = false;
var loading = false;
var offset = 0;

exports.init = function(_params) {
	if(initted) {
		return false;
	}

	options = _.defaults(_params, {
		msgPull: "Pull down to refresh...",
		msgRelease: "Release to refresh...",
		msgUpdating: "Updating...",
		msgUpdated: "Last Updated: %s %s",
		backgroundColor: "#e2e7ed",
		fontColor: "#576c89",
		image: WPATH("images/arrow.png"),
		indicator: "PLAIN"
	});

	$.headerPullView.backgroundColor = options.backgroundColor;
	$.status.color = options.fontColor;
	$.updated.color = options.fontColor;
	$.arrow.image = options.image;
	
	switch(options.indicator.toLowerCase()) {
		case "plain":
			$.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
			break;
		case "dark":
			$.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
			break;
	}

	options.table.setHeaderPullView($.headerPullView);

	options.table.addEventListener("scroll", scrollListener);
	options.table.addEventListener("dragEnd", dragEndListener);
};

exports.date = function(_date) {
	if(_date === false) {
		$.updated.hide();
	} else {
		$.updated.show();

		if(_date !== true) {
			$.updated.text = String.format(options.msgUpdated, String.formatDate(_date, "short"), String.formatTime(_date, "short"));
		}
	}
};

exports.show = function(_message) {
	if(pulled) {
		return false;
	}

	pulled = true;

	$.status.text = _message || options.msgUpdating;
	
	$.arrow.hide();
	$.activityIndicator.show();

	options.table.setContentInsets(
		{ top: 80 },
		{ animated: true }
	);

	return true;
};

exports.hide = function() {
	if(!pulled) {
		return false;
	}

	options.table.setContentInsets(
		{ top: 0 },
		{ animated: true }
	);

	$.activityIndicator.hide();
	$.arrow.transform = Ti.UI.create2DMatrix();
	$.arrow.show();
	
	$.status.text = options.msgPull;

	pulled = false;
};

exports.trigger = function() {
	if(loading) {
		return false;
	}

	loading = true;

	exports.show();

	options.refresh(finishLoading);
};

exports.remove = function() {
	if(!initted) {
		return false;
	}

	options.table.setHeaderPullView(null);

	options.table.removeEventListener("scroll", scrollListener);
	options.table.removeEventListener("dragEnd", dragEndListener);

	options = null;
	initted = false;
	pulling = false;
	loading = false;
	shown = false;
	offset = 0;
};

function finishLoading(_update) {
	if(_update) {
		exports.date(new Date());
	}

	exports.hide();

	loading = false;
}

function scrollListener(_event) {
	offset = _event.contentOffset.y;

	if(pulled) {
		return;
	}

	if(pulling && !loading && offset > -80 && offset < 0) {
		pulling = false;
		
		var unrotate = Ti.UI.create2DMatrix();
		
		$.arrow.animate({
			transform: unrotate,
			duration: 180
		});
		
		$.status.text = options.msgPull;
	} else if(!pulling && !loading && offset < -80) {
		pulling = true;
		
		var rotate = Ti.UI.create2DMatrix().rotate(180);
		
		$.arrow.animate({
			transform: rotate,
			duration: 180
		});
		
		$.status.text = options.msgRelease;
	}
}

function dragEndListener(_event) {
	if(!pulled && pulling && !loading && offset < -80) {
		pulling = false;

		exports.trigger();
	}
}

if(CONFIG.table && CONFIG.refresh) {
	exports.init(CONFIG);
}