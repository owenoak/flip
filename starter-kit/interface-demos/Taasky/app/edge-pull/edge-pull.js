var View = require('famous/view');
var Transform = require('famous/transform');

function EdgePull(options) {
    View.apply(this, arguments);
    this._edgePositionGetter = null;
    this._state = 0;
}
EdgePull.prototype = Object.create(View.prototype);
EdgePull.prototype.constructor = EdgePull;

EdgePull.DEFAULT_OPTIONS = {
    size: [undefined, 200]
}

EdgePull.prototype.setEdgePositionGetter = function(callback) {
    this._edgePositionGetter = callback;
};

EdgePull.prototype.getSize = function() {
    return this.options.size; // do trig if outside scrollview
};

EdgePull.prototype.render = function(input) {
    var edgePosition = this._edgePositionGetter();
    var size = this.getSize();
    this._state = 1 - (edgePosition / this.options.size[1]);
    return {
        size: size,
        target: {
            transform: Transform.rotateX(Math.PI*0.5*this._state),
            origin: [0.5, 1],
            target: input
        }
    };
};

module.exports = EdgePull;
