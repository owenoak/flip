define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');
    var StripView        = require('./StripView');
    var Easing           = require('famous/transitions/Easing');
    var BackgroundView   = require('./BackgroundView');

    function MenuView() {
        View.apply(this, arguments);

        this._eventInput.pipe(this._eventOutput);

        _createBackground.call(this);
        _createStripViews.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
        stripWidth: 320,
        stripHeight: 130,
        topOffset: 0,
        stripOffset: 130,
        active: true
    };

    function _createBackground(){
        this.backgroundView = new BackgroundView();
        this._add(this.backgroundView);
    };

    function _createStripViews(){

        this.stripViews = [];
        this.stripModifiers = [];

        var stripData = [
            {title: 'APPAREL', iconUrl: './img/apparel_icon.png', stripColor: '#00aaac', textTitle: './img/apparel_text.png'},
            {title: 'FOOTWEAR', iconUrl: './img/footwear_icon.png', stripColor: '#006a6d', textTitle: './img/footwear_text.png'},
            {title: 'ALL MATERIALS', iconUrl: './img/allMaterials_icon.png', stripColor: '#be326a', textTitle: './img/allMaterials_text.png'},
            {title: 'CHEMISTRY', iconUrl: './img/chemistry_icon.png', stripColor: '#32900e', textTitle: './img/chemistry_text.png'},
            {title: 'ENERGY/GREENHOUSE GAS', iconUrl: './img/energyGreenhouse_icon.png', stripColor: '#cc4300', textTitle: './img/energyGreenhouse_text.png'},
            {title: 'WATER/LAND', iconUrl: './img/waterLand_icon.png', stripColor: '#1a81b6', textTitle: './img/waterLand_text.png'},
            {title: 'PHYSICAL WASTE', iconUrl: './img/physicalWaste_icon.png', stripColor: '#ccb200', textTitle: './img/physicalWaste_text.png'},
            {title: 'RECYCLED', iconUrl: './img/recycled_icon.png', stripColor: '#7d0ea2', textTitle: './img/recycled_text.png'},
            {title: 'ORGANIC', iconUrl: './img/organic_icon.png', stripColor: '#6c00c7', textTitle: './img/organic_text.png'}
        ];

        for(var i = 0; i < stripData.length; i++){

            var stripView = new StripView({
                width: this.options.stripWidth,
                height: this.options.stripHeight,
                title: stripData[i].title,
                color: stripData[i].stripColor,
                iconUrl: stripData[i].iconUrl,
                textTitle: stripData[i].textTitle,
                index: i
            });

            this.stripViews.push(stripView);

            var yOffset = this.options.topOffset + this.options.stripOffset * i;

            var stripModifier = new Modifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.stripModifiers.push(stripModifier);
            this._add(stripModifier).add(stripView);

            stripView.pipe(this);
            stripView.on('tap', this.animateStrips.bind(this));

        };
    };

    MenuView.prototype.contractStrips = function(stripIndex){

        this.stripViews[stripIndex].contractBacking();
        this.stripViews[stripIndex].reverseAnimateIcon();
        this.stripViews[stripIndex].reverseAnimateText();

        for(var i = 0; i < this.stripModifiers.length; i++){

            this.stripViews[i].show();

            var yOffset = this.options.topOffset + this.options.stripOffset * i;

            this.stripModifiers[i].setTransform(
                Transform.translate(0, yOffset, i),{
                duration: 500,
                curve: Easing.outCubic
            }, function(){
                this.options.active = true;
            }.bind(this));
        }

    };

    MenuView.prototype.animateStrips = function(e){

        if(this.options.active == true){

            this.options.active = false;

            var stripIndex = e.index;
            var durationBase = 450;

            this.backgroundView.colorize(e.bgColor);
            this.stripViews[stripIndex].animateIcon();
            this.stripViews[stripIndex].animateText(stripIndex);

            for(var i = 0; i < this.stripModifiers.length; i++){

                if (i < stripIndex){
                    var yOffset = -this.options.stripHeight;
                    var duration = durationBase;
                    var z = i; 

                } else if (i > stripIndex) {
                    var yOffset = 548; 
                    var duration = durationBase;
                    var z = i;

                } else {
                    this.stripViews[i].expandBacking();
                    var yOffset = 0;
                    var duration = durationBase - 50;
                    var z = i;
                }

                //immediately set the z index based on direction
                this.stripModifiers[i].setTransform(
                    Transform.translate(0, this.options.topOffset + this.options.stripOffset * i, z));


                this.animationComplete = false;

                this.stripModifiers[i].setTransform(
                    Transform.translate(0, yOffset, z),{
                    duration: 500,
                    curve: Easing.outCubic
                }, function() {

                    //hide all un-selected strips, once...
                    if (!this.animationComplete) {
                        this.animationComplete = true;

                        for(var i = 0; i < this.stripModifiers.length; i++) {

                            if (i != stripIndex) {
                                this.stripViews[i].hide();
                            }

                        }
                    }

                }.bind(this));
            }

        };
      
    };

    module.exports = MenuView;

});