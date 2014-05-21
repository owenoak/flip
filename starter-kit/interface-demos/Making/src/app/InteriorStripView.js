define(function(require, exports, module) {
    var Surface           = require('famous/core/Surface');
    var Modifier          = require('famous/core/Modifier');
    var Transform         = require('famous/core/Transform');
    var View              = require('famous/core/View');
    var ContainerSurface  = require('famous/surfaces/ContainerSurface');
    var Easing            = require('famous/transitions/Easing');
    var Timer             = require('famous/utilities/Timer');

    function InteriorStripView() {
        View.apply(this, arguments);
        _createStrip.call(this);
    }

    InteriorStripView.prototype = Object.create(View.prototype);
    InteriorStripView.prototype.constructor = InteriorStripView;

    InteriorStripView.DEFAULT_OPTIONS = {};

    function _degToRad(deg) {
        return deg * Math.PI / 180;
    };

    var stripImages = ['./img/intStrips/apparelStrip.png', './img/intStrips/footwearStrip.png',
    './img/intStrips/allMaterialsStrip.png','./img/intStrips/chemistryStrip.png','./img/intStrips/energyStrip.png'];

    function _createStrip(){

        this.container = new ContainerSurface({
            size: [500, 65]
        });

        this.container.context.setPerspective(150);

        this.containerModifier = new Modifier();
        this._add(this.containerModifier).add(this.container);

        this.stripBgSurface = new Surface({
            size: [500, 65],
            content: '<img width="500" src="' + stripImages[0] + '"/>'
        });

        var rotateXAngle = _degToRad(-150),
            origin = [0, 0];

        this.stripModifier = new Modifier({
            origin: origin,
            opacity: 0,
            transform: Transform.translate(-200, 0, 0)
        });

        this.stripRotateXModifier = new Modifier({
            transform: Transform.rotateX(rotateXAngle)
        });       

        this.container.add(this.stripModifier).add(this.stripRotateXModifier).add(this.stripBgSurface);

    };

    InteriorStripView.prototype.resetStrip = function(){
            var rotateXAngle = _degToRad(-150);
            this.stripModifier.setOpacity(0);
            this.stripRotateXModifier.setTransform(Transform.rotateX(rotateXAngle));
    };
    
    InteriorStripView.prototype.animateStrip = function(stripIndex){

        this.stripBgSurface.setContent('<img width="500" src="' + stripImages[stripIndex] + '"/>');

        var outwardAngle = _degToRad(40);

        Timer.setTimeout(function(){

            this.stripModifier.setOpacity(1, {
                duration: 1000,
                curve: Easing.outCubic
            });
            
            this.stripRotateXModifier.setTransform(Transform.rotateX(outwardAngle), {
                duration: 200,
                curve: Easing.outCubic
            }, function(){
                this.stripRotateXModifier.setTransform(Transform.rotateX(0), {
                    duration: 750,
                    curve: Easing.outElastic
                })
            }. bind(this));

        }.bind(this), 50);
            
    };
    

    module.exports = InteriorStripView;
});