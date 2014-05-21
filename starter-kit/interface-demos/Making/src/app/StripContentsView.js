define(function(require, exports, module) {
    var Surface           = require('famous/core/Surface');
    var Modifier          = require('famous/core/Modifier');
    var Transform         = require('famous/core/Transform');
    var View              = require('famous/core/View');
    var ContainerSurface  = require('famous/surfaces/ContainerSurface');
    var Timer             = require('famous/utilities/Timer');
    var Easing            = require('famous/transitions/Easing');

    function StripContentsView() {
        View.apply(this, arguments);
        _createStripIcon.call(this);
        _createStripText.call(this);
    }

    StripContentsView.prototype = Object.create(View.prototype);
    StripContentsView.prototype.constructor = StripContentsView;

    StripContentsView.DEFAULT_OPTIONS = {
        stripCount: 1
    };

    var stripIcons = ['./img/intStrips/apparelIcon.png', './img/intStrips/footwearIcon.png', 
    './img/intStrips/allMaterialsIcon.png', './img/intStrips/chemistryIcon.png', './img/intStrips/energyIcon.png'];

    var stripText = ['Rubber, natural latex', 'Down', 'Polypropylene', 'Polyvinyl alcohol', 'Polyethylene foam',
    'Cardboard', 'EVA foam','Steel, carbon', 'Zinc', 'Polypropylene fabric'];


    var rotateXAngle = _degToRad(-150),
            origin = [0, 0];

    function _degToRad(deg) {
        return deg * Math.PI / 180;
    };

    function _createStripIcon(){

        this.stripIconSurface = new Surface({
            size: [34, 28],
            content: '<img width="34" src="' + stripIcons[0] + '"/>'
        });

        this.stripIconModifier = new Modifier({
            origin: [0,0],
            opacity: 0
        });   

        this.stripIconRotateXModifier = new Modifier({
            transform: Transform.rotateX(rotateXAngle)
        });   

        this._add(this.stripIconModifier).add(this.stripIconRotateXModifier).add(this.stripIconSurface);

    };

    function _createStripText(){

        this.textSurface = new Surface({
            size: [200, 28],
            classes: ['titleText'],
            content: 'Rubber, natural latex'
        });

        this.textSurfaceModifier = new Modifier({
            origin: [0,0],
            opacity: 0,
            transform: Transform.translate(43, 5, 0)
        });

        this.textSurfaceRotateXModifier = new Modifier({
            transform: Transform.rotateX(rotateXAngle)
        }); 

        this._add(this.textSurfaceModifier).add(this.textSurfaceRotateXModifier).add(this.textSurface);
    };

    StripContentsView.prototype.resetContent = function(){
            var rotateXAngle = _degToRad(-150);
            this.stripIconModifier.setOpacity(0);
            this.textSurfaceModifier.setOpacity(0);
            this.stripIconRotateXModifier.setTransform(Transform.rotateX(rotateXAngle));
            this.textSurfaceRotateXModifier.setTransform(Transform.rotateX(rotateXAngle));
    };

    StripContentsView.prototype.animateContent = function(stripIndex, contentIndex){

        this.stripIconSurface.setContent('<img width="34" src="' + stripIcons[stripIndex] + '"/>');
        this.textSurface.setContent(stripText[contentIndex]);

        var outwardAngle = _degToRad(10);

        Timer.setTimeout(function(){

            this.stripIconModifier.setOpacity(1, {
                duration: 1000,
                curve: Easing.outCubic
            });
            this.textSurfaceModifier.setOpacity(1, {
                duration: 1000,
                curve: Easing.outCubic
            });
            
            this.stripIconRotateXModifier.setTransform(Transform.rotateX(outwardAngle), {
                duration: 200,
                curve: Easing.outCubic
            }, function(){
                this.stripIconRotateXModifier.setTransform(Transform.rotateX(0), {
                    duration: 750,
                    curve: Easing.outElastic
                })
            }. bind(this));

            this.textSurfaceRotateXModifier.setTransform(Transform.rotateX(outwardAngle), {
                duration: 200,
                curve: Easing.outCubic
            }, function(){
                this.textSurfaceRotateXModifier.setTransform(Transform.rotateX(0), {
                    duration: 750,
                    curve: Easing.outElastic
                })
            }. bind(this));
    
        }.bind(this), 50);
            
    };

    module.exports = StripContentsView;
});