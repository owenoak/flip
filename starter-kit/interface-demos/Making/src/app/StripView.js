define(function(require, exports, module) {
    var Surface   = require('famous/core/Surface');
    var Modifier  = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View      = require('famous/core/View');
    var Easing    = require('famous/transitions/Easing');

    function StripView() {
        View.apply(this, arguments);
        _createBacking.call(this);
        _createIcon.call(this);
        _createImageTitles.call(this);
        _setListeners.call(this);
    }

    StripView.prototype = Object.create(View.prototype);
    StripView.prototype.constructor = StripView;

    StripView.DEFAULT_OPTIONS = {
        width: null,
        height: null,
        title: null,
        iconUrl: null,
        textTitle: null
    };

    StripView.prototype.show = function() {
        this.backSurface.setProperties({visibility: 'visible'});
        this.iconSurface.setProperties({visibility: 'visible'});
    }

    StripView.prototype.hide = function() {
        this.backSurface.setProperties({visibility: 'hidden'});
        this.iconSurface.setProperties({visibility: 'hidden'});
    }

    function _createBacking(){

        this.backSurface = new Surface({
            size: [undefined, this.options.height],
            properties: {
                backgroundColor: this.options.color}
        });

        this.backingModifier = new Modifier({
            transform: Transform.translate(0, 0, 0)
        });

        this._add(this.backingModifier).add(this.backSurface);
    };

    function _createIcon(){
        this.iconSurface = new Surface({
            content: '<img width="146" src="' + this.options.iconUrl + '"/>',
            size: [146, 129]
        });

        var translateY = (this.options.height - 24) / 2;

        this.iconModifier = new Modifier({
            origin: [0.5, 0],
            transform: Transform.thenMove(
                Transform.scale(.2, .2, 0), 
                [0, translateY, 0]
            )
        });

        this._add(this.iconModifier).add(this.iconSurface);
    };

    function _createImageTitles(){

        this.imageTitleSurface = new Surface({
            content:'<img width="405" src="' + this.options.textTitle + '"/>',
            size: [405, 44]
        });

        var translateY = this.options.height + 500;

        this.imageTitleModifier = new Modifier({
            origin: [0.5, 0.5],
            opacity: 0,
            transform: Transform.thenMove(
                Transform.scale(.5, .5, 0), 
                [0, translateY, 0]
            )
        });

        this._add(this.imageTitleModifier).add(this.imageTitleSurface);
    };

    StripView.prototype.expandBacking = function(){
        this.backSurface.setSize([undefined, window.innerHeight]);
    };

    StripView.prototype.contractBacking = function(){
        this.backSurface.setSize([undefined, 130]);
    };

    StripView.prototype.animateIcon = function(){

        var transition = {duration: 500, curve: Easing.outCubic};    
        var scale = Transform.scale(.5, .5, 0); 

        this.iconModifier.setTransform(Transform.thenMove(scale, [0, 0, 0]), transition);
        this.iconModifier.setOrigin([0.5, 0.5], transition);
    };

    StripView.prototype.reverseAnimateIcon = function(){

        var translateY = (this.options.height - 24) / 2;
        var transition = {duration: 500, curve: Easing.outCubic};    
        var scale = Transform.scale(.2, .2, 0); 

        this.iconModifier.setTransform(Transform.thenMove(scale, [0, translateY, 0]), transition);
        this.iconModifier.setOrigin([0.5, 0], transition);
    };

    StripView.prototype.animateText = function(stripIndex){

        var transition = {duration: 500, curve: Easing.outCubic};    
        var scale = Transform.scale(.5, .5, 0); 
        var emitScope = this._eventOutput;

        this.imageTitleSurface.setProperties({
                visibility: 'visible'
        });

        this.imageTitleModifier.setTransform(Transform.thenMove(scale, [0, 60, 0]), transition, function(){
            
            var delay = setTimeout(unPause, 500);
            function unPause(){
                emitScope.emit('animationComplete', {index: stripIndex});
            };

        });

        this.imageTitleModifier.setOrigin([0.5, 0.5], transition);
        this.imageTitleModifier.setOpacity(1, {duration: 500, curve: Easing.outCubic});
    };

    StripView.prototype.reverseAnimateText = function(stripIndex){

        var transition = {duration: 500, curve: Easing.outCubic};    
        var translateY = this.options.height + 200;
        var scale = Transform.scale(.5, .5, 0); 
        this.imageTitleModifier.setOpacity(0, transition);

        this.imageTitleModifier.setTransform(Transform.thenMove(scale, [0, translateY, 0]), transition, function(){
            this.imageTitleSurface.setProperties({
                visibility: 'visible'
            })
        }.bind(this));

    };

    function _setListeners(){
        this.backSurface.on('click', handleStripTouchEnd.bind(this));
        this.iconSurface.on('click', handleStripTouchEnd.bind(this));


        function handleStripTouchEnd(){
            this._eventOutput.emit('tap', {index: this.options.index, bgColor: this.options.color});
        };
    };

    module.exports = StripView;
});