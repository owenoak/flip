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

        Name:       SettingsView

                    This is the view that lets the user set the game options including player
                    name, dot colors, sound, vibration and themes. It is also responsible for
                    updating the settings model when the user clicks save.

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        ---------------------------------------------------------------------------------------*/

    var SettingsView =  View.extend({



         // define famous surfaces

         surfaces: {

            growBox: {
                size: [320, 42],  //starts out small and then grows on y axis
                scaled: true,
                modifier: {
                    origin: [0.5, 0.5],
                    //transform: Transform.translate(0,0,0)
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
                    //transform: Transform.translate(0,0,-1)
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                    zIndex: -1
                },
            },
            footer: {
                size: [320, 64],
                scaled: true,
                modifier: {
                    origin: [0.5, 1],
                    //transform: Transform.translate(0,0,-1)
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                    zIndex:-1
                },
            },

            mainTitle: {
                type: 'text',
                content: {text: 'SETTINGS'},
                size: [320, 64],
                scaled: true,
                modifier: {
                    origin: [.5, 0],
                    transform: Transform.translate(0,Helpers.scaleY(-64))
                },

                properties: {  //starts out off the top of the screen
                    color: '#000',
                    textAlign: 'center',
                    fontSize: '1em',
                    fontWeight: '200',
                    paddingTop: '1em',
                    zIndex:2
                }

            },

            backArrow: {
                type: 'image',
                content: {src: 'content/images/buttons/back-arrow.svg'},
                size: [30, 20],
                scaled: true,
                modifier: {
                    origin: [0.03,0],
                    transform: Transform.translate(Helpers.scaleX(-60),0) //starts out off the left of the screen
                },
                properties: {
                    color: '#000',
                    textAlign: 'center',
                    fontSize: '1em',
                    fontWeight: '200',
                    paddingTop: '.9em',
                    zIndex:3
                }

            },
            saveButton: {
                type: 'container',
                size: [150, 37],
                scaled: true,
                modifier: {
                    origin: [.5, .975],
                    transform: Transform.translate(0,Helpers.scaleY(70)) //starts out off the bottom of the screen
                },
            },

            saveBack: {
                type: 'image',
                content: {src: 'content/images/buttons/button-teal.svg'},
                size: [150, 37],
                scaled: true,
                putIn: 'saveButton',
                pipe:true,
                modifier: {
                    origin: [.5, 1],
                },
                properties: {
                    zIndex:1
                }
            },
            saveText: {
                type: 'text',
                content: {text: 'Save'},
                //classes: ['largebutton'],
                size: [120, 28],
                pipe:true,
                scaled: true,
                putIn:'saveButton',
                modifier: {
                    origin: [.5, .5],
                },
                properties: {
                    color: '#fff',
                    textAlign: 'center',
                    marginTop: '.5em',
                    zIndex:2,
                    fontSize: '.66em'
                },
            },

            nickName: {
                type: 'container',
                size: [250, 105],
                scaled: true,
                modifier: {
                    origin: [.5, .145],  //box height*1.5 because positions from center out
                    transform: Transform.translate(Helpers.scaleX(360),0) //starts out off the right of the screen
                },
                properties: {
                    borderBottom: '1px solid rgba(231,230,233,1)',

                },
            },
            nickNameDesc: {
                type: 'text',
                content: {text: 'Nickname'},
                size: [250, 28],
                pipe:true,
                scaled: true,
                putIn:'nickName',
                classes: ['lighterText'],
                modifier: {
                    origin: [.5, .425],
                },
                properties: {
                    zIndex:1,
                    fontSize: '.5em',
                    textAlign: 'center'
                },
            },
            playerName: {
                type: 'text',
                content: {text: 'Larry'},
                size: [250, 28],
                pipe:true,
                scaled: true,
                putIn:'nickName',
                modifier: {
                    origin: [.5, .6],
                },
                properties: {
                    color: 'rgb(66,174,165)',
                    zIndex:1,
                    fontSize: '1.5em',
                    textAlign: 'center'
                },
            },
            colors: {
                type: 'container',
                size: [250, 105],
                scaled: true,
                modifier: {
                    origin: [.5, .380],
                    transform: Transform.translate(Helpers.scaleX(360),0) //starts out off the right of the screen
                },
                properties: {
                    borderBottom: '1px solid rgba(231,230,233,1)',

                },
            },
            colorsDesc: {
                type: 'text',
                content: {text: 'Colors'},
                size: [250, 28],
                pipe:true,
                scaled: true,
                putIn:'colors',
                classes: ['lighterText'],
                modifier: {
                    origin: [.5, .425],
                },
                properties: {

                    zIndex:1,
                    fontSize: '.5em',
                    textAlign: 'center'
                },
            },

            purpleDot: {
                type: 'image',
                content: {src: 'content/images/dots/purple-dot.svg'},
                size: [20, 20],
                putIn: 'colors',
                scaled: true,
                modifier: {
                    origin: [.24, .7],
                },
            },
            blueDot: {
                type: 'image',
                content: {src: 'content/images/dots/blue-dot.svg'},
                size: [20, 20],
                putIn: 'colors',
                scaled: true,
                modifier: {
                    origin: [.37, .7],
                },
            },
            redDot: {
                type: 'image',
                content: {src: 'content/images/dots/red-dot.svg'},
                size: [20, 20],
                putIn: 'colors',
                scaled: true,
                modifier: {
                    origin: [.5, .7],
                },
            },
            greenDot: {
                type: 'image',
                content: {src: 'content/images/dots/green-dot.svg'},
                size: [20, 20],
                putIn: 'colors',
                scaled: true,
                modifier: {
                    origin: [.63, .7],
                },
            },
            yellowDot: {
                type: 'image',
                content: {src: 'content/images/dots/yellow-dot.svg'},
                size: [20, 20],
                putIn: 'colors',
                scaled: true,
                modifier: {
                    origin: [.77, .7],
                },
            },


            noise: {
                type: 'container',
                size: [250, 105],
                scaled: true,
                modifier: {
                    origin: [.5, .615],
                    transform: Transform.translate(Helpers.scaleX(360),0) //starts out off the right of the screen
                },
                properties: {
                    borderBottom: '1px solid rgba(231,230,233,1)',

                },
            },
            sound: {
                type: 'container',
                size: [125, 80],
                putIn: 'noise',
                scaled: true,
                modifier: {
                    origin: [0, .5],
                },
                properties: {
                    //backgroundColor: 'rgba(0,255,255,.3)',
                },
            },
            soundDesc: {
                type: 'text',
                content: {text: 'Sound'},
                size: [125, 28],
                pipe:true,
                scaled: true,
                putIn:'sound',
                classes: ['lighterText'],
                modifier: {
                    origin: [.5, .425],
                },
                properties: {

                    zIndex:1,
                    fontSize: '.5em',
                    textAlign: 'center'
                },
            },
            soundSetting: {
                type: 'text',
                content: {text: 'ON'},
                size: [125, 28],
                pipe:true,
                scaled: true,
                putIn:'sound',
                modifier: {
                    origin: [.5, .75],
                },
                properties: {
                    color: 'rgb(255,134,33)',
                    zIndex:1,
                    fontSize: '1.5em',
                    textAlign: 'center',
                    fontWeight:300,
                },
            },
            vibration: {
                type: 'container',
                size: [125, 80],
                putIn: 'noise',
                scaled: true,
                modifier: {
                    origin: [1, .5],
                },
                properties: {
                    //backgroundColor: 'rgba(0,255,255,.3)',
                    borderLeft: '1px solid rgba(231,230,233,1)',
                },
            },
            vibrationDesc: {
                type: 'text',
                content: {text: 'Vibration'},
                size: [125, 28],
                pipe:true,
                scaled: true,
                putIn:'vibration',
                classes: ['lighterText'],
                modifier: {
                    origin: [.5, .425],
                },
                properties: {
                    zIndex:1,
                    fontSize: '.5em',
                    textAlign: 'center'
                },
            },
            vibrationSetting: {
                type: 'text',
                content: {text: 'ON'},
                size: [125, 28],
                pipe:true,
                scaled: true,
                putIn:'vibration',
                modifier: {
                    origin: [.5, .75],
                },
                properties: {
                    color: 'rgb(255,134,33)',
                    zIndex:1,
                    fontSize: '1.5em',
                    fontWeight:300,
                    textAlign: 'center'
                },
            },


            themes: {
                type: 'container',
                size: [250, 105],
                scaled: true,
                modifier: {
                    origin: [.5, .852],
                    transform: Transform.translate(Helpers.scaleX(360),0) //starts out off the right of the screen
                },
                properties: {


                },
            },
            themesDesc: {
                type: 'text',
                content: {text: 'Themes'},
                size: [250, 28],
                pipe:true,
                scaled: true,
                putIn:'themes',
                classes: ['lighterText'],
                modifier: {
                    origin: [.5, .425],
                },
                properties: {
                    zIndex:1,
                    fontSize: '.5em',
                    textAlign: 'center'
                },
            },
            themeName: {
                type: 'text',
                content: {text: 'Classic'},
                size: [250, 28],
                pipe:true,
                scaled: true,
                putIn:'themes',
                modifier: {
                    origin: [.5, .6],
                },
                properties: {
                    color: 'rgb(66,174,165)',
                    zIndex:1,
                    fontSize: '1.5em',
                    textAlign: 'center'
                },
            },



        },


        _setListeners:function(){
            this.famous.surface.saveButton.on("click", _.bind(this.saveSettings,this));
            this.famous.surface.backArrow.on("click", _.bind(this.closeView,this));
            this.famous.surface.vibration.on("click", _.bind(this.toggleVibration,this));
            this.famous.surface.sound.on("click", _.bind(this.toggleSound,this));
            this.famous.surface.themes.on("click", _.bind(this.toggleTheme,this));
        },

        initialize : function(){
            // time to wait before starting any of the transitions for the other major views
            // selected from the menu (famous is too fast!)
            this.notifyDelay        = 300;

             // Size of dots (uses Helpers.scaleIt to maintain proportions)
            this.dotSize            = Math.max(Math.min(Helpers.scaleX(32),36),24);

            //initial settings
            this.playerName         = 'Larry';
            this.soundSetting       = true;
            this.vibrationSetting   = true;
            this.winterTheme        = false;
        },



        onReady: function(){

            this._setListeners();

        },

        closeView: function(){
            this.transitionOut();
            Timer.setTimeout(_.bind(function(){this.broadcast('close-settings')}, this), this.notifyDelay);
        },

        toggleVibration: function(){
            var elem = this.getElement('vibrationSetting');
            if (elem){
                this.vibrationSetting = !this.vibrationSetting;
                elem.innerText = (this.vibrationSetting) ? 'ON': 'OFF';

            }
        },

        toggleSound: function(){
            var elem = this.getElement('soundSetting');
            if (elem){
                this.soundSetting = !this.soundSetting;
                elem.innerText = (this.soundSetting) ? 'ON': 'OFF';

            }
        },

        toggleTheme: function(){
            var elem = this.getElement('themeName');
            if (elem){
                this.winterTheme = !this.winterTheme;
                elem.innerText = (this.winterTheme) ? 'Winter': 'Classic';
            }
            //trigger snow event
            if (this.winterTheme) this.broadcast('snowing','start');
            else this.broadcast('snowing','stop');


        },

        saveSettings: function(){
            //save the settings

            //close view
            this.closeView()
        },

        makeTransparent: function(opacity, duration){
            //surfaces that need to disappear so we can see snow
            // (if we opacitate to 0 then the growbox doesn't grow)
            var opacity     = (opacity == 0)? .01: 1;
            this.famous.modifier.growBox.setOpacity(opacity,{duration: duration});

        },

        transitionIn: function(){
            this.expandGrowBox('grow');
            this.moveTitle('down');
            this.moveBackArrow('right');
            this.moveSaveButton('up');
            //slight pause before we move the containers in
            Timer.setTimeout(_.bind(this.moveContainers, this,'left'), 200);

        },

        transitionOut: function(){
            this.moveTitle('up');
            this.moveBackArrow('left');
            this.moveSaveButton('down');
            this.moveContainers('right');
            this.expandGrowBox('shrink');
        },

        moveContainers: function(direction){

            //remove any timers that delayed calls to this function
            this.clearTimers('moveContainers');


            var groupKeys       = ['nickName','colors','noise','themes'],
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
        moveHeader: function(direction){
            var duration        = null,
                curve           = null,
                effect          = null,
                y               = 0,
                modifier        = this.famous.modifier.header;


            if (direction ==='down'){
                y           = 0;            //puts it back to the designed origin
                duration    = 100;
                curve       = Easing.outQuint;
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='up'){
                y           = -73;            //back off the top off the screen
                duration    = 100;
                curve       = Easing.outQuint;
                effect      = {duration: duration, curve: curve};
            }

            // apply the transfrom
            modifier.setTransform(Transform.translate(0, Helpers.scaleY(y)), effect);

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
                y           = -64;            //back off the top off the screen
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

        moveSaveButton: function(direction){
            var duration        = null,
                curve           = null,
                effect          = null,
                y               = 0,
                bounceY         = 0,
                modifier        = this.famous.modifier.saveButton;

            if (direction ==='up'){
                y           = -20;                //causes the crazy overshoot
                bounceY     = 0;                  //puts back to origin
                duration    = 600;
                curve       = Easing.inOutBack;
                effect      = {duration: duration, curve: curve};
            }

           if (direction ==='down'){
                y           = 70;                //puts back off bottom of the screen
                bounceY     = 0;                //no change
                duration    = 550;
                curve       = Easing.inOutBack;
                effect      = {duration: duration, curve: curve};
            }

            // apply the transfrom (in dots the button significantly overshoots its position
            // so i need a second transfrom to move it back  - only do if direction is up
            modifier.setTransform(Transform.translate(0, Helpers.scaleY(y)), effect,

            //when done callback function puts them back to origin
            _.bind(function(modifier,index){
                modifier.setTransform(
                    Transform.translate(0,Helpers.scaleY(bounceY)),
                    {duration: 250, curve: Easing.outBack}
                )
            },this,modifier));


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

    module.exports = SettingsView;


});





