define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function DeepView() {
        View.apply(this, arguments);
        _createBg.call(this);
        _createBackLink.call(this);
    }

    DeepView.prototype = Object.create(View.prototype);
    DeepView.prototype.constructor = DeepView;

    DeepView.DEFAULT_OPTIONS = {
        imgWidth: 320,
        imgHeight: 548
    };

    var bgImages = ['./img/deepSections/apparelDeep.png', './img/deepSections/footwearDeep.png', './img/deepSections/allMaterialsDeep.png', 
    './img/deepSections/chemistryDeep.png', './img/deepSections/energyDeep.png'];

    function _createBg(){

        this.bgSurface = new Surface({
            size: [this.options.imgWidth, this.options.imgHeight],
            content: '<img width="' + this.options.imgWidth + '" src="' + bgImages[0] + '"/>',
            properties: {visibility: 'hidden'}
        });

        this._add(this.bgSurface);

    };

    function _createBackLink(){

        this.backLink = new Surface({
            size: [60,30]
        });

        this.backLinkModifier = new Modifier({
            origin: [0,0],
            transform: Transform.translate(0, window.innerHeight-30, 0)
        });

        this._add(this.backLinkModifier).add(this.backLink);

        this.backLink.on('click', function(){
            this._eventOutput.emit('back');
        }.bind(this));
    };

    DeepView.prototype.show = function(deepIndex){
        this.bgSurface.setContent('<img width="320" src="' + bgImages[deepIndex] + '"/>');
        this.bgSurface.setProperties({visibility: 'visible'});
    };

    DeepView.prototype.hide = function(){
        this.bgSurface.setProperties({visibility: 'hidden'});
    };

    module.exports = DeepView;
});