define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var ScrollView      = require('famous/views/Scrollview');
    var MouseSync       = require('famous/inputs/MouseSync');
    var GenericSync     = require('famous/inputs/GenericSync');

    function ModifiedScrollView(options, content) {
        View.apply(this, arguments);

        this._currentPage = 0;
        _addScrollView.call(this);
        _handleMenuListeners.call(this);
    }

    ModifiedScrollView.prototype = Object.create(View.prototype);
    ModifiedScrollView.prototype.constructor = ModifiedScrollView;

    ModifiedScrollView.DEFAULT_OPTIONS = {};

    ModifiedScrollView.prototype.sequenceFrom = function sequenceFrom(views) {
    	this._scrollView.sequenceFrom(views);
    	this._add(this._scrollView);
    };

    ModifiedScrollView.prototype.goToPreviousPage = function goToPreviousPage() {
    	if (this._currentPage === 0) return;
        this._eventOutput.emit('pageChange', {direction: -1});
        this._currentPage --;
    };

    ModifiedScrollView.prototype.goToNextPage = function goToNextPage() {
    	if (this._currentPage === 1) return;
    	this._eventOutput.emit('pageChange', {direction: 1});
    	this._currentPage ++;
    };
    
    ModifiedScrollView.prototype.render = function render() {
        _handlePagination.call(this);
    	return this._scrollView.render();
    };

    function _addScrollView() {
    	GenericSync.register(MouseSync);
    	this._sync = new GenericSync();
    	this._scrollView = new ScrollView(this.options);
    	this._eventInput.pipe(this._sync);
    	this._sync.pipe(this._scrollView);
    }

    function _handlePagination() {
        if (!this._scrollView._needsPaginationCheck) return;
        if (this._scrollView._touchCount) return;
        if (this._scrollView._springState === 1 /*SpringStates.EDGE*/) return;

        var velocity = this._scrollView.getVelocity();
        if (Math.abs(velocity) >= this._scrollView.options.pageStopSpeed) return;

        var position = this._scrollView.getPosition();
        var velocitySwitch = Math.abs(velocity) > this._scrollView.options.pageSwitchSpeed;

        // parameters to determine when to switch
        var nodeSize = window.innerHeight;
        var positionNext = position > 0.5 * nodeSize;
        var positionPrev = position < 0.5 * nodeSize;

        var velocityPrev = velocity < 0;
        var velocityNext = velocity > 0;

        if ((positionNext && !velocitySwitch) || (velocitySwitch && velocityNext)) {
        	this.goToNextPage();
        } 

        if ((positionPrev && !velocitySwitch) || (velocitySwitch && velocityPrev)) {
        	this.goToPreviousPage();
        }
    }

    function _handleMenuListeners() {
    	this._eventInput.pipe(this._scrollView);
    }

    module.exports = ModifiedScrollView;
});

