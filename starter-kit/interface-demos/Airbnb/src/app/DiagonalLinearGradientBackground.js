define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var CanvasSurface   = require('famous/surfaces/CanvasSurface');

    //Not using this for a view per se, but a generator of background surfaces

    function DiagonalLinearGradientBackground(options, colorStops) {
        View.apply(this, arguments);
        this._colorStops = colorStops;
        _createGradientSurface.call(this);
    }

    DiagonalLinearGradientBackground.prototype = Object.create(View.prototype);
    DiagonalLinearGradientBackground.prototype.constructor = DiagonalLinearGradientBackground;

    DiagonalLinearGradientBackground.DEFAULT_OPTIONS = {
        gradientSwapTransition: {
            duration: 1200,
            curve: 'linear'
        }
    };

    function _createGradientSurface() {
        var background = new CanvasSurface({
        	classes: ['backgroundSurface'],
            size: [window.innerWidth * 1.2, window.innerHeight * 1.2],
            canvasSize: [window.innerWidth * 1.2, window.innerHeight * 1.2]
        });

        var colorCanvas = background.getContext('2d');

        var gradient = colorCanvas.createLinearGradient(
            window.innerWidth * 1.2, //x0
            0,                     //y0
            0,                     //x1
            window.innerHeight * 1.2 //y1
        );

        for (var i = 0; i < this._colorStops.length; i++) {
            gradient.addColorStop(this._colorStops[i].position, this._colorStops[i].color);	
        }

        colorCanvas.fillStyle = gradient;
        colorCanvas.fillRect(0, 0, window.innerWidth * 1.2, window.innerHeight * 1.2);
        this._add(background);
    } 

    module.exports = DiagonalLinearGradientBackground;
});

