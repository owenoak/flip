define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var TouchSync       = require('famous/inputs/TouchSync');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var Lightbox        = require('famous/views/Lightbox');

    function CoverView(options, imagePath) {
        View.apply(this, arguments);
        this.imagePath = imagePath;
        _createBackgroundSurface.call(this);
    }

    CoverView.prototype = Object.create(View.prototype);
    CoverView.prototype.constructor = CoverView;

    CoverView.DEFAULT_OPTIONS = {};

    function _createBackgroundSurface() {
    	var backgroundSurface;
    	backgroundSurface = new ImageSurface();
        backgroundSurface.setContent('img/' + this.imagePath);
        backgroundSurface.on('click', function() {
        	this._eventOutput.emit('togglePage');
        }.bind(this));	
        this._add(backgroundSurface);
    }

    module.exports = CoverView;
});

