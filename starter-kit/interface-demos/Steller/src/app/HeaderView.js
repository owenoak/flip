define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier     = require('famous/core/Modifier');
    var Transform    = require('famous/core/Transform');
    var View         = require('famous/core/View');

    function HeaderView() {
        View.apply(this, arguments);
        _createHeader.call(this);
    }

    HeaderView.prototype = Object.create(View.prototype);
    HeaderView.prototype.constructor = HeaderView;

    HeaderView.DEFAULT_OPTIONS = {};

    function _createHeader() {
        var headerSurface = new ImageSurface({
            size: [undefined, Math.floor((window.innerWidth * 88) / 640)],
            content: "Header",
            classes: ["header"],
            properties: {
                backgroundColor: 'black',
                fontSize: '16px'
            }
        });

        headerSurface.setContent('img/steller-header.png');

        // A transform is an object that modifies any renderables it precedes
        // by changing its origin, opacity, or size.
        var modifier = new Modifier({
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });

        headerSurface.pipe(this._eventOutput);

        this.add(modifier).add(headerSurface);
    }

    module.exports = HeaderView;
});