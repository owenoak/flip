define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function MenuBarView() {
        View.apply(this, arguments);

        _createMenu.call(this);
        _setListeners.call(this);
    }

    MenuBarView.prototype = Object.create(View.prototype);
    MenuBarView.prototype.constructor = MenuBarView;

    MenuBarView.DEFAULT_OPTIONS = {
        duration: 300
    };

    MenuBarView.prototype.animateIcon = function() {

        var paramOptions =  {duration: this.options.duration, curve: 'easeInOut'};

        //if filterViewSelected-- 
        //fade out menu icon, fade in X icon
        if(this.filterViewSelected) {
            this.filterIconMod.setOpacity(0, paramOptions);
            this.xIconMod.setOpacity(1, paramOptions);
            this.menuMod.setOpacity(0.9);
        } else {
            this.filterIconMod.setOpacity(1, paramOptions);
            this.xIconMod.setOpacity(0, paramOptions);
            this.menuMod.setOpacity(1);

        }
    };

    function _createMenu() {
        this.menuSurf = new Surface({
            size: [undefined, 44],
            properties: {
                backgroundColor: '#292929'
            }
        });
        this.menuMod = new Modifier({});

        //filter icon
        this.filterViewSelected = false;
        this.filterIconSurf = new Surface({
            size: [35,35],
            content: '<img width="35" src="./img/filter-icon.png"/>',
            properties: {
                padding: '5px'
            }
        });
        this.filterIconMod = new Modifier({
            opacity: 1
        });

        //x-icon
        this.xIconSurf = new Surface({
            size: [40,40],
            content: '<img width="40" src="./img/x-icon.png"/>',
            properties: {
                paddingTop: '0.4px',
                paddingLeft: '2.6px'
            },
        });
        this.xIconMod = new Modifier({
            opacity: 0
        });


        //title
        var titleSurf = new Surface({
            size: [140, 35],
            content: 'THINGLIST',
            properties: {
                fontFamily: 'Arial Narrow',
                fontSize: '24px',
                color: 'white',
                textAlign: 'center',
                paddingTop: '8px'

            }
        });
        var titleMod = new Modifier({
            origin: [0.5, 0]
        });

        //question icon
        var questionIconSurf = new Surface({
            size: [40,40],
            content: '<img width="40" src="./img/question-icon.png"/>',
            properties: {
                paddingTop: '2px',
                paddingRight: '50px'
            }
        });
        var questionIconMod = new Modifier({
            origin: [.99, 0]
        });


        this._add(this.menuMod).add(this.menuSurf);
        this._add(this.filterIconMod).add(this.filterIconSurf);
        this._add(this.xIconMod).add(this.xIconSurf);
        this._add(titleMod).add(titleSurf);
        this._add(questionIconMod).add(questionIconSurf);
    }

    function _handleClick() {

    }

    function _setListeners() {
        this.xIconSurf.on('touchstart', function() {
            if(this.filterViewSelected) {
                this.xIconMod.setOpacity(0.4);
            }
        }.bind(this));

        this.xIconSurf.on('click', function() {
            if(this.filterViewSelected) { //display list view & filter-icon
                this.filterViewSelected = false;
                this.animateIcon();
            } else { //display filter view & x-icon
                this.filterViewSelected = true;
                this.animateIcon();
            }
            this._eventOutput.emit('filterViewToggle');
        }.bind(this));
    }

    module.exports = MenuBarView;
});