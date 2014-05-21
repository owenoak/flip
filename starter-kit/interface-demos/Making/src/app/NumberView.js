define(function(require, exports, module) {
    var Surface           = require('famous/core/Surface');
    var Modifier          = require('famous/core/Modifier');
    var Transform         = require('famous/core/Transform');
    var View              = require('famous/core/View');
    var ContainerSurface  = require('famous/surfaces/ContainerSurface');
    var Timer             = require('famous/utilities/Timer');
    var Easing            = require('famous/transitions/Easing');

    function NumberView() {
        View.apply(this, arguments);
        _createIconNumber.call(this);
    }

    NumberView.prototype = Object.create(View.prototype);
    NumberView.prototype.constructor = NumberView;

    NumberView.DEFAULT_OPTIONS = {
        stripCount: 1
    };

    var rotateXAngle = _degToRad(-150),
            origin = [0, 0];

    function _degToRad(deg) {
        return deg * Math.PI / 180;
    };

    function _createIconNumber(){

        this.numberSurface = new Surface({
            size: [28,28],
            classes: ['numberText'],
            content: this.options.stripCount
        });

        this.numberModifier = new Modifier({
            origin: origin,
            opacity: 0,
            transform: Transform.translate(15, 10, 0),
        });

        this.numberRotateXModifier = new Modifier({
            transform: Transform.rotateX(rotateXAngle)
        }); 

        this._add(this.numberRotateXModifier).add(this.numberModifier).add(this.numberSurface);
    };

    NumberView.prototype.resetNumber = function(){
            var rotateXAngle = _degToRad(-150);
            this.numberModifier.setOpacity(0);
            this.numberRotateXModifier.setTransform(Transform.rotateX(rotateXAngle));
    };

    NumberView.prototype.animateNumber = function(stripCounter){

        this.numberSurface.setContent(stripCounter);

        var outwardAngle = _degToRad(10);

        Timer.setTimeout(function(){

            this.numberModifier.setOpacity(1, {
                duration: 1000,
                curve: Easing.outCubic
            });

            this.numberRotateXModifier.setTransform(Transform.rotateX(outwardAngle), {
                duration: 200,
                curve: Easing.outCubic
            }, function(){
                this.numberRotateXModifier.setTransform(Transform.rotateX(0), {
                    duration: 750,
                    curve: Easing.outElastic
                })
            }. bind(this));


        }.bind(this), 50);
            
    };

    module.exports = NumberView;
});