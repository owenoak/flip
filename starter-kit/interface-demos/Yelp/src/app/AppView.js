define(function(require, exports, module) {
    var Surface               = require('famous/core/Surface');
    var Modifier              = require('famous/core/Modifier');
    var Transform             = require('famous/core/Transform');
    var View                  = require('famous/core/View');
    var HeaderFooter          = require('famous/views/HeaderFooterLayout');
    var ImageSurface          = require('famous/surfaces/ImageSurface');
    var ViewSequence          = require('famous/core/ViewSequence');

    var HeaderView            = require('./HeaderView');
    var RefresherView         = require('./RefresherView');
    var ScrollViewWithRefresh = require('./ScrollViewWithRefresh');
    
    function AppView() {
        View.apply(this, arguments);

        _createScrollViewWithRefresh.call(this);
        _createHeaderFooterLayout.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
    	headerSize: 98,
    	footerSize: 55,
    	refresherSize: 100,
    };

    function _createScrollViewWithRefresh() {

    	this.scrollViewWithRefresh = new ScrollViewWithRefresh(this.options);

    	var scrollViewImageSurfacePaths = [
    	    '1scroll.jpg',
    	    '2scroll.jpg',
    	    '3scroll.jpg'
    	];
    	var scrollViewImageLengths = [
    	    281,
    	    392,
    	    380
    	];

    	var IPHONE_HEIGHT_CONVERSION_COEFFICIENT = window.innerWidth * 0.003125; // innerWidth / 320

    	var scrollViewImageSurface;
    	var scrollViewImageSurfaces = [];

    	for (var i = 0; i < scrollViewImageSurfacePaths.length; i++) {
    		scrollViewImageSurface = new ImageSurface({
    			size: [undefined, IPHONE_HEIGHT_CONVERSION_COEFFICIENT * scrollViewImageLengths[i]]
            });
            scrollViewImageSurface.setContent('img/' + scrollViewImageSurfacePaths[i]);
            scrollViewImageSurface.pipe(this.scrollViewWithRefresh);
            scrollViewImageSurfaces.push(scrollViewImageSurface);
    	}

        var refresher = new RefresherView(this.options);

        this.scrollViewWithRefresh.pipe(refresher);
        this.scrollViewWithRefresh.on('scrollmove', function(event) {
        	refresher.handleScrollMove(event);
        }.bind(this));

        this.scrollViewWithRefresh.sequenceFrom(scrollViewImageSurfaces);
    	this.scrollViewWithRefresh.setRefreshScene(refresher);
    	// this.scrollViewWithRefresh.setCallback(function(data) { console.log(data.data); });
    }

    function _createHeaderFooterLayout() {
    	this.layout = new HeaderFooter(this.options);
    	this.layout.header = new HeaderView(this.options);
    	this.layout.content = this.scrollViewWithRefresh;
    	this.layout.footer = new ImageSurface(this.options);
    	this.layout.footer.setContent('img/footer.png');
    	this._add(this.layout);
    }

    module.exports = AppView;
});
