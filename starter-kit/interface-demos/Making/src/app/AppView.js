define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var MenuView        = require('./MenuView');
    var ContentView     = require('./ContentView');
    var Easing          = require('famous/transitions/Easing');

    function AppView() {
        View.apply(this, arguments);
        _createMenuView.call(this);
        _createContentView.call(this);
    };

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        screenHeight: window.innerHeight,
        index: 0,
        stripHeightOffset: 130
    };

    function _createMenuView(){
        this.menuView = new MenuView();
        this.menuView.on('animationComplete', this.animateContentIn.bind(this));
        this.menuModifier = new Modifier();

        this._add(this.menuModifier).add(this.menuView);
    };

    function _createContentView(){
        this.contentView = new ContentView();
        this.contentView.on('reverseAnimation', this.animateContentOut.bind(this));
        this.contentView.on('deep', this.animateDeepSectionIn.bind(this));
        this.contentView.on('back', this.animateDeepSectionOut.bind(this));        
        this.contentModifier = new Modifier({
            transform: Transform.translate(0, this.options.screenHeight, 50)
        });

        this._add(this.contentModifier).add(this.contentView);
    };

    AppView.prototype.animateContentIn = function(e){

        this.options.index = e.index;

        this.contentView.setHeaderText(this.options.index);

        this.menuModifier.setTransform(Transform.translate(0,-this.options.screenHeight, 0), {
            duration: 600,
            curve: Easing.outCubic
        });

        this.contentModifier.setTransform(Transform.translate(0,0,0), {
            duration: 400,
            curve: Easing.outCubic
        }, function(){
            this.contentView.animateInteriorStrips(this.options.index);

            var delay = setTimeout(unPause.bind(this), 500);

            function unPause(){
                this.contentView.setDeepSection(this.options.index);
            };

        }.bind(this));   
        
    };

    AppView.prototype.animateDeepSectionIn = function(){
        this.contentModifier.setTransform(Transform.translate(0, this.options.screenHeight, 0), {
            duration: 500,
            curve: Easing.outCubic
        });
    };

    AppView.prototype.animateDeepSectionOut = function(){

        this.contentModifier.setTransform(Transform.translate(0, 0, 0), {
            duration: 400,
            curve: Easing.outCubic
        });
    };

    AppView.prototype.animateContentOut = function(){

        this.menuModifier.setTransform(Transform.translate(0, 0, 0), {
            duration: 400,
            curve: Easing.outCubic
        });

        this.contentModifier.setTransform(Transform.translate(0,this.options.screenHeight,0), {
            duration: 400,
            curve: Easing.outCubic
        }, function(){

            var stripIndex = this.options.index;
            var delay = setTimeout(unPause.bind(this), 250);

            function unPause(){
                this.menuView.contractStrips(stripIndex);
                this.contentView.resetInteriorStrips();
            };

        }.bind(this)); 
        
    };

    module.exports = AppView;
});