
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

        Name:       MenuOptionsView

                    This is the view that displays the menu options. It lives on the bottom of the
                    screen until the user selects it and then it bounces into view. It triggers an
                    event before animating so the splashView can tell other views to move up out
                    of the way.

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        Design:     This should really be a slide out iOS style drawer but since we are trying to
                    emulate the whimisically designed dots...


        ---------------------------------------------------------------------------------------*/

    var MenuOptionsView =  View.extend({

        surfaces: {

            menu: {
                type: 'container',
                size: [150, 185],
                scaled: true,

                modifier: {
                    origin: [.5, .5],
                },
                properties: {
                    zIndex:1,
                    color: '#000',
                    textAlign: 'center',
                    fontSize: '.66em',
                    //backgroundColor: "rgba(0,255,255,.3)"
                }
            },

            hideShowMenu: {
                type: 'text',
                content: {text: 'Menu'},
                size: [150, 30],
                putIn: 'menu',
                pipe:true,
                physics: {type: 'spring', duration: 0, resistance: .25, length: 20, travel:[0,-40,0]},
                scaled: true,
                modifier: {
                    origin: [.5, .2],
                },
                properties: {

                    paddingTop: '.4em',
                }

            },
            multiPlayer: {
                type: 'text',
                content: {text: 'MultiPlayer'},
                size: [150, 30],
                putIn: 'menu',
                pipe:true,
                physics: {type: 'spring', duration: 0, resistance: .25, length: 20, travel:[0,-40,0]},
                scaled: true,
                modifier: {
                    origin: [.5, .4],
                },
                properties: {

                    paddingTop: '.4em',
                }

            },
            scores: {
                type: 'text',
                content: {text: 'Scores & Trophies'},
                size: [150, 30],
                putIn: 'menu',
                scaled: true,
                pipe:true,
                physics: {type: 'spring', duration: 0, resistance: .25, length: 20, travel:[0,-40,0]},
                modifier: {
                    origin: [.5, .6],
                },
                properties: {

                    paddingTop: '.4em',
                }

            },
            about: {
                type: 'text',
                content: {text: 'About'},
                size: [150, 30],
                putIn: 'menu',
                pipe:true,
                physics: {type: 'spring', duration: 0, resistance: .25, length: 20, travel:[0,-40,0]},
                scaled: true,
                modifier: {
                    origin: [.5, .8],
                },
                properties: {

                    paddingTop: '.4em',
                }

            },
            settings: {
                type: 'text',
                content: {text: 'Settings'},
                size: [150, 30],
                putIn: 'menu',
                scaled: true,
                pipe:true,
                physics: {type: 'spring', duration: 0, resistance: .25, length: 20, travel:[0,-40,0]},

                modifier: {
                    origin: [.5, 1],
                },
                properties: {

                    paddingTop: '.4em',
                }

            },
        },



        setListeners:function(){
            this.famous.surface.menu.on("click", _.bind(this.menuClicked,this));

        },

        initialize: function(){

            this.menuClosed = true;

        },

        onReady: function(){
            //add the physics engine to the containing surface or stuff wont draw!
            if(this.physicsEngine) this.famous.surface.menu.add(this.physicsEngine);


            //surfaces are ready so setup listeners
            this.setListeners();
        },


        menuClicked: function(){

            // DISCUSS: Does famous overuse event binding?
            // the mouse event tells us what srcElement in the DOM generated
            // the click event. It will have an attribute on it called
            // 'famousKey' that was automatically inserted when we created
            // the famous surface. We use this attribute to tell us which
            // surface generated the click event. This is done in lieu of
            // binding a click event to every single surface, which is kind
            // of an 'old school' DOM practice. Check to see how famous is handling
            // this behind the scenes. Maybe I'm being overly protective of
            // system resources, but when has that ever been a bad idea.

            var clickKey = this.getFamousKey(event.srcElement)
            if (!clickKey) return;

            //generate a menu selection event
            if (clickKey == 'hideShowMenu'){
                this.broadcast('menu-state-change');
            }else{
                this.broadcast('menu-item-selected', clickKey);
            }

            //all menu clicks cause the menu text to ripple up or down
            (this.menuClosed) ?this.rippleMenu('up'): this.rippleMenu('down');
            this.menuClosed = ! this.menuClosed;

            //update text on the hideShowMenu
            this.updateMenuText(this.menuClosed);

        },

        updateMenuText: function(closed){
            this.menuClosed = closed;
            var elem = this.getElement('hideShowMenu');
            if (!this.menuClosed) elem.innerText = "Hide Menu";
            if (this.menuClosed) elem.innerText = "Menu";
        },

        rippleMenu:function(direction){

            var groupKeys = this.famous.container.menu; //items in menu container
            var travel = (direction == 'up') ? -1 : .5;


            for (var i = 0; i < groupKeys.length; i++){

                var modifier = this.famous.modifier[groupKeys[i]];

                //move the items up (no curve needed the physics spring is working)
                modifier.setTransform(
                    Transform.translate(0,Helpers.scaleY((20 + i * 6)* travel)),
                    {duration: 200 + i * 35/*, curve: Easing.inOutBack*/},

                    //when done callback function puts them back
                    _.bind(function(modifier,index){
                        modifier.setTransform(
                            Transform.translate(0,Helpers.scaleY(0)),
                            {duration: 100 + i * 10/*, curve: Easing.outInBack*/}
                        )
                    },this,modifier,i)
                );
            }
        },



    });


    module.exports = MenuOptionsView;

});

