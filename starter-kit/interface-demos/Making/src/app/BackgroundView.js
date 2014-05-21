define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function BackgroundView() {
        View.apply(this, arguments);
        _createBackground.call(this);
    };

    BackgroundView.prototype = Object.create(View.prototype);
    BackgroundView.prototype.constructor = BackgroundView;

    function _createBackground(){

        this.backgroundSurface = new Surface({
            size: [this.options.bgWidth, this.options.bgHeight],
            properties: { backgroundColor: this.options.bgColor}
        });

        this.backgroundModifier = new Modifier();

        this._add(this.backgroundModifier).add(this.backgroundSurface);
    };

    BackgroundView.prototype.colorize = function(bgColor){
        this.backgroundSurface.setProperties({
            backgroundColor: bgColor
          });
    };

    BackgroundView.DEFAULT_OPTIONS = {
        bgWidth: window.innerWidth,
        bgHeight: window.innerHeight,
        bgColor: '#be326a'
    };

    module.exports = BackgroundView;
});