define(function(require, exports, module) {
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier     = require('famous/core/Modifier');
    var Transform    = require('famous/core/Transform');
    var View         = require('famous/core/View');

    function FooterView() {
        View.apply(this, arguments);
        _createFooter.call(this);
    }

    FooterView.prototype = Object.create(View.prototype);
    FooterView.prototype.constructor = FooterView;

    FooterView.DEFAULT_OPTIONS = {};

    function _createFooter() {
        var footerSurface = new ImageSurface({
            size: [undefined, Math.floor((window.innerWidth * 88) / 640)],
            content: "Footer",
            properties: {
                backgroundColor: 'black',
                fontSize: '16px'
            }
        });

        footerSurface.setContent('img/steller-footer.png');

        footerSurface.pipe(this._eventOutput);

        this.add(footerSurface);
    }

    module.exports = FooterView;
});