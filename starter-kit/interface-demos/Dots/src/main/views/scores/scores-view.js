define(function(require, exports, module) {



    var Surface             = require('famous/core/Surface'),
        Modifier            = require('famous/core/Modifier'),

        Transform           = require('famous/core/Transform'),
        Easing              = require('famous/transitions/Easing'),
        Timer               = require('famous/utilities/Timer'),

        _                   = require('main/vendor/underscore/lodash'),
        View                = require('main/helpers/view'),
        Helpers             = require('main/helpers/helpers');




    /*  -----------------------------------------------------------------------------------------

        Name:       ScoresView

                    This is the view doesn't do much other than show social media, a little tap
                    tunes game and a few quotes. Mostly fluff but we could put in easter eggs!

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        ---------------------------------------------------------------------------------------*/

    var ScoresView =  View.extend({

         // define famous surfaces
         surfaces: {

            growBox: {
                size: [320, 42],  //starts out small and then grows on y axis
                scaled: true,
                modifier: {
                    origin: [0.5, 0.5],
                },
                properties: {
                    backgroundColor: 'rgba(255,255,255,1)',
                    zIndex: -1

                }
            },
            header: {
                size: [320, 64], //size of (grow box -548) /2
                scaled: true,
                modifier: {
                    origin: [0.5, 0],
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                    zIndex: -2
                },
            },
            footer: {
                size: [320, 64],
                scaled: true,
                modifier: {
                    origin: [0.5, 1],
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                    zIndex: -2
                },
            },

            mainTitle: {
                type: 'text',
                content: {text: 'SCORES & TROPHIES'},
                size: [320, 73],
                scaled: true,
                modifier: {
                    origin: [.5, 0],
                    transform: Transform.translate(0,Helpers.scaleY(-73))  //starts out off the top of the screen
                },
                properties: {
                    color: '#000',
                    textAlign: 'center',
                    fontSize: '1em',
                    fontWeight: '200',
                    paddingTop: '1em',
                    zIndex: -1
                }

            },

            backArrow: {
                type: 'image',
                content: {src: 'content/images/buttons/back-arrow.svg'},
                size: [30, 20],
                scaled: true,
                modifier: {
                    origin: [.03, 0.04],
                    transform: Transform.translate(Helpers.scaleX(-60),0) //starts out off the left of the screen
                },

            },



        },


        _setListeners:function(){
            this.famous.surface.backArrow.on("click", _.bind(this.closeView,this));

         },

        initialize : function(){
            // time to wait before starting any of the transitions for the other major views
            // selected from the menu (famous is too fast!)
            this.notifyDelay        = 300;

         },



        onReady: function(){

            this._setListeners();

        },

        closeView: function(){
            this.transitionOut();
            Timer.setTimeout(_.bind(function(){this.broadcast('close-scores')}, this), this.notifyDelay);
            _.delay(_.bind(function(){this.broadcast('close-scores')}, this), this.notifyDelay);

        },

        makeTransparent: function(opacity, duration){
            //surfaces that need to disappear so we can see snow
            this.famous.modifier.growBox.setOpacity(opacity,{duration: duration});

        },

        transitionIn: function(){
            this.expandGrowBox('grow');
            this.moveTitle('down');
            this.moveBackArrow('right');

            //slight pause before we move the containers in
            Timer.setTimeout(_.bind(this.moveContainers, this,'left'), 200);


        },

        transitionOut: function(){
            this.moveTitle('up');
            this.moveBackArrow('left');

            this.moveContainers('right');
            this.expandGrowBox('shrink');

        },

        moveContainers: function(direction){
             //remove any timers that delayed calls to this function
            this.clearTimers('moveContainers');

            return
            var groupKeys       = ['player1','player2'],
                duration        = null,
                curve           = null,
                effect          = null,
                x               = 0,
                modifier        = null,
                stagger         = 100;


            if (direction ==='right'){
                x           = 360;                //puts it back oof the right off screen
                duration    = 150;
                curve       = Easing.outBack;
            }

            if (direction ==='left'){
                x           = 0;                //puts back off left of screen
                duration    = 300;
                curve       = Easing.outBack;
            }


            // apply the transfrom
            for (var i = 0; i < groupKeys.length; i++){

                var modifier = this.famous.modifier[groupKeys[i]];
                var effect = {duration: duration + i * stagger, curve: curve}
                //move the items
                modifier.setTransform(Transform.translate(Helpers.scaleX(x),0),effect)
            }

        },


        moveTitle: function(direction){
            var duration        = null,
                curve           = null,
                effect          = null,
                y               = 0,
                modifier        = this.famous.modifier.mainTitle;


            if (direction ==='down'){
                y           = 0;            //puts it back to the designed origin
                duration    = 300;
                curve       = Easing.outBack;
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='up'){
                y           = -73;            //back off the top off the screen
                duration    = 300;
                curve       = Easing.outBack;
                effect      = {duration: duration, curve: curve};
            }

            // apply the transfrom
            modifier.setTransform(Transform.translate(0, Helpers.scaleY(y)), effect);

        },
        moveBackArrow: function(direction){
            var duration        = null,
                curve           = null,
                effect          = null,
                x               = 0,
                modifier        = this.famous.modifier.backArrow;

            if (direction ==='right'){
                x           = 0;                //puts it back to origin
                duration    = 600;
                curve       = Easing.outBack;
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='left'){
                x           = -60;                //puts back off left of screen
                duration    = 300;
                curve       = Easing.outBack;
                effect      = {duration: duration, curve: curve};
            }

            // apply the transfrom
            modifier.setTransform(Transform.translate(Helpers.scaleX(x),0), effect);

        },



        expandGrowBox: function(direction){
            var duration        = null,
                curve           = null,
                scaleY          = null,
                effect          = null,
                modifier        = this.famous.modifier.growBox;

            if (direction ==='grow'){
                scaleY      = 10;
                duration    = 500;
                curve       = Easing.outBack;
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='shrink'){
                scaleY      = .01;
                duration    = 120;
                curve       = Easing.inCirc;
                effect      = {duration: duration, curve: curve};
            }

            //this scales the intial grow box by a factor of 10 so to end up with a box
            //that is 250 pixels high set the intital height of the box to 25

            modifier.setTransform(Transform.scale(1,scaleY),effect);

        },
    });

    module.exports = ScoresView;


});





