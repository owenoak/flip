define(function(require, exports, module) {



    var Surface             = require('famous/core/Surface'),
        Modifier            = require('famous/core/Modifier'),

        Transform           = require('famous/core/Transform'),
        Easing              = require('famous/transitions/Easing'),
        PhysicsEngine       = require('famous/physics/PhysicsEngine'),

        Spring              = require("famous/physics/forces/Spring"),
        Timer               = require('famous/utilities/Timer'),
        Transitionable      = require('famous/transitions/Transitionable'),
        SpringTransition    = require('famous/transitions/SpringTransition'),

        _                   = require('main/vendor/underscore/lodash'),
        View                = require('main/helpers/view'),
        Helpers             = require('main/helpers/helpers');





    /*  -----------------------------------------------------------------------------------------

        Name:       SplashyLogoView

                    This is the view that displays all the famous logo dots and sizzle when the
                    application first starts. It controls all its own animation start and stop
                    timing and emits events to keep listeners informed of what it is doing.

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        ---------------------------------------------------------------------------------------*/


    var SplashyLogoView =  View.extend({

        surfaces: {
            dotContainer:{
                type: 'container',
                scaled: true,
                size: [128,128],
                modifier: {
                    origin: [.5,.5],
                    opacity:0
                 },
                properties: {
                    //border: '1px dashed #f0f',
                    overflow: 'visible',
                    zIndex: 10
                }

            },
        },

        initialize: function(){


            // What are we displaying? (only allows a-z - TODO: convert from svg images to handle any text)
            this.title      = 'byfamous';
            this.banner     = this.title.replace(/[^a-z]/gi,''); //regex to filer for a-z

            // Option way to define the order the title appears around the dial (not using but neat)
            this.clockOrder = '01765432';

            // Size of dots (uses Helpers.scaleX to maintain proportions)
            this.dotSize    = Math.max(Math.min(Helpers.scaleX(32),36),24);

            // How big is the dial?
            this.radius     = (-7) * (this.banner.length);

            // Number of degrees between character to evenly disperse around the dial
            this.degrees = Math.PI * 2 / this.banner.length;
            this.degrees = Helpers.degree * 360/this.banner.length;

        },

        onReady: function(){

            //add the physics engine to the containing surface or stuff wont draw!
            if(this.physicsEngine) this.famous.surface.dotContainer.add(this.physicsEngine);

            // Create dots
            this.createDots();

            // Create famous logo
            this.createFamous();


        },

        start: function(){

            this.fadeInContainer();
        },

        createTransform: function(key, addition){
            //this transform organizes the famous dots into a circle
            var transY = 0;
            if(addition) transY += addition;
            return Transform.multiply(
                        Transform.rotateZ(this.transformer[key].position),
                        Transform.translate(0, Helpers.scaleY(transY), 0)
                    );
        },

        sentenceTransform: function(key){
            // this transform organizes the famous dots into a sentence
            // hard coded the positions for now but this could be made smarter!
            var x,y;
            switch (key){
                case 'b0':  x = -20;    y = -20;    break;
                case 'y1':  x = 20;     y = -20;    break;
                case 'f2':  x = -100;    y = 20;     break;
                case 'a3':  x = -60;    y = 20;     break;
                case 'm4':  x = -20;    y = 20;     break;
                case 'o5':  x = 20;     y = 20;     break;
                case 'u6':  x = 60;     y = 20;     break;
                case 's7':  x = 100;     y = 20;     break;
            }

            return Transform.translate(Helpers.scaleX(x), Helpers.scaleY(y), 0);

        },

        createFamous: function(){
            // this creates a famous logo with physics applied. Could have been defined in
            // the surfaces object upon creation but but wanted to show how to create surfaces
            // elements outside of the surfaces object on an 'as needed' basis

            var data = {
                type: 'image',
                content: {src:'content/images/famous-symbol.svg'},
                putIn: 'dotContainer',
                physics: {type: 'spring', duration: 600, resistance: .2, length: 90, travel:[0,-180,0]},
                size: [240, 240],
                scaled: true,
                modifier: {
                    transform: Transform.translate(0, 0, 0),
                    origin: [.5,.5],
                    opacity:0
                },
            };

            this.initializeSurface('famousSymbol', data);

        },

        createDots: function(){
            //build our transformer object out of the banner string defined in initialize()
            this.transformer = {};

            var key = null;
            for (var i = 0; i < this.banner.length; i++){
                key = this.banner[i] + String(i);
                this.transformer[key] = {index: i, letter: this.banner[i], position: this.degrees * i }
            }

            //create dot surfaces and apply the sentence transform so they show up as a 'readable' sentence
            _.each(this.transformer, function(trans, key){

                var data = {
                    type: 'image',
                    content: {src:'content/images/dots/'+ trans.letter+'Dot.svg'},
                    putIn: 'dotContainer',
                    physics: {type: 'spring', duration: 600, resistance: .115, length: 110, travel:[0,-220,0]},
                    size: [this.dotSize,this.dotSize],
                    scaled: true,
                    modifier:{
                        origin: [.5,.5],
                        transform:this.sentenceTransform(trans.letter+trans.index)
                    }
                };
                this.initializeSurface(key, data);


            }, this);


        },



        fadeInContainer: function(){

            //the dots are all controlled by the physics engine so all we need to do
            //is apply transforms and let the physics engine handle the duration and effect
            var pause       = 2000;


            //fadein and scale up
            this.famous.modifier.dotContainer.setOpacity(1);
            this.famous.modifier.dotContainer.setTransform(
                Transform.multiply(
                    Transform.scale( .85, .85),
                    Transform.translate(0,Helpers.scaleY(140))
                )
            );

            //pause before we proceeed to circle the dots
            Timer.setTimeout(_.bind(this.circleTheDots, this), pause);
        },

        circleTheDots: function(){


            var transTime   = 450,
                pause       = 100;


            //animate dots into circle
            _.each(this.transformer, function(trans, key){

                this.famous.modifier[key].setTransform( this.createTransform(key,70),
                    {
                        duration: transTime,
                        curve: 'easeOutBounce'
                    });
            }, this);



            //over expand dots again but do it quickly
            Timer.setTimeout(_.bind(function(){
                _.each(this.transformer, function(trans, key){

                    //animate dots into circle
                    this.famous.modifier[key].setTransform( this.createTransform(key,130),
                        {
                            duration: pause,
                            curve: 'easeOutBounce'
                        });
                }, this);

            },this), transTime);

            // pause before we collapse the circle
            Timer.setTimeout(_.bind(this.collapseCircle, this), transTime+pause*1.5);
        },


        collapseCircle: function(){


            //make the circle of dots collapse into by shrinking the radius offset
            var transTime   = 200,
                pause       = 500;

            _.each(this.transformer, function(trans, key){

                this.famous.modifier[key].setTransform(
                    this.createTransform(key,14),  //<-- this number shrinks the radius
                    {
                        duration: transTime,
                        curve: Easing.easeInElastic
                    }
                );
            }, this);

            // start rotating dot container
            // DISCUSS: talk with Mark or Valdman about Transform.aboutOrigin - harder to use than should be
            // Tom seems to think this is due to size bug so disable this effect for now
            /*
            Time.setTimeout(_.bind(function(){
                this.famous.modifier.dotContainer.setTransform(
                Transform.aboutOrigin(
                    [Helpers.scaleX(-2), Helpers.scaleY(-38), 0],

                    Transform.rotateZ(Helpers.degree*180)),
                    {
                        duration: transTime*5,
                        curve: Easing.easeInElastic
                    }
                );
            }, this), transTime*.2);
            */


            //after a slight pause start fading in the famous logo and set its scale to small
            Timer.setTimeout(_.bind(function(){

                 //hide all the other famous dots
                _.each(this.transformer, function(trans, key){
                    this.famous.modifier[key].setOpacity(0,{
                            duration: transTime,
                            curve: Easing.easeInElastic
                        }
                    );
                }, this);

                //bring the logo into view and when done call this.famousOut()
                this.famous.modifier.famousSymbol.setOpacity(1,{
                        duration: transTime*1.7,  // take our time with this to easily create slight pause
                        curve: Easing.easeInElastic
                    },_.bind(this.famousOut, this) //<-- notice the callback function that gets executed after the effect finishes
                );
                this.famous.modifier.famousSymbol.setTransform(Transform.scale(.33, .33));

            }, this), transTime*.5);



        },


        famousOut: function(){

            var transTime = 200;

           // expand the logo to take over the display
            this.famous.modifier.famousSymbol.setTransform(
                Transform.multiply(
                    Transform.scale(3, 3),
                    Transform.translate(0, this.radius)
                ),
                {
                    duration: transTime,
                    curve: Easing.easeInOutElastic
                }
            );

            //fade out famous logo and when done call this.transitionOutComplete()
            this.famous.modifier.famousSymbol.setOpacity(.2,
                {
                    duration: transTime,
                    curve: Easing.easeOutElastic
                },
                _.bind(this.transitionOutComplete, this) //<-- notice the callback function that gets executed after the effect finishes
            );

        },

        famousIn: function(){
            // not using this for now but we might!
            var transTime = 100;
            this.famous.modifier.famousSymbol.setTransform(
                Transform.multiply(
                    Transform.translate(0, this.radius),
                    Transform.scale(.33, .33)
                ),
                {
                    duration: transTime,
                    curve: Easing.easeOutElastic
                }
            );

        },

        transitionOutComplete: function(){
            //let splashview know we are all done with the razzle dazzle of showing the famous dots and logo
            this.broadcast('razzle-dazzle-complete');
        },




    });

    module.exports = SplashyLogoView;

});


