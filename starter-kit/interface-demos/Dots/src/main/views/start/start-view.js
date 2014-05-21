define(function(require, exports, module) {



    var Surface             = require('famous/core/Surface'),
        Modifier            = require('famous/core/Modifier'),
        Transform           = require('famous/core/Transform'),
        Easing              = require('famous/transitions/Easing'),
        Timer               = require('famous/utilities/Timer'),
        View                = require('main/helpers/view'),
        Helpers             = require('main/helpers/helpers'),
        _                   = require('main/vendor/underscore/lodash'),

        SplashView          = require('main/views/splash/splash-view'),
        SettingsView        = require('main/views/settings/settings-view'),
        MultiPlayerView     = require('main/views/multiplayer/multi-player-view'),
        AboutView           = require('main/views/about/about-view'),
        PlayView            = require('main/views/play/play-view'),
        ScoresView          = require('main/views/scores/scores-view');

        /*  -----------------------------------------------------------------------------------------

        Name:       StartView

                    This is the primary view that gets added to the appView. It acts as the manager
                    for all the other views and controls how they transition in and out of the
                    display area.


        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)


        Important:  The mainContainer has OVERFLOW set to hidden so that DOTS can be embedded in
                    another view (like a website or image of an iPhone) and still be expected to
                    be well behaved.

                    DISCUSS: Surfaces that frequently animate themselves that all have the same
                    zIndex (or no zIndex) and overlap on the display can cause the render engine
                    to thrash if they are contained in a view that is shown and hidden more than
                    once. The render engine seems to be much happier is you assign a zIndex or
                    do a Transform.translate(x,y,z) where z is your zIndex!

                    Unclear how the render nodes are managed and parsed in the famous engine to
                    build the DOM. It appears to assemble 'relative' elements (for what that term
                    is worth to famous since everything is absolutely positioned) in different
                    orders each time. Need to talk with Mark and Dave and get to the bottom of
                    what is happening.


        ---------------------------------------------------------------------------------------*/

    var StartView =  View.extend({

        // define famous surfaces
        //don't scale because this is a svg background so we can let css handle it
        surfaces: {
            background: {
                size: [Helpers.winWidth, Helpers.winHeight],
                modifier: {
                    origin: [0.5, 0.5],
                    opacity: 1,
                    transform: Transform.translate(0,0,-5)
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',
                },
 
            },
 
            mainContainer:{
                type: 'container',
                size: [320,548],
                scaled:true,
                modifier: {
                    origin: [0.5,0.5],
                    transform: Transform.translate(0,0,-3)
                },
                properties: {

                    overflow: 'hidden'
                }

            },

            //insert a transparent canvas into the background of mainContainer so we can add snow later
            /*
            snowCanvas: {
                type: 'canvas',
                size: [320,548],
                scaled: true,
                classes:['backcanvas'],
                putIn: 'mainContainer',
                modifier: {
                    origin: [0.5, .5],
                    transform: Transform.translate(0,0,-2)
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',
                },
            },
            */


        },

        events:{
            'show-settings splashView'              :'showSettings',
            'show-about splashView'                 :'showAbout',
            'show-scores splashView'                :'showScores',
            'show-multiPlayer splashView'           :'showMultiPlayer',

            'close-settings settingsView'           :'closeSettings',
            'close-multi-player multiPlayerView'    :'closeMultiPlayer',
            'close-about aboutView'                 :'closeAbout',
            'close-scores scoresView'               :'closeScores',
            'close-play playView'                   :'closePlay',

            'game-change splashView'                :'gameChange',
            'game-start splashView'                 :'gameStart',
            'snowing settingsView'                  :'snowMaker',
        },

        setListeners:function(){

        },

        createViews: function(){


            // DISCUSS: check with Valdman to see if the architecture was intended to use
            // one physics engine per app or if we can just instantiate and use PE as needed.

            // views must be created during initialize to use our event helper for events
            this.splashView         = new SplashView();
            this.settingsView       = new SettingsView();
            this.multiPlayerView    = new MultiPlayerView();
            this.aboutView          = new AboutView();
            this.scoresView         = new ScoresView();
            this.playView           = new PlayView();
            //this.snowView           = new SnowView();

        },

        initialize : function(){

           // startView will capture any window resize events and process as needed
            window.onresize = function(){this.onResize()}.bind(this);


            // Create all the primary views the application needs (we could also do
            // on an 'as needed' basis but these view are small and instantiate quickly
            // so we create them all at once.)
            this.createViews();


            //start out with a timed dots game
            this.gameType = 'timed';

        },

        onReady: function(){

            //set up any event listeners for surface actions like touch, click, touchmove, etc
            this.setListeners();


            // Create a main region that can be used to show and hides our views. To learn
            // more about regions read the comments in /helpers/regions.js
            this.createRegion('main');

            // Add the main region to the main container
            this.famous.surface.mainContainer.add(this.famous.region.main)


            // show the splashview by adding it to the main region - this gets the user interface
            // off and running. To follow the program flow goto views/splash/splash-view.js
            this.famous.region.main.show(this.splashView);

        },

        gameChange: function(game){
            // the user changed the type of game. The event chain started in views/splash/game-play-view
            // and was relayed on to us the splashView
            this.gameType = game;
        },

        gameStart: function(game){
            // the user wants to start the game. The event started in /app/views/splash/game-play-view
            // and was relaayed on to us by the splashView
            this.showPlay();

        },

        snowMaker:function(snowing){

            //tell appView to make it start or stop snowing!
            //this.broadcast('snowing', snowing);


            var opacity     = (snowing ==='start')? 0: 1,
                duration    = 300;

            this.makeTransparent(opacity, duration);

            this.settingsView.makeTransparent(opacity, duration);
            this.multiPlayerView.makeTransparent(opacity, duration);
            this.aboutView.makeTransparent(opacity, duration);
            this.scoresView.makeTransparent(opacity, duration);

        },

        makeTransparent: function(opacity, duration){
            // this is where each view take the appropriate steps to make itself ready to
            // for the dots snow effect

            //var opacity     = (opacity == 0)? 0: 1;
            this.famous.modifier.snowCanvas.setOpacity(opacity,{duration: duration});

        },



        showSplash:function(){
            // show the splashView by adding it to the main region. Due to how dots was built screens
            // by its original creators screens are empty because the elements animated in and out in
            //a whimsical fashion.

            // First lets add the settingView to the main region.
            this.famous.region.main.show(this.splashView);

            // Now tell the splashView to animate its elements into view. Be sure and pass a
            // reset value of true for now. (read code comments in splashview for why.)
            this.splashView.transitionIn(true);
        },

        showPlay:function(){

            //show the playView by adding it to the main region
            this.famous.region.main.show(this.playView);

            //tell the playview to animate its elements into the display area
            this.playView.transitionIn();

            //start the game (passing in the time to delay before starting)
            this.playView.startGame(800,this.gameType);

        },

        closePlay:function(){

            //tell the main region to hide the play view
            this.famous.region.main.hide(this.playView);

            //show the splash scrren
            this.showSplash();
        },

        showSettings:function(){

            //show the settingsView by adding it to the main region
            this.famous.region.main.show(this.settingsView);

            //tell the settingview to animate its elements into the display area
            this.settingsView.transitionIn();

        },

        closeSettings:function(){

            //tell the main region to hide the settings view
            this.famous.region.main.hide(this.settingsView);

            //show the splash scrren
            this.showSplash();
        },

        showAbout:function(){
            //show the aboutView by adding it to the main region
            this.famous.region.main.show(this.aboutView);

            //tell the aboutView to animate its elements into the display area
            this.aboutView.transitionIn();

        },
        closeAbout:function(){
            //tell the main region to hide the about view
            this.famous.region.main.hide(this.aboutView);

            //show the splash scrren
            this.showSplash();

        },

        showMultiPlayer:function(){
            //show the multiPlayerView by adding it to the main region
            this.famous.region.main.show(this.multiPlayerView);

            //tell the multiPlayerView to animate its elements into the display area
            this.multiPlayerView.transitionIn();

        },

        closeMultiPlayer:function(){
            //tell the main region to hide the multiplayer view
            this.famous.region.main.hide(this.multiPlayerView);

            //show the splash scrren
            this.showSplash();
        },

        showScores:function(){
            //show the scoresView by adding it to the main region
            this.famous.region.main.show(this.scoresView);

            //tell the scoresView to animate its elements into the display area
            this.scoresView.transitionIn();
        },

        closeScores:function(){
            //tell the main region to hide the scoresview
            this.famous.region.main.hide(this.scoresView);

            //show the splash screen
            this.showSplash();
        },

        onResize: function(){
            // Helpers has a property with the mathmatical calulation of 1 degree
            var degree = Helpers.degree;

            // Are we rotating the window? If so, by what amount?
            var amount;
            if (window.innerWidth>window.innerHeight){
                amount = 90;
            }else{
                amount = 0;
            }

            // Make the background's modifier instantly rotate into a new position
            this.famous.modifier.background.setTransform(
                Transform.rotateZ(degree*amount)
            );

            // Make the mainContainers's modifier rotate into a new position but with
            // a slight puase and some easing effects so the user can see it happen.
            this.famous.modifier.mainContainer.setTransform(
                Transform.multiply(
                    Transform.rotateZ(degree*amount),
                    Transform.scale(0.90,0.90)
                ),
                    {
                        duration: 200,
                        curve: Easing.easeIn
                    }
            );

            // Wait for a fraction of a second and then scale mainContainer back to its proper size
            // the only parameter we need to pass to the function is the value of 'this'
            Timer.setTimeout(_.bind(function(){
                this.famous.modifier.mainContainer.setTransform(
                    Transform.multiply(
                        Transform.rotateZ(degree*amount),
                        Transform.scale(1,1)
                    ),
                    {
                        duration: 650,
                        curve: Easing.inOutBack
                    }
                );
            }, this), 200);

        }

    });

    module.exports = StartView;

});









