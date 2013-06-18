var args = arguments[0] || {};

var options = null;

var initted = false;
var pulling = false;
var pulled = false;
var loading = false;

var offset = 0;

function doShow(msg) {
	
	if (!initted || pulled) {
		return false;
	}
	
	pulled = true;
	
    $.status.text = msg || options.msgUpdating;
    $.arrow.hide();
    $.activityIndicator.show();
    
    options.table.setContentInsets({top:options.offset}, {animated:true});
    return true;
}

function doHide() {
	
	if (!initted || !pulled) {
		return false;
	}
    
    options.table.setContentInsets({top:0}, {animated:true});
    
    $.activityIndicator.hide();
    $.arrow.transform = Ti.UI.create2DMatrix();
    $.arrow.show();
    $.status.text = options.msgPull;
    
   	pulled = false;
}

function setDate(date) {
	
	if (!initted) {
		return false;
	}
	
	if (date === false) {
		$.updated.hide();
	
	} else {
		$.updated.show();
	
		if (date !== true) {
			$.updated.text = String.format(options.msgUpdated, String.formatDate(date, 'short'), String.formatTime(date, 'short'));
		}
	}
}

function doTrigger() {
	
	if (!initted || loading) {
		return false;
	}
	
	loading = true;
	
	doShow();
	
	options.loader(finishLoading);
}

function finishLoading(success) {

    if (success) {
   		setDate(new Date());
   	}
    
    doHide();
    
    loading = false;
}

function scrollListener(e) {
    offset = e.contentOffset.y;
    
    if (pulled) {
    	return;
    }
    
    if (pulling && !loading && offset > -options.offset && offset < 0){
        pulling = false;
        var unrotate = Ti.UI.create2DMatrix();
        $.arrow.animate({transform:unrotate, duration:180});
        $.status.text = options.msgPull;
        
    } else if (!pulling && !loading && offset < -options.offset){
        pulling = true;
        var rotate = Ti.UI.create2DMatrix().rotate(180);
        $.arrow.animate({transform:rotate, duration:180});
        $.status.text = options.msgRelease;
    }
}

function dragEndListener(e) {
    if (!pulled && pulling && !loading && offset < -options.offset){
        pulling = false;
		doTrigger();
    }
}

function doInit(args) {
	if (initted || !OS_IOS) {
		return false;
	}

	options = _.defaults(args, {
		msgPull: 'Pull down to refresh...',
		msgRelease: 'Release to refresh...',
		msgUpdating: 'Updating...',
		msgUpdated: 'Last Updated: %s %s',
		offset:80,
		backgroundColor: '#e2e7ed',
		fontColor: '#576c89',
		image: WPATH('images/whiteArrow.png'),
		activityIndicatorStyle:Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
	});
	
	$.status.text = options.msgPull;

	//styling
	$.status.color = options.fontColor;
	$.updated.color = options.fontColor; 
	$.arrow.image = options.image;
	$.activityIndicator.style = options.activityIndicatorStyle;
	$.headerPullView.applyProperties({
		height: options.offset - 15,
		backgroundColor: options.backgroundColor
	});
	
	options.table.setHeaderPullView($.headerPullView);
	options.table.addEventListener('scroll', scrollListener);
	options.table.addEventListener('dragEnd', dragEndListener);
	
	
	//init
	initted = true;
}

function doRemove() {

	if (!initted) {
		return false;
	}

	options.table.setHeaderPullView(null);
	
	options.table.removeEventListener('scroll', scrollListener);
	options.table.removeEventListener('dragEnd', dragEndListener);
	
	options = null;
	
	initted = false;
	pulling = false;
	loading = false;
	shown = false;
	
	offset = 0;
}

if (args.table && args.loader) {
	doInit(args);
}

exports.init    = doInit;
exports.show    = doShow;
exports.hide    = doHide;
exports.date    = setDate;
exports.trigger = doTrigger;
exports.remove  = doRemove;
