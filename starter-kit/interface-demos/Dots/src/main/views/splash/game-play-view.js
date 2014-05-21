define(function(require, exports, module) {



    var Surface             = require('famous/core/Surface'),
        Modifier            = require('famous/core/Modifier'),
        Timer               = require('famous/utilities/Timer'),
        Transform           = require('famous/core/Transform'),
        Easing              = require('famous/transitions/Easing'),

        _                   = require('main/vendor/underscore/lodash'),
        View                = require('main/helpers/view'),
        Helpers             = require('main/helpers/helpers');



    /*  -----------------------------------------------------------------------------------------

        Name:       GamePlayView

                    This is the view that displays all the control buttons to start a new game or
                    let the user select which type of dots game to play. It also animates the game
                    type descriptions that display based on user selection.

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        Design:     So the big question is could we use a scrollContainer instead of rolling our
                    own implementation?

        ---------------------------------------------------------------------------------------*/

    var GamePlayView =  View.extend({

        surfaces: {

            beginButton: {
                type: 'container',
                size: [150, 37],
                scaled: true,
                modifier: {
                    origin: [.5, 1],
                },

            },

            beginBack: {
                type: 'image',
                content: {src: 'content/images/buttons/button-teal.svg'},
                size: [150, 37],
                scaled: true,
                putIn: 'beginButton',
                pipe:true,
                modifier: {
                    origin: [.5, 1],
                },
                properties: {
                    zIndex:1
                }
            },
            beginText: {
                type: 'text',
                content: {text: 'Play Now'},
                //classes: ['largebutton'],
                size: [120, 28],
                pipe:true,
                scaled: true,
                putIn:'beginButton',
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

            setTimedGame: {
                type: 'image',
                content: {src: 'content/images/buttons/start-clock-game.svg'},
                size: [30, 30],
                pipe: true,
                scaled: true,
                modifier: {
                    origin: [.3, .68],
                },
                properties: {
                    zIndex:1
                },
            },
            setMovesGame: {
                type: 'image',
                content: {src: 'content/images/buttons/start-moves-game.svg'},
                size: [30,30],
                pipe: true,
                scaled: true,
                modifier: {
                    origin: [.5, .68],
                    opacity: .3
                },
                properties: {
                    zIndex:1
                },
            },
            setFamousGame: {
                type: 'image',
                content: {src: 'content/images/buttons/start-famous-game.svg'},
                size: [30,30],
                pipe: true,
                scaled: true,
                modifier: {
                    origin: [.7, .68],
                    opacity: .3
                },
                properties: {
                    zIndex:1
                },
            },
            descriptions: {
                type: 'container',
                size: [960,90],
                scaled: true,
                modifier: {
                    origin: [0, 0],
                }
            },
            timedDesc: {
                type: 'container',
                size: [320,90],
                putIn: 'descriptions',
                scaled: true,
                modifier: {
                    origin: [0, 0],
                    opacity:0
                }
            },
            timedTitle: {
                type: 'text',
                content: {text: 'Timed'},
                size: [150, 27],
                putIn: 'timedDesc',
                scaled: true,
                modifier: {
                    origin: [.5, 0],
                },
                classes: ['darkerText'],
                properties: {
                    textAlign: 'center',
                    zIndex:2,
                    fontSize: '1.1em',
                },
            },
            timedSub: {
                type: 'text',
                content: {text: '60 Seconds'},
                size: [150, 27],
                putIn: 'timedDesc',
                scaled: true,
                modifier: {
                    origin: [.5, .45],
                },
                classes: ['lighterText'],
                properties: {
                    textAlign: 'center',
                    zIndex:2,
                    fontSize: '.6em',
                },
            },
            movesDesc: {
                type: 'container',
                size: [320,90],
                putIn: 'descriptions',
                scaled: true,
                modifier: {
                    origin: [0,0],
                    opacity:0,
                    transform:Transform.translate(Helpers.scaleX(320),0),
                }
            },
            movesTitle: {
                type: 'text',
                content: {text: 'Moves'},
                size: [150, 27],
                putIn: 'movesDesc',
                scaled: true,
                modifier: {
                    origin: [.5, 0],
                },
                classes: ['darkerText'],
                properties: {
                    textAlign: 'center',
                    zIndex:2,
                    fontSize: '1.1em',
                },
            },
            movesSub: {
                type: 'text',
                content: {text: '30 Moves'},
                size: [150, 27],
                putIn: 'movesDesc',
                scaled: true,
                modifier: {
                    origin: [.5, .45],
                },
                classes: ['lighterText'],
                properties: {
                    textAlign: 'center',
                    zIndex:2,
                    fontSize: '.6em',
                },
            },
            famousDesc: {
                type: 'container',
                size: [320,90],
                putIn: 'descriptions',
                scaled: true,
                modifier: {
                    origin: [0, 0],
                    opacity:0,
                    transform:Transform.translate(Helpers.scaleX(640),0),
                },
            },
            famousTitle: {
                type: 'text',
                content: {text: 'Famo.us'},
                size: [150, 27],
                putIn: 'famousDesc',
                scaled: true,
                modifier: {
                    origin: [.5, 0],
                },
                classes: ['darkerText'],
                properties: {
                    textAlign: 'center',
                    zIndex:2,
                    fontSize: '1.1em',
                },
            },
            famousSub: {
                type: 'text',
                content: {text: '36 Moves'},
                size: [150, 27],
                putIn: 'famousDesc',
                scaled: true,
                modifier: {
                    origin: [.5, .45],
                },
                classes: ['lighterText'],
                properties: {
                    textAlign: 'center',
                    zIndex:2,
                    fontSize: '.6em',
                },
            },


        },



        setListeners:function(){
            this.famous.surface.setTimedGame.on("click", _.bind(this.setGameType,this,0));
            this.famous.surface.setMovesGame.on("click", _.bind(this.setGameType,this,1));
            this.famous.surface.setFamousGame.on("click", _.bind(this.setGameType,this,2));
            //this.famous.surface.beginButton.on("click", _.bind(this.setGameType,this,2));
            this.famous.surface.beginButton.on("click", _.bind(this.broadcast,this,'game-start'));

        },

        initialize: function(){

            //what type of games can we play?
            this.gameChoices = ['timed','moves','famous'];
            this.gameChoice = 0;

        },

        onReady: function(){

            //surfaces are ready so setup listeners
            this.setListeners();
        },

        positionChange: function(direction){

            // this function is used so others can tell us if we are being moved so we adjust our state

            // all keys shown here will hide
            var groupKeys = ['timedDesc','movesDesc','famousDesc'];

            // halt any descriptions in the process of being shown so they don't reappear after we hide them
            if(this.modifierInProgress) this.modifierInProgress.halt();


            // do the hiding
            for (var i = 0; i < groupKeys.length; i++){
                this.famous.modifier[groupKeys[i]].setOpacity(0,{duration:50})
            }
        },

        moveDescription: function(index){

            var oldChoice       = this.gameChoice,
                newChoice       = index,
                groupKeys       = ['timedDesc','movesDesc','famousDesc'],
                modifier        = this.famous.modifier[groupKeys[newChoice]]; //user selection

            // originally all the descriptions were in a container and we just moved the container.
            // upon closer examination of the dots game behavior they animate each one seperately
            // so we do it the same way to mimic the look

            if (oldChoice != newChoice){
                var oldX = oldChoice * 320;
                var newX = newChoice *320;
                var moveX = oldX-newX;

                if(this.modifierInProgress) this.modifierInProgress.halt();

                for (var i = 0; i < groupKeys.length; i++){

                    // very original starting position was 0, 320, 640,  for each choice
                    var moveTo = (320 *  i ) + moveX - (320 * oldChoice);

                    // user selection comes in faster the old ones take a little longer to exit
                    var duration = (i == newChoice) ?550:700;

                    this.famous.modifier[groupKeys[i]].setTransform(
                    Transform.translate(Helpers.scaleX(moveTo),0),{duration: duration, curve: Easing.inOutBack});
                }

            }


            //make new choice visible
            modifier.setOpacity(1);

            //set the current modifier to the modifier
            this.currentModifier = modifier;

            //set timer to slowly fade it out
            Timer.setTimeout(_.bind(this.fadeDescription,this), 1500);
        },

        fadeDescription: function(){

            //fade out description
            this.currentModifier.setOpacity(0,{duration: 2000});

            //set the current modifier in progress in case we need to halt it
            this.modifierInProgress = this.currentModifier;
        },


        setGameType: function(index){

            //advise that game is changing
            this.broadcast('game-change',this.gameChoices[index]);

            // group all these surfaces 'keys' together to animate as a group
            var groupKeys = ['setTimedGame','setMovesGame','setFamousGame'];

            // get the selected surface and modifier
            var surface = this.famous.surface[groupKeys[index]];
            var modifier = this.famous.modifier[groupKeys[index]];


            // set all to a disabled opacity
            for (var i = 0; i < groupKeys.length; i++){
                this.famous.modifier[groupKeys[i]].setOpacity(.3,{duration:150});

            }
            // make selection bounce (even though user won't see it under their finger it looks cool for demo)
            modifier.setOpacity(1);
            modifier.setTransform(Transform.scale(1.2,1.2),
                {duration:100, curve: Easing.easeOutBounce},
                _.bind(function(){
                    modifier.setTransform(
                        Transform.scale(1,1),
                        {duration:150, curve: Easing.easeInElastic}
                    )
                },this));

            //update the user description
            this.moveDescription(index);


            //update the game choice (do this after the moveDescription so it knows old location)
            this.gameChoice = index;





        },

    });


    module.exports = GamePlayView;

});
