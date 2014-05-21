define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var PageSwipe       = require('./PageSwipe');

    var PageView        = require('./Page');

    function App() {
        View.apply(this, arguments);
        this.pages = [];
        this.prevIndex = 0;

        _createPageViews.call(this);
        _addFacebookOverlay.call(this);
        _addEmailOverlay.call(this);
        _addTextOverlays.call(this);
        _addNavbar.call(this);
        _createDots.call(this);
        _pageSwipeEventHandler.call(this);
        this.pages[0].transition();
        this.dots[0].setProperties({background:'white'});
    }

    App.prototype = Object.create(View.prototype);
    App.prototype.constructor = App;

    App.DEFAULT_OPTIONS = {};

    var stories = {
        0:'An elegant personal activity tracker<br>you can wear anywhere.',
        1: 'Walk, cycle, swim or sleep,<br>Shine tracks your activity level.',
        2: 'Use the app to see activity trends and watch<br>yourself improve over time.',
        3: 'Crafted from solid aluminum,<br>Shine is ready for wherever life takes you.'
    };

    var images = [
        ['img/svelteMan', -0.4375 * window.innerWidth, -1.5 * window.innerWidth], 
        ['img/swimmer', 0 * window.innerWidth, -0.96875 * window.innerWidth], 
        ['img/soccerPlayer', -0.21875 * window.innerWidth, -0.984375 * window.innerWidth], 
        ['img/breakDancer', 0 * window.innerWidth, -0.6875 * window.innerWidth]
    ];

    function _createPageViews() {
        this.pageSwipe = new PageSwipe({
            direction: 'x',
            paginated: true
        });
        for (var i = 0; i < images.length; i++) {
            var pageView = new PageView(
            {
                backgroundUrl : images[i][0],
                start : images[i][1],
                end : images[i][2]
            }
            );
            this.pageSwipe.pipe(pageView);
            pageView.pipe(this.pageSwipe);
            this.pages.push(pageView);
        }
        this.pageSwipe.sequenceFrom(this.pages);
        this._add(this.pageSwipe);
    };

    function _addFacebookOverlay() {
        var facebook = new ImageSurface({
            size: [0.375 * window.innerWidth, 0.088 * window.innerHeight],
            properties: {
                borderRadius: '3px'
            }
        });
        facebook.setContent('img/facebook.png');
        var facebookModifier = new Modifier({
            transform: Transform.translate(0.53125 * window.innerWidth, 0.8275 * window.innerHeight, 0)
        });
        this._add(facebookModifier).add(facebook);
    };

    function _addEmailOverlay() {
        var email = new ImageSurface({
            size: [0.375 * window.innerWidth, 0.088 * window.innerHeight],
            properties: {
                borderRadius: '3px'
            }
        });
        email.setContent('img/email.png');
        var emailModifier = new Modifier({
            transform: Transform.translate(0.0875 * window.innerWidth, 0.8275 * window.innerHeight, 0)
        });
        this._add(emailModifier).add(email);
    };

    function _addTextOverlays() {
        this.shine = new Surface({
            size: [undefined, 0.035 * window.innerHeight],
            content: 'SHINE',
            properties: {
                fontFamily: '‘Trebuchet MS’, Helvetica, sans-serif',
                fontSize: '4em',
                color:'white',
                fontWeight: '500'
            }
        });
        this.shineModifier = new Modifier({
            transform: Transform.translate(0.025 * window.innerWidth, 0.0352 * window.innerHeight, 1)
        });
        
        var node = this._add(this.shineModifier).add(this.shine);

        var account = new Surface({
            size: [undefined, 0],
            content: 'Already have an account? <b>Sign in now.</b>',
            properties: {
                fontFamily: '‘Trebuchet MS’, Helvetica, sans-serif',
                fontSize: '0.8em',
                color:'white',
                textAlign: 'center'
            }
        });
        var accountModifier = new Modifier({
            transform: Transform.translate(0, 0.933 * window.innerHeight, 0)
        });
        this._add(accountModifier).add(account);

        this.text = new Surface({
            size: [undefined, 0],
            content: stories[0],
            properties: {
                fontFamily: '‘Trebuchet MS’, Helvetica, sans-serif',
                fontSize: '0.8em',
                color:'white',
                textAlign: 'center'
            }
        });
        this.textModifier = new Modifier({
            transform: Transform.translate(0, 0.722 * window.innerHeight, 0)
        });
        this._add(this.textModifier).add(this.text);
    };

    function _addNavbar() {
        var navbar = new Surface({
            content: '<img width="' + window.innerWidth + '" src="img/navbar.png"/>',
            size: [undefined, 0.0352]
            });
        var navbarModifier = new Modifier({
            transform: Transform.translate(0,0,3)
        });
    
        this._add(navbarModifier).add(navbar);
    };

    function _createDots() {
        this.dots = [];
        for (var i = 0; i < this.pages.length; i++) {
            var dot = new Surface({
                size: [0.025 * window.innerWidth, 0.0141 * window.innerHeight],
                properties:{
                    background: 'grey',
                    borderRadius: '4px'
                }
            });
            var dotModifier = new Modifier({
                transform: Transform.translate(0.391 * window.innerWidth + i * 0.0625 * window.innerWidth, 0.79045 * window.innerHeight, 10)
            });
            this._add(dotModifier).add(dot);
            window.dot = dot
            this.dots.push(dot);
        }
    };

    function _pageSwipeEventHandler() {
        this.pageSwipe._eventOutput.on('nextPage', _transitionBackground.bind(this));
        this.pageSwipe._eventOutput.on('prevPage', _transitionBackground.bind(this));
        this.pageSwipe._eventOutput.on('endPageTransition', _resetBackground.bind(this));
    };

    function _transitionBackground(index) {
        this.shineModifier.setTransform(Transform.translate((0.025 +  0.0625 * index) * window.innerWidth, 0.03521 * window.innerHeight, 1), {
            duration: 2000
        });
        this.dots[this.prevIndex].setProperties({background:'grey'});
        this.textModifier.setOpacity(0, 200, function(index) {
            this.text.setContent(stories[index]);
            this.textModifier.setOpacity(1, 200);
        }.bind(this, index));
        this.pages[index].transition();
        this.dots[index].setProperties({background:'white'});
    };

    function _resetBackground(index) {
        this.pages[this.prevIndex].resetTransition();
        this.prevIndex = index;
    };

    module.exports = App;
});