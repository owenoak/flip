define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function NavigationView() {
        View.apply(this, arguments);

        _createIcon.call(this);
    }

    NavigationView.prototype = Object.create(View.prototype);
    NavigationView.prototype.constructor = NavigationView;

    NavigationView.DEFAULT_OPTIONS = {
        width: null,
        height: null,
        iconUrl: null
    };

    function _createIcon() {
        var iconSurface = new Surface({
            content: '<img width="191" src="' + this.options.iconUrl + '"/>'
        });

        this._add(iconSurface);
    };

    module.exports = NavigationView;
});