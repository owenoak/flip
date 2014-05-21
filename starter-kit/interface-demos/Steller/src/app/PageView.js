define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var VideoSurface = require('famous/surfaces/VideoSurface');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var View = require('famous/core/View');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    GenericSync.register({mouse: MouseSync});
    GenericSync.register({touch: TouchSync});

    function PageView() {
        View.apply(this, arguments);
        _createPage.call(this);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        last: false
    };

    function _createPage() {
        this.originMod = new Modifier({
            origin: [0, 0]
        });

        this.pageSurface = new Surface({
            size: [undefined, undefined],
            content: this.options.content,
            classes: ["page"],
            properties: {
                backgroundColor: '#111111',
                fontSize: '16px'
            }
        });

        var modifier = new Modifier({
            transform: Transform.rotateY(0)
        });

        this._add(this.originMod).add(this.pageSurface);

        this.position = 0;

        var sync = new GenericSync(['mouse', 'touch'], {
            direction: GenericSync.DIRECTION_X
        })

        this.pageSurface.pipe(sync);

        sync.on('start', function(data) {
            this.touchJustStarted = true;
        }.bind(this));

        sync.on('update', function(data) {
            var edge = window.innerWidth - (this.pageSurface.getSize()[0])

            if (this.touchJustStarted) {
                if (data.position >= 0 && data.velocity >= 0) {
                    this.rotatePrevious = true;
                } else {
                    this.rotatePrevious = false;
                }
                this.touchJustStarted = false;
            }

            if (!this.rotatePrevious) {
                if (data.position > edge) {
                    this.position = edge;
                } else if (data.position >= 0) {

                    this.position = 0;

                } else {
                    this.position = data.position;
                }

                // Converts position in pixels to degrees and then to radians. 
                var deg = (60 * Math.abs(this.position)) / window.innerWidth;
                var radians = -Math.floor(deg) * (Math.PI / 180); // Negative to flip forward
                this.rotate(radians);

            } else { // Previous Page Rotate
                this.position = data.position;

                var prevDeg = 120 - (180 * Math.abs(-data.position)) / window.innerWidth;
                var prevRadians = Math.floor(prevDeg) * (Math.PI / 180); // Negative to flip forward
                this._eventOutput.emit('rotatePrevious', {
                    radians: prevRadians
                });
            }
        }.bind(this));

        sync.on('end', function(data) {
            if (this.rotatePrevious) {
                this._eventOutput.emit('touchEndPrevious', data);
            } else {
                if (data.velocity.toFixed(2) < 0 && !this.options.last) {
                    this.turn();
                    this._eventOutput.emit('nextPage');
                } else {
                    this.turnBack();
                }
            }

            this.position = 0;
        }.bind(this));

        // End event for touchEndPrevious. @todo make this clearer.
        this.on('end', function(data) {
            if (data.velocity.toFixed(2) < 0 && !this.options.last) {
                this.turn();
                this._eventOutput.emit('nextPage');
            } else {
                this.turnBack();
            }

            this.position = 0;
        }.bind(this));
    }

    PageView.prototype.setZIndex = function(index) {
        this.pageSurface.setProperties({
            zIndex: index
        });
    }

    PageView.prototype.setDisplay = function(display) {
        this.pageSurface.setProperties({
            display: display
        });
    }

    PageView.prototype.rotate = function(radians) {
        this.originMod.setTransform(Transform.rotateY(radians));
    }

    PageView.prototype.turn = function() {
        this.originMod.setTransform(Transform.rotateY(-2), {
            duration: 500,
            curve: 'easeOut'
        });
    }

    /**
     * Page half jump animation for page that can't turn.
     * @return {[type]} [description]
     */
    PageView.prototype.hop = function() {
        this.originMod.setTransform(
            Transform.rotateY(-.3), {
                duration: 200,
                curve: 'easeOut'
            }, function() {
                this.originMod.setTransform(Transform.rotateY(0), {
                    duration: 300,
                    curve: 'easeOut'
                });
            }.bind(this));
    }

    PageView.prototype.turnBack = function() {
        this.originMod.setTransform(Transform.rotateY(0), {
            duration: 500,
            curve: 'easeOut'
        });

        this.position = 0;
    }

    module.exports = PageView;
});