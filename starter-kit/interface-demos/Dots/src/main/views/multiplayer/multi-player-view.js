
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

        Name:       MultiPlayerView

                    This is the view that lets the user play against other players. We aren't
                    going to do much with this view other than capture names, because, hey, who
                    really shares their phone with someone else to play dots?

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        ---------------------------------------------------------------------------------------*/

    var MultiPlayerView =  View.extend({

         // define famous surfaces
         surfaces: {

            growBox: {
                size: [320, 39],  //starts out small and then grows on y axis
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
                size: [320, 79], //size of (grow box -548) /2
                scaled: true,
                modifier: {
                    origin: [0.5, 0],
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                    zIndex:-2
                },
            },
            footer: {
                size: [320, 79],
                scaled: true,
                modifier: {
                    origin: [0.5, 1],
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                    zIndex:-2
                },
            },

            mainTitle: {
                type: 'text',
                content: {text: 'MULTI PLAYER'},
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
                    origin: [.03, .04],
                    transform: Transform.translate(Helpers.scaleX(-60),0) //starts out off the left of the screen
                },
                properties: {


                }

            },
            buttonBox: {
                type: 'container',
                size: [150, 100],
                scaled: true,
                modifier: {
                    origin: [.5, .95],
                    transform: Transform.translate(0,Helpers.scaleY(150)) //starts out off the bottom of the screen
                },
                properties: {
                    //border: '1px dashed #f00'
                }
            },
            showTimedGame: {
                type: 'image',
                content: {src: 'content/images/buttons/start-clock-game.svg'},
                size: [30, 30],
                putIn: 'buttonBox',
                scaled: true,
                modifier: {
                    origin: [.32, 0],
                },
                properties: {
                    zIndex:1
                },
            },
            showMovesGame: {
                type: 'image',
                content: {src: 'content/images/buttons/start-moves-game.svg'},
                size: [30,30],
                putIn: 'buttonBox',
                scaled: true,
                modifier: {
                    origin: [.68, 0],
                    opacity: .3
                },
                properties: {
                    zIndex:1
                },
            },
            nextButton: {
                type: 'container',
                size: [150, 37],
                putIn: 'buttonBox',
                scaled: true,
                modifier: {
                    origin: [.5, 1],
                },
                properties:{

                }
            },

            nextBack: {
                type: 'image',
                content: {src: 'content/images/buttons/button-teal.svg'},
                size: [150, 37],
                scaled: true,
                putIn: 'nextButton',
                pipe:true,
                modifier: {
                    origin: [.5, 1],
                },
                properties: {
                    zIndex:1
                }
            },
            nextText: {
                type: 'text',
                content: {text: 'Next'},
                //classes: ['largebutton'],
                size: [120, 28],
                pipe:true,
                scaled: true,
                putIn:'nextButton',
                modifier: {
                    origin: [.5, .5],
                },
                properties: {
                    color: '#fff',
                    textAlign: 'center',
                    zIndex:2,
                    marginTop: '.5em',
                    fontSize: '.66em'
                },
            },

            player1: {
                type: 'container',
                size: [280, 60],
                scaled: true,
                modifier: {
                    origin: [.5, .19],  //box height*1.5 because positions from center out
                    transform: Transform.translate(Helpers.scaleX(360),0) //starts out off the right of the screen
                },
                properties: {
                    borderBottom: '1px solid rgba(231,230,233,1)',
                    //backgroundColor: 'rgba(0,255,255,.3)',
                },
            },

            player1Name: {
                type: 'text',
                content: {text: 'Larry'},
                size: [250, 28],
                pipe:true,
                scaled: true,
                putIn:'player1',
                modifier: {
                    origin: [0, .6],
                },
                properties: {
                    color: 'rgb(30,30,30)',
                    zIndex:1,
                    fontSize: '1.12em',

                },
            },
            player1Delete: {
                type: 'image',
                content: {src: 'content/images/buttons/close-button.svg'},
                size: [24,24],
                scaled: true,
                putIn: 'player1',

                modifier: {
                    origin: [1, .5],
                    transform: Transform.translate(Helpers.scaleX(10),0)
                },
                properties: {
                    zIndex:1
                }
            },

            player2: {
                type: 'container',
                size: [280, 60],
                scaled: true,
                modifier: {
                    origin: [.5, .32],
                    transform: Transform.translate(Helpers.scaleX(360),0) //starts out off the right of the screen
                },
                properties: {
                    borderBottom: '1px solid rgba(231,230,233,1)',
                    //backgroundColor: 'rgba(0,255,255,.3)',

                },
            },

            player2Name: {
                type: 'text',
                content: {text: 'Player 2'},
                size: [250, 28],
                pipe:true,
                scaled: true,
                putIn:'player2',
                modifier: {
                    origin: [0, .6],
                },
                properties: {
                    color: 'rgb(30,30,30)',
                    zIndex:1,
                    fontSize: '1.12em',

                },
            },
            player2Delete: {
                type: 'image',
                content: {src: 'content/images/buttons/close-button.svg'},
                size: [24,24],
                scaled: true,
                putIn: 'player2',

                modifier: {
                    origin: [1, .5],
                    transform: Transform.translate(Helpers.scaleX(10),0)
                },
                properties: {
                    zIndex:1
                }
            },

        },


        _setListeners:function(){
            this.famous.surface.nextButton.on("click", _.bind(this.gameStart,this));
            this.famous.surface.backArrow.on("click", _.bind(this.closeView,this));
            this.famous.surface.showTimedGame.on("click", _.bind(this.showGameType,this,0));
            this.famous.surface.showMovesGame.on("click", _.bind(this.showGameType,this,1));

         },

        initialize : function(){
            // time to wait before starting any of the transitions for the other major views
            // selected from the menu (famous is too fast!)
            this.notifyDelay        = 300;

         },



        onReady: function(){

            this._setListeners();

        },

        makeTransparent: function(opacity, duration){
            //surfaces that need to disappear so we can see snow
            this.famous.modifier.growBox.setOpacity(opacity,{duration: duration});

        },

        closeView: function(){
            this.transitionOut();
            Timer.setTimeout(_.bind(function(){this.broadcast('close-multi-player')}, this), this.notifyDelay);

         },


        gameStart: function(){
            //save the settings

            //close view
            this.closeView()
        },

        showGameType: function(index){


            // group all these surfaces 'keys' together to animate as a group
            var groupKeys = ['showTimedGame','showMovesGame'];

            // get the selected surface and modifier
            var surface = this.famous.surface[groupKeys[index]];
            var modifier = this.famous.modifier[groupKeys[index]];


            // FAMOUSLY: set all to a disabled opacity
            for (var i = 0; i < groupKeys.length; i++){
                this.famous.modifier[groupKeys[i]].setOpacity(.3,{duration:150});

            }
            // make selection bounce (even though user won't see it under their finger looks cool for demo)
            modifier.setOpacity(1,{duration:300});
            modifier.setTransform(Transform.scale(1,1),
                {duration:100, curve: Easing.easeOutBounce},
                _.bind(function(){
                    modifier.setTransform(
                        Transform.scale(1,1),
                        {duration:150, curve: Easing.easeInElastic}
                    )
                },this));

        },


        transitionIn: function(){
            this.expandGrowBox('grow');
            this.moveTitle('down');
            this.moveBackArrow('right');
            this.movebuttonBox('up');
            //slight pause before we move the containers in
            Timer.setTimeout(_.bind(this.moveContainers, this,'left'), 200);


        },

        transitionOut: function(){
            this.moveTitle('up');
            this.moveBackArrow('left');
            this.movebuttonBox('down');
            this.moveContainers('right');
            this.expandGrowBox('shrink');

        },

        moveContainers: function(direction){
            //remove any timers that delayed calls to this function
            this.clearTimers('moveContainers');


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

        movebuttonBox: function(direction){
            var duration        = null,
                curve           = null,
                effect          = null,
                y               = 0,
                bounceY         = 0,
                modifier        = this.famous.modifier.buttonBox;

            if (direction ==='up'){
                y           = 0;                //causes the crazy overshoot
                duration    = 600;
                curve       = Easing.inOutBack;
                effect      = {duration: duration, curve: curve};
            }

           if (direction ==='down'){
                y           = 150;                //puts back off bottom of the screen
                duration    = 550;
                curve       = Easing.inOutBack;
                effect      = {duration: duration, curve: curve};
            }

            // apply the transform
            modifier.setTransform(Transform.translate(0, Helpers.scaleY(y)), effect);


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
                scaleY      = .0001;
                duration    = 120;
                curve       = Easing.inCirc;
                effect      = {duration: duration, curve: curve};
            }

            //this scales the intial grow box by a factor of 10 so to end up with a box
            //that is 250 pixels high set the intital height of the box to 25

            modifier.setTransform(Transform.scale(1,scaleY),effect);

        },




    });

    module.exports = MultiPlayerView;

});





