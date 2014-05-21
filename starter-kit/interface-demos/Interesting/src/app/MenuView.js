define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var Timer           = require('famous/utilities/Timer');
    
    var NavigationView       = require('./NavigationView');

    function MenuView() {
        View.apply(this, arguments);
        
        _createBacking.call(this);
        _createNavigationViews.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;
    
    MenuView.prototype.resetNavItems = function() {
        for(var i = 0; i < this.navModifiers.length; i++) {
            var initX = -this.options.navWidth/4;
            var initY = this.options.topOffset + this.options.navItemOffset * i + this.options.navHeight * 2;
            
            this.navModifiers[i].setOpacity(0.0);
            this.navModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }
    };

    MenuView.prototype.animateNavItems = function() {
        this.resetNavItems();

        for(var i = 0; i < this.navModifiers.length; i++) {
            // use Timer.setTimeout instead of window.setTimeout
            // Time can be found in famous/utilities

            Timer.setTimeout(function(i) {
                var yOffset = this.options.topOffset + this.options.navItemOffset * i;

                this.navModifiers[i].setOpacity(1, { duration: this.options.duration, curve: 'easeOut' });
                this.navModifiers[i].setTransform(
                    Transform.translate( 0, yOffset, 0),
                    { duration: this.options.duration, curve: 'easeOut' });
            }.bind(this, i), i*this.options.staggerDelay);
        }
    };

    MenuView.DEFAULT_OPTIONS = {
        navWidth: 191,
        navHeight: 81,
        topOffset: 10,
        navItemOffset: 90,
        duration: 400,
        staggerDelay: 35
    };

    function _createBacking() {
        var backSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: 'rgb(25,24,26)'
            }
        });

        this._add(backSurface);
    }
    
    function _createNavigationViews() {
       this.navModifiers = [];

        var navData = [
            {iconUrl: 'img/nav-icons/design.png'},
            {iconUrl: 'img/nav-icons/news.png'},
            {iconUrl: 'img/nav-icons/entertainment.png'},
            {iconUrl: 'img/nav-icons/sports.png'},
            {iconUrl: 'img/nav-icons/dribble.png'},
            {iconUrl: 'img/nav-icons/reddit.png'},
        ];

        for(var i = 0; i < navData.length; i++) {
            var navView = new NavigationView({
                width: this.options.navWidth,
                height: this.options.navHeight,
                iconUrl: navData[i].iconUrl
            });

            var yOffset = this.options.topOffset + this.options.navItemOffset * i;

            var navModifier = new Modifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.navModifiers.push(navModifier);
            this._add(navModifier).add(navView);            
        }
    }

    module.exports = MenuView;
});
