define(function(require, exports, module) {
	var Engine             = require('famous/core/Engine');
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');
    var ScrollView         = require('famous/views/Scrollview');
    var Scroller           = require('famous/views/Scroller');
    var GenericSync        = require('famous/inputs/GenericSync');
    var MouseSync          = require('famous/inputs/MouseSync');
    var TouchSync          = require('famous/inputs/TouchSync');
    var ViewSequence       = require('famous/core/ViewSequence');

    GenericSync.register({mouse: MouseSync});

    function ScrollViewWithRefresh(options) {
        View.apply(this, arguments);

        this.scrollView = new ScrollView();
        this.scrollView.sync = new GenericSync(['mouse', 'touch', 'scroll'], {direction: 1});
        this.scrollView._eventInput.pipe(this.scrollView.sync);
        this.scrollView.sync.pipe(this.scrollView._eventInput);

        this.refresher = null;
        this.renderables = null;

        _extendScrollViewEvents.call(this.scrollView);
        _pipeScrollViewEvents.call(this);
        _pipeDragEventsToScrollView.call(this);
    }

    ScrollViewWithRefresh.prototype = Object.create(View.prototype);
    ScrollViewWithRefresh.prototype.constructor = ScrollViewWithRefresh;

    ScrollViewWithRefresh.DEFAULT_OPTIONS = {};

    ScrollViewWithRefresh.prototype.sequenceFrom = function sequenceFrom(renderables) {
        this.renderables = renderables;
    	this._add(this.scrollView);
    //	this.scrollView.subscribe(this._eventOutput);
    };

    ScrollViewWithRefresh.prototype.setRefreshScene = function setRefreshScene(renderable) {
    	this.refresher = renderable;
    	this.renderables.unshift(this.refresher);
    	this.renderables = new ViewSequence({
    		index: 1,
    		array: this.renderables
    	});
    	this.scrollView.sequenceFrom(this.renderables);
    	this.refresher.on('collapseRefresher', function() {
    		this.collapseRefresh();
    	}.bind(this));
    };

    ScrollViewWithRefresh.prototype.setCallback = function setCallback(callback) {
    	if (!this.refresher) return;
    	this.refresher.on('completeRefresh', callback);
    };

    ScrollViewWithRefresh.prototype.collapseRefresh = function collapseRefresh() {
    	if (this.scrollView._node.index === 0 && this.scrollView.getPosition() < 98) {
    	    this.scrollView.goToNextPage();
    	}
    };

    function _extendScrollViewEvents() {
    	this._eventInput.on('update', function (event) {
            if (this._node.index <= 1) {
    		    this._eventOutput.emit('scrollmove', event);
            }
    	}.bind(this));

    	this._scroller.on('edgeHit', function (data) {
    		this._eventOutput.emit('edgeHit', this.getPosition());
    	}.bind(this));
    }

    function _pipeScrollViewEvents() {
        this.scrollView.on('scrollmove', function(event) {
        	this._eventOutput.emit('scrollmove', event);
        }.bind(this));

        this.scrollView.on('edgeHit', function(pagePosition) {
        	this._eventOutput.emit('edgeHit', pagePosition);
        }.bind(this));

        this.scrollView._eventInput.on('end', function(event) {
        	this._eventOutput.emit('scrollend', event);
        }.bind(this));
    }

    function _pipeDragEventsToScrollView() {
    	this.scrollView.subscribe(this._eventInput);
    }
    
    module.exports = ScrollViewWithRefresh;
});

