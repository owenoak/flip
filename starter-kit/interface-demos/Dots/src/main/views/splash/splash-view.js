define(function(require, exports, module) {



   var  Surface             = require('famous/core/Surface'),
        Modifier            = require('famous/core/Modifier'),
        Transform           = require('famous/core/Transform'),
        Easing              = require('famous/transitions/Easing'),
        PhysicsEngine       = require('famous/physics/PhysicsEngine'),
        Timer               = require('famous/utilities/Timer'),
        Spring              = require("famous/physics/forces/Spring"),
        Transitionable      = require('famous/transitions/Transitionable'),
        SpringTransition    = require('famous/transitions/SpringTransition'),
        View                = require('main/helpers/view'),
        Helpers             = require('main/helpers/helpers'),
        _                   = require('main/vendor/underscore/lodash'),


        SplashyLogoView     = require('main/views/splash/splashy-logo-view'),
        GamePlayView        = require('main/views/splash/game-play-view'),
        MenuOptionsView     = require('main/views/splash/menu-options-view');



    /*  -----------------------------------------------------------------------------------------

        Name:       SplashView

                    This is the view that dazzles the user when the application starts. It
                    animates in the famous dots, organizes them in a sentence and then a circle
                    and finally shows the famous logo and then makes it expand and fade out

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        ---------------------------------------------------------------------------------------*/

    var SplashView =  View.extend({

         // define famous surfaces
         surfaces: {

             logoBack: {
                size: [280,100],
                scaled: true,
                modifier: {
                    origin: [0.5, 0.25],
                    opacity: 1
                },
                properties: {
                    backgroundColor: 'rgba(255,255,255,1)',
                    zIndex: -1
                }
            },
            logo: {
                type: 'image',
                content: {src: 'content/images/dots-logo.svg'},
                size: [280, 110],
                scaled: true,

                modifier: {
                    origin: [0.5, 0.25],
                },

            },

            animateContainer:{
                type: 'container',
                scaled: true,
                size: [320,200],
                modifier: {
                    origin: [0.5, 0.7],
                    opacity:1
                },
                properties: {

                    overflow: 'visible',

                }

            },
            menuContainer:{
                type: 'container',
                scaled: true,
                size: [150,185],
                modifier: {
                    origin: [0.5, .96], //anchors to the bottom (have to translate down to get it off screen)
                    transform: Transform.translate(0,Helpers.scaleY(220)), //(really want 140) -see below when we show it
                    opacity:1
                },
                properties: {

                    overflow: 'visible',

                }

            },


        },

        events:{
            'razzle-dazzle-complete splashyLogoView'    :'razzleDazzleComplete',
            'game-change gamePlayView'                  :'gameChange',
            'game-start gamePlayView'                   :'gameStart',
            'menu-state-change menuOptionsView'         :'toggleMenu',
            'menu-item-selected menuOptionsView'        :'menuItemSelected',
        },



        setListeners:function(){

            //none


        },


        createViews: function(){
            // views must be created during initialize ino order to use our event helper for events
            this.splashyLogoView    = new SplashyLogoView(new PhysicsEngine({numConstraints: 4}));
            this.gamePlayView       = new GamePlayView();
            this.menuOptionsView    = new MenuOptionsView(new PhysicsEngine({numConstraints: 4}));

        },



        initialize : function(){

            this.createViews();

            // menu is initially closed
            this.menuClosed = true;

            // time to wait before notifying other views about internal events
            this.notifyDelay = 450;


        },

        onReady: function(){

            this.setListeners();

            //after brief pause call startLogoAnimation so all the 'famous dots' appear on the display
            Timer.setTimeout(_.bind(this.startLogoAnimation, this), 700);



        },

        menuItemSelected:function(selection){

            // when the user selectes a menu item we neeed to animate the elements out of the
            // display area
            this.menuClosed = true;
            this.transitionOut();

            // Let startview know we had a menu selection. We actually delay this message long
            // enough to let the user see the current views elements animating out, otherwise
            // the next view comes in so quickly the user doesn't get to see all our work.

            // Remember to always use Famous timer so as to not disrupt rendering
            Timer.setTimeout(_.bind(function(){this.broadcast('show-'+selection)}, this,selection), this.notifyDelay);

        },

        gameStart: function(){
            //user want to start a new game
            this.menuClosed = true;

            // update the 'show/hide' menu text
            this.menuOptionsView.updateMenuText(this.menuClosed);

            //transition our screen elements out
            this.transitionOut();

            //tell startview the game should start
            Timer.setTimeout(_.bind(function(){this.broadcast('game-start')}, this), this.notifyDelay);

        },

        gameChange: function(game){

            //if the user changes the game type and the menu selection need to respond
            if (!this.menuClosed) this.toggleMenu();

            // update the 'show/hide' menu text
            this.menuOptionsView.updateMenuText(this.menuClosed);

            // let startview know we had a change to the game type
            this.broadcast('game-change',game);
        },


        transitionOut:function(){

            // Here's what needs to happen when this view is transitioning out of the display area.
            // The 'true' parameter is a 'quickly' flag because things sometimes need to move off
            // the screen faster than at other times.
            this.moveLogo('up',true);
            this.moveAnimateContainer('down',true);
            this.moveMenuContainer('down', true);

         },

        transitionIn:function(reset){


            // Here's what needs to happen when this view is transitioning in to the display area.
            // The 'true' parameter is a 'quickly' flag because things sometimes need to move on
            // the screen faster than at other times.
            this.moveLogo('down',true);
            this.moveAnimateContainer('up',true);
            this.moveMenuContainer('up', true, reset); //if this is called with the 'reset' flag to true it fixes the menu problem
        },


        toggleMenu: function(){

            // move the animate and menu containers up or down depending on the state of menuClosed
            if (this.menuClosed){
                // tell the gamePlayView we are moving it up so it can do anything it might need to do
                // (i.e. hide any game descriptions that would appear ontop of the dots logo)
                this.gamePlayView.positionChange('up')

                //move the containers up
                this.moveAnimateContainer('up');
                this.moveMenuContainer('up');
            }else{
                //move the containers down
                this.moveAnimateContainer('down');
                this.moveMenuContainer('down');
            }

            //update menu state
            this.menuClosed = !this.menuClosed;

        },

        moveLogo:function(direction, quickly){


            var modifier    = this.famous.modifier.logo,
                effect      = undefined,
                duration    = 0,
                curve       = undefined,
                x           = 0,
                y           = 0;

            if (direction ==='up'){
                y           = -250;
                duration    = 150;
                curve       = Easing.outQuint;
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='down'){
                y           = 0;
                duration    = 500;
                curve       = Easing.outBack;
                effect      = {duration: duration, curve: curve};
            }

            if (effect) modifier.setTransform(Transform.translate(Helpers.scaleX(x),Helpers.scaleY(y)), effect);

            // logo has a background box that also need to move with it
            modifier        = this.famous.modifier.logoBack;

            if (effect) modifier.setTransform(Transform.translate(Helpers.scaleX(x),Helpers.scaleY(y)), effect);


        },

        moveAnimateContainer:function(direction, quickly){

            var modifier    = this.famous.modifier.animateContainer,
                effect      = undefined,
                duration    = 0,
                curve       = undefined,
                x           = 0,
                y           = 0;

            if (direction ==='up'){
                y           = (quickly) ? 0 : -100;
                duration    = (quickly) ? 500 : 700;
                curve       = (quickly) ? Easing.outBack : Easing.outBack
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='down'){
                y           = (quickly) ? 400 : 0;
                duration    = (quickly) ? 250 : 400;
                curve       = (quickly) ? Easing.outQuint : Easing.outBack
                effect      = {duration: duration, curve: curve};
            }

            if (effect) modifier.setTransform(Transform.translate(Helpers.scaleX(x),Helpers.scaleY(y)), effect);
        },


        moveMenuContainer:function(direction,quickly,reset){
            var modifier    = this.famous.modifier.menuContainer,
                effect      = undefined,
                duration    = 0,
                curve       = undefined,
                x           = 0,
                y           = 0;

            // DISCUSS: I think these translates look funny because the menuContainer origin is [.5,1] and
            // we used a translate during initialization to push this menu off the bottom of the display.
            // Check with Valdman whether a Transform.aboutOrigin would fix this!

            //plus we ssem to have to account for the menu being in an open state
            if (direction ==='up'){
                y           = (quickly) ? 0 : -20;
                duration    = (quickly) ? 500 : 700;
                curve       = (quickly) ? Easing.outQuint : Easing.outBack
                effect      = {duration: duration, curve: curve};

                if (reset) y = 140; // not sure why I have to this!!!!!!!
            }

            if (direction ==='down'){
                y           = (quickly) ? 170 : 140;
                duration    = (quickly) ? 100 : 400;
                curve       = (quickly) ? Easing.outQuint : Easing.outBack
                effect      = {duration: duration, curve: curve};
            }

            if (effect) modifier.setTransform(Transform.translate(Helpers.scaleX(x),Helpers.scaleY(y)), effect);

        },

        startLogoAnimation:function(){

            // Create a region for the splashy logo view
            this.createRegion('logoAnimation');

            // Put the region in the animation container (so we can make it bounce and stuff later)
            this.famous.surface.animateContainer.add(this.famous.region.logoAnimation);

            //show the animation (tricky timing issues with PE and how quickly famous marks stuff as dirty)
            this.famous.region.logoAnimation.show(this.splashyLogoView);
            this.splashyLogoView.start();
        },

        razzleDazzleComplete: function(){

            // Create a region for the start play view
            this.createRegion('gamePlay');

            //add it to our animate container
            this.famous.surface.animateContainer.add(this.famous.region.gamePlay);

            //show the startPlay view
            this.famous.region.gamePlay.show(this.gamePlayView);

            // Create a region for the menu view
            this.createRegion('menuOptions');

            //add region to our menu container
            this.famous.surface.menuContainer.add(this.famous.region.menuOptions);

            //because of the physics engine wanting do draw we have to hide and then
            //show menu options and bring back up onto the botton of the screen
            this.famous.modifier.menuContainer.setTransform(Transform.translate(0,Helpers.scaleY(140)),{duration:520});
            //this.famous.modifier.menuContainer.setOpacity(1);

            //tell region to show the menuOptions view
            this.famous.region.menuOptions.show(this.menuOptionsView);


            //hide the logo animation
            this.famous.region.logoAnimation.hide();


        },

    });

    module.exports = SplashView;

});







