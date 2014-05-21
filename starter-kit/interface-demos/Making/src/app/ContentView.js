define(function(require, exports, module) {
    var Surface           = require('famous/core/Surface');
    var Modifier          = require('famous/core/Modifier');
    var Transform         = require('famous/core/Transform');
    var View              = require('famous/core/View');
    var ImageSurface      = require('famous/surfaces/ImageSurface');
    var ContainerSurface  = require('famous/surfaces/ContainerSurface');
    var InteriorStripView = require('./InteriorStripView');
    var Timer             = require('famous/utilities/Timer');
    var StripContentsView = require('./StripContentsView');
    var NumberView        = require('./NumberView');
    var DeepView          = require('./DeepView');  
    var Easing          = require('famous/transitions/Easing');

    function ContentView() {
        View.apply(this, arguments);
        this._eventInput.pipe(this._eventOutput);
        _createContent.call(this);
        _createDeepView.call(this);
        _createDeepLink.call(this);
        _setListeners.call(this);
    }

    ContentView.prototype = Object.create(View.prototype);
    ContentView.prototype.constructor = ContentView;

    ContentView.DEFAULT_OPTIONS = {
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
        bgUrl: './img/content_bg.png',
        headerImage: './img/header_strip.png',
        staggerDelay: 50,
        numStrips: 10,
        topOffset: 32,
        topIconOffset: 50,
        stripOffset: 64,
        xOffset: 0,
        yOffset: null
    };

    var headerTitles = ['APPAREL MATERIALS', 'FOOTWEAR MATERIALS', 'ALL MATERIALS', 'RANKED BY CHEMISTRY', 
        'RANKED BY ENERGY/GREENHOUSE GAS (GHG)'];

    function _createContent(){

        //strip container...

        this.containerSurface = new ContainerSurface({
            size: [this.options.containerWidth, this.options.containerHeight]
        });

        this.containerSurface.context.setPerspective(150);
        this.containerModifier = new Modifier();
        this._add(this.containerModifier).add(this.containerSurface);

        //strip content container...
        this.contentContainerSurface = new ContainerSurface({
            size: [this.options.containerWidth, this.options.containerHeight]
        });

        this.contentContainerSurface.context.setPerspective(150);
        this.contentContainerModifier = new Modifier();
        this._add(this.contentContainerModifier).add(this.contentContainerSurface);

        //strip number container...

        this.numberContainerSurface = new ContainerSurface({
            size: [this.options.containerWidth, this.options.containerHeight]
        });

        this.numberContainerSurface.context.setPerspective(150);
        this.numberContainerModifier = new Modifier();
        this._add(this.numberContainerSurface).add(this.numberContainerModifier);

        this.backgroundSurface = new ImageSurface({
            size: [undefined, undefined]
        });
        this.backgroundSurface.setContent(this.options.bgUrl)

        this.backgroundModifier = new Modifier();

        this.containerSurface.add(this.backgroundModifier).add(this.backgroundSurface);

        //interior strips...

        this.stripModifiers = [];
        this.interiorStrips = [];

        this.contentsModifiers = [];
        this.contentsViews = [];

        this.numberModifiers = [];
        this.numberViews = [];

        for(var i = 0; i < this.options.numStrips; i++) {

             var interiorStripView = new InteriorStripView();
             var stripContentsView = new StripContentsView();
             var numberView = new NumberView();
 
             this.options.yOffset = this.options.topOffset + this.options.stripOffset * i;
             var iconYOffset = this.options.topIconOffset + this.options.stripOffset * i;
 
             var stripModifier = new Modifier({
                 transform: Transform.translate(this.options.xOffset, this.options.yOffset, 0)
             });
             var stripContentsModifier = new Modifier({
                transform: Transform.translate(10, iconYOffset, 0)
             });
             var numberModifier = new Modifier({
                transform: Transform.translate(10, iconYOffset, 0)
             });
                
             this.options.xOffset -= Math.floor((Math.random()*30)+1);;
                
             this.stripModifiers.push(stripModifier);
             this.interiorStrips.push(interiorStripView);
             this.containerSurface.add(stripModifier).add(interiorStripView);   

             this.contentsModifiers.push(stripContentsModifier);
             this.contentsViews.push(stripContentsView); 
             this.contentContainerSurface.add(stripContentsModifier).add(stripContentsView);

             this.numberModifiers.push(numberModifier);
             this.numberViews.push(numberView); 
             this.numberContainerSurface.add(numberModifier).add(numberView);
        };

        //header shadow...

        this.headerBgSurface = new Surface({
            size: [undefined, 32],
            classes: ['shadow'],
            properties: {
                backgroundColor: 'black'
            }
        });

        this.headerBgModifier = new Modifier({
            transform: Transform.translate(-40, 0, 0)
        });

        this._add(this.headerBgModifier).add(this.headerBgSurface);

        //header bar...
        this.headerSurface = new ImageSurface({
            size: [undefined, 32]
        });
        this.headerSurface.setContent(this.options.headerImage);

        this.headerModifier = new Modifier();

        this._add(this.headerModifier).add(this.headerSurface);

        //header title...

        this.headerTitle = new Surface({
            size: [300,50],
            classes: ['numberText'],
            content: headerTitles[0]
        });

        this.headerTitleModifier = new Modifier({
            origin: [0,0],
            transform: Transform.translate(65, 11, 0)
        });

        this._add(this.headerTitleModifier).add(this.headerTitle);

    };

    ContentView.prototype.setHeaderText = function(sectionIndex){
        this.headerTitle.setContent(headerTitles[sectionIndex]);
    };

    ContentView.prototype.animateInteriorStrips = function(stripIndex){

        for(var i = 0; i < this.interiorStrips.length; i++){

            var contentIndex = 0;
            var stripCounter = 1;

            Timer.setTimeout(function(i) {
                    this.interiorStrips[i].animateStrip(stripIndex);
                    this.contentsViews[i].animateContent(stripIndex, contentIndex);
                    this.numberViews[i].animateNumber(stripCounter);
                    contentIndex++;
                    stripCounter++;
            }.bind(this, i), i * this.options.staggerDelay);
        }

    };

    function _createDeepView(){

        this.deepView = new DeepView();

        this.deepView.pipe(this);

        this.deepViewModifier = new Modifier({
            origin: [0,0],
            transform: Transform.translate(0, -548, 0)
        });

        this._add(this.deepViewModifier).add(this.deepView);
    };

    function _createDeepLink(){

        this.deepLink = new Surface({
            size: [30,30]
        });

        this.deepLinkModifier = new Modifier({
            origin: [0,0],
            transform: Transform.translate(window.innerWidth-30, 0, 0)
        });

        this._add(this.deepLinkModifier).add(this.deepLink);

        this.deepLink.on('click', this.animateDeepSectionIn.bind(this));
    };

    ContentView.prototype.animateDeepSectionIn = function(){
        this._eventOutput.emit('deep');
    };

    ContentView.prototype.setDeepSection = function(index){
        this.deepView.show(index);
    };
    
    ContentView.prototype.hideDeep = function(){
        this.deepView.hide();
    };
    
    ContentView.prototype.resetInteriorStripPlacement = function(){

        this.options.xOffset = 0;

        for(var i = 0; i < this.interiorStrips.length; i++){

            this.options.xOffset -= Math.floor((Math.random()*30)+1);
            this.options.yOffset = this.options.topOffset + this.options.stripOffset * i;

            this.stripModifiers[i].setTransform(Transform.translate(this.options.xOffset,this.options.yOffset,0));
        }
    };

    ContentView.prototype.resetInteriorStrips = function(){

        for(var i = 0; i < this.interiorStrips.length; i++){
            this.interiorStrips[i].resetStrip();
            this.contentsViews[i].resetContent();
            this.numberViews[i].resetNumber();
        }
        this.resetInteriorStripPlacement();
    };

    function _setListeners(){
        this.headerSurface.on('click', function(){
            this._eventOutput.emit('reverseAnimation', {index: this.options.index});
            this.hideDeep();
        }.bind(this))
    };

    module.exports = ContentView;
});