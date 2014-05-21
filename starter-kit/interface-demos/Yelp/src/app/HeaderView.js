define(function(require, exports, module) {
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');
    var ImageSurface       = require('famous/surfaces/ImageSurface');
    
    function HeaderView(options) {
        View.apply(this, arguments);
        _createBackgroundImage.call(this);
        _addTitle.call(this);
    }

    HeaderView.prototype = Object.create(View.prototype);
    HeaderView.prototype.constructor = HeaderView;

    HeaderView.DEFAULT_OPTIONS = {
        title: 'Nearby'
    };

    function _createBackgroundImage() {
    	this.backgroundImage = new ImageSurface(this.options);
    	this.backgroundImage.setContent('img/headerWithoutTitle.jpg');
    	this._add(this.backgroundImage);
    }

    function _addTitle() {
    	this.titleSurface = new Surface({
    		size: [undefined, true],
    		content: this.options.title,
    		classes: ['title'],
            properties: {
                textAlign: 'center',
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 500
            }
    	});
    	this.titleModifier = new Modifier({
    		origin: [0.5, 0.35]
    	});
    	this._add(this.titleModifier).add(this.titleSurface);
    }

    module.exports = HeaderView;
});
