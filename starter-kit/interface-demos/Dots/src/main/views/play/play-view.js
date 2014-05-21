define(function(require, exports, module) {



    var Surface             = require('famous/core/Surface'),
        Modifier            = require('famous/core/Modifier'),
        Transform           = require('famous/core/Transform'),
        Easing              = require('famous/transitions/Easing'),
        //GenericSync         = require("famous/inputs/GenericSync"),
        //MouseSync           = require("famous/inputs/MouseSync"),
        Timer               = require('famous/utilities/Timer'),


        _                   = require('main/vendor/underscore/lodash'),
        View                = require('main/helpers/view'),
        Helpers             = require('main/helpers/helpers');




    /*  -----------------------------------------------------------------------------------------

        Name:       PlayView

                    Magic happens here. Want to add the canvas IN FRONT OF THE DOTS so that when
                    the user draws the line connecting the dots it appears on top of the dots
                    not BEHIND them like the iOS version. This works perfectly with a transparent
                    canvas and the 'draw behind' of the original game is one of those things that
                    is visually wrong that I can't let go uncorrected in the famous version!

        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

        ---------------------------------------------------------------------------------------*/

    var PlayView =  View.extend({

         // define famous surfaces
         surfaces: {

            background: {
                size: [320,548],
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
                type: 'container',
                size: [320, 48],
                scaled: true,
                modifier: {
                    origin: [0.5, 0],
                    transform: Transform.translate(0, Helpers.scaleY(-150))  //push off top of screen
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                    zIndex: 2,
                },
            },

            status: {
                type: 'container',
                size: [160, 48],
                putIn: 'header',
                pipe: true,
                scaled: true,
                modifier: {
                    origin: [.5, .5], //DISCUSS: need a transform to make this work cuz <.5 on x gets REALLY weird
                    transform: Transform.translate(Helpers.scaleX(-80),0)
                },
                properties: {

                    zIndex: 3,
                },
            },
            statusTitle: {
                type: 'text',
                content: {text: 'Time'},
                size: [60,20],
                pipe:true,
                scaled: true,
                putIn:'status',
                modifier: {
                    origin: [.24, .69],  //(size dtermines this) without any properties I would expect text to start at .3 it doesn't
                },
                properties: {
                    zIndex:2,
                    fontSize: '.5em',
                    fontWeight: 300,
                    color: '#000',
                    textAlign: 'right',


                },
            },
            statusCount: {
                type: 'text',
                content: {text: '60'},
                size: [50,24],
                pipe:true,
                scaled: true,
                putIn:'status',
                modifier: {
                    origin: [.82, .5],
                },
                properties: {
                    zIndex:2,
                    fontSize: '1em',
                    fontWeight: 300,
                    color: '#000',
                    textAlign: 'left',

                },
            },
            score: {
                type: 'container',
                size: [160, 48],
                putIn: 'header',
                pipe: true,
                scaled: true,
                modifier: {
                    origin: [.5, .5], //DISCUSS: [1,.5] does not work
                    transform: Transform.translate(Helpers.scaleX(80),0)
                },
                properties: {
                    zIndex: 3,
                },
            },
            scoreTitle: {
                type: 'text',
                content: {text: 'Score'},
                size: [60,20],
                pipe:true,
                scaled: true,
                putIn:'score',
                modifier: {
                    origin: [.14, .69],  //DISCUSS: align text is wwhere a visual editor would be epic
                },
                properties: {
                    zIndex:2,
                    fontSize: '.5em',
                    fontWeight: 300,
                    color: '#000',
                    textAlign: 'right',
                },
            },
            scoreCount: {
                type: 'text',
                content: {text: '0'},
                size: [50,24],
                pipe:true,
                scaled: true,
                putIn:'score',
                modifier: {
                    origin: [.72, .5],
                },
                properties: {
                    zIndex:2,
                    fontSize: '1em',
                    fontWeight: 300,
                    color: '#000',
                    textAlign: 'left',

                },
            },

            playGround: {
                type: 'container',
                size: [320, 452],
                scaled: true,
                modifier: {
                    origin: [0.5, .4],

                },
                properties: {

                },
            },
            /*
            lineCanvas: {
                type: 'canvas',
                size: [320, 452],
                scaled: true,
                //pipe: true,
                classes:['backcanvas'],
                putIn:'playGround',
                modifier: {
                    origin: [0.5, .5],

                },
                properties: {
                    //backgroundColor: 'rgba(100,0,0,.2)',
                    zIndex:5
                },
            },
            */
            footer: {
                type: 'container',
                size: [320, 48],
                scaled: true,
                modifier: {
                    origin: [0.5, 1],
                    transform: Transform.translate(0, Helpers.scaleY(50))  //push off bottom of screen
                },
                properties: {
                    backgroundColor: 'rgba(231,230,233,1)',  //dots bluish gray
                },
            },

            adder: {
                type: 'container',
                size: [105, 48],
                putIn: 'footer',
                scaled: true,
                modifier: {
                    origin: [.5, .5], //DISCUSS: need a transform to make this work cuz <.5 on x gets REALLY weird
                    transform: Transform.translate(Helpers.scaleX(-108),0) //(320-width) /2
                },
                properties: {
                    //backgroundColor: 'rgba(255,0,0,.5)',  //dots bluish gray

                },
            },

            adderIcon: {
                type: 'image',
                content: {src: 'content/images/dots/delay-dot.svg'},
                size: [24,24],
                scaled: true,
                putIn: 'adder',
                pipe:true,
                modifier: {
                    origin: [.4, .5],
                },
                properties:{
                    //backgroundColor: '#f00', //DISCUSS: turn on the background, set display to really small and show how image doesn't center in box anymore
                }

            },
            adderCount: {
                type: 'text',
                content: {text: '0'},
                size: [24,24],
                pipe:true,
                scaled: true,
                putIn:'adder',
                modifier: {
                    origin: [.8, .5],
                },
                properties: {
                    zIndex:2,
                    fontSize: '1em',
                    fontWeight: 300,
                    color: '#000',

                },
            },

            shrinker: {
                type: 'container',
                size: [105, 48],
                putIn: 'footer',
                scaled: true,
                modifier: {
                    origin: [.5, .5], //no transform just stay in place

                },
                properties: {

                },
            },
            shrinkerIcon: {
                type: 'image',
                content: {src: 'content/images/dots/shrinker-dot.svg'},
                size: [24,24],
                scaled: true,
                putIn: 'shrinker',
                pipe:true,
                modifier: {
                    origin: [.4, .5],
                },

            },
            shrinkerCount: {
                type: 'text',
                content: {text: '0'},
                size: [24,24],
                pipe:true,
                scaled: true,
                putIn:'shrinker',
                modifier: {
                    origin: [.8, .5],
                },
                properties: {
                    zIndex:2,
                    fontSize: '1em',
                    fontWeight: 300,
                    color: '#000',

                },
            },
            expander: {
                type: 'container',
                size: [105, 48],
                putIn: 'footer',
                scaled: true,
                modifier: {
                    origin: [.5, .5], //DISCUSS: [1,.5] does not work
                    transform: Transform.translate(Helpers.scaleX(108),0)
                },
                properties: {


                },
            },

            expanderIcon: {
                type: 'image',
                content: {src: 'content/images/dots/expander-dot.svg'},
                size: [24,24],
                scaled: true,
                putIn: 'expander',
                pipe:true,
                modifier: {
                    origin: [.4, .5],
                },

            },
            expanderCount: {
                type: 'text',
                content: {text: '0'},
                size: [24,24],
                pipe:true,
                scaled: true,
                putIn:'expander',
                modifier: {
                    origin: [.8, .5],
                },
                properties: {
                    zIndex:2,
                    fontSize: '1em',
                    fontWeight: 300,
                    color: '#000',

                },
            },


        },


        initialize : function(){
            // time to wait before starting any of the transitions for the other major views
            // selected from the menu (famous is too fast!)
            this.notifyDelay        = 300;
            this.dotColumns         = 6;
            this.dotRows            = 6;



            //size of the dots playground
            this.dotContainerWidth  = 300;
            this.dotContainerHeight = 260;
            this.dotDefaultColors   = ['yellow', 'blue', 'green', 'red', 'purple'];
            this.dotColors          = this.dotDefaultColors;
            this.dotPath            = 'content/images/dots/';
            this.dotExtension       = '-dot.svg';


            // how much to start the dots off the screen so they look like they are falling in
            this.topOffset          = -200;

            this.playGroundTouchPos = [0,0];
        },



        onReady: function(){

            this._setListeners();

            //creat the dot container
            this._createDotContainer();

            //create the dot grid
            this._createDotGrid();

            //tell the dot playground to listen for mouse/touch events
            this._handleTouch();

        },

        _setListeners:function(){
            this.famous.surface.header.on("click", _.bind(this.closeView,this));
            this.famous.surface.adder.on("click", _.bind(this.applyAdder,this));
            this.famous.surface.shrinker.on("click", _.bind(this.applyShrinker,this));
            this.famous.surface.expander.on("click", _.bind(this.applyExpander,this));
            //this.famous.surface.playGround.on("click", _.bind(this.userClick,this));
            //this.famous.surface.playGround.on("TouchStart", _.bind(this.userEnter,this));

        },

        _handleTouch:function(){
            /*
            //create a new sync to capture touch and mouse events on the 'dot playground'
            this.playgroundSync = new GenericSync(function() {
                return this.playGroundTouchPos;
            }.bind(this), {syncClasses:[MouseSync, TouchSync]});


            //attach the sync to the dot playground
            this.famous.surface.playGround.pipe(this.playgroundSync);

            //what 'down' events are we listening for
            this.famous.surface.playGround.on("touchstart", userClick.bind(this));
            this.famous.surface.playGround.on("mousedown", userClick.bind(this));

            //what 'movement' events are we listening for
            this.playgroundSync .on('start', userDragStart.bind(this));
            this.playgroundSync .on('update', userDrag.bind(this));
            this.playgroundSync .on('end', userDragEnd.bind(this));
            */
        },


        userDragStart:function(){
            console.log('drag started');

        },

        userDragging:function(){
            console.log('dragging in progress');
        },

        userDragEnd:function(){
            console.log('drag ended');
        },


        userEnter:function(){
            var clickKey = this.getFamousKey(event.srcElement)
            if (!clickKey) return;
            console.log('mouse entered: ' + clickKey);
        },

        userClick:function(){

            var clickKey = this.getFamousKey(event.srcElement)
            if (!clickKey) return;
            console.log('clicked: ' + clickKey);
        },

        squareFinder: function(chain){
            //search an array 0-35 with values of 0 or 1 to find squares
            var squares =[
                [0,1,6,7]                                               // 2 x 2
                [0,1,2,6,8,12,13,14]                                    // 3 x 3
                [0,1,2,3,6,9,12,15,18,19,20,21]                         // 4 x 4
                [0,1,2,3,4,6,10,12,16,18,22,24,25,26,27,28]             // 5 x 5
                [0,1,2,3,4,5,6,11,12,17,18,23,24,29,30,31,32,33,34,35]  // 6 x 6
            ]

        },

        _createDotContainer:function(){

            //create the dot Container in the playground
            var data = {
                    type: 'container',
                    putIn: 'playGround',
                    size: [this.dotContainerWidth, this.dotContainerHeight],
                    scaled: true,
                    modifier:{
                        origin: [.5,.5]
                    },
                    properties: {

                    }
            };
            this.initializeSurface('dotContainer', data);

        },

        _createDotGrid:function(){

            // enforce minimum and maximum grid size
            this.rows = Math.min(Math.max(this.rows,4),8);
            this.rows = Math.min(Math.max(this.rows,4),8);

            // store the y locations in our drop grid so we know where to drop to
            this.yDropLocation      = [];
            this.currentDotColor    = {};


            // dots all have the same y origin (0) but the x origin increments to right
            var xOrigin         = 0,
                yOrigin         = 1,

                // this is how many pixels wide each square in the grid is
                // (this is not the size of the actual square that holds the dot)
                gridWidth       = this.dotContainerWidth/this.dotRows,
                gridHeight      = this.dotContainerHeight/this.dotColumns,


                // this is the size of the square that holds the dot and creates the hit area test for usability
                hitSize         = 26,
                showHitArea     = false,  //set to false when all done testing

                // this is the size of the dot
                dotSize         = 20,

                // convert pixels to amount of famous origin offset to get squares positioned properly
                xOrigintoPixel  = 1/this.dotContainerWidth,
                yOrigintoPixel  = 1/this.dotContainerHeight;



            // create surfaces
            var x, y, data, yDrop,key,color = null;

            for (var row = 0; row < this.dotRows; row++){
                for (var col = 0; col < this.dotColumns; col++){

                    //calulate the surface origin in the dot container
                    x = xOrigin + gridWidth * col * xOrigintoPixel + (gridWidth-hitSize) * xOrigintoPixel;

                    //for testing purposes calculate the y margin and use it in the origin modifier for the square
                    y = yOrigin - gridHeight * row * yOrigintoPixel - (gridHeight-hitSize) * yOrigintoPixel;

                    //create the hit square
                    data = {
                        type: 'container',
                        putIn: 'dotContainer',
                        size: [hitSize, hitSize],
                        scaled: true,
                        modifier:{
                            origin: [x,0], // <----- insert y calulation from above to see the grid layout on display (and don't do dropdots call)
                            transform: Transform.translate(0,Helpers.scaleY(this.topOffset)),
                        },
                        properties: {
                            border: (showHitArea)? '1px dashed #aaa' : 'none'
                        }
                    };

                    key = 'square-' + String(col) + '-' + String(row);

                    this.initializeSurface(key, data);

                    //insert a random dot color to get the game started
                    color = this.getRandomDotColor();
                    data = {
                        type: 'image',
                        content: {src: color[1]},
                        putIn: 'square-' + String(col) + '-' + String(row),
                        size: [dotSize, dotSize],
                        scaled: true,
                        pipe: true,
                        modifier:{
                            origin: [.5,.5],

                        },
                    };

                    key = 'dot-' + String(col) + '-' + String(row);
                    this.initializeSurface(key, data);

                    //store the current color of the dot
                    this.currentDotColor[key] = color[0];

                }

                // store the y 'drop to' location for this row so we can use it later in our Transform.translate calulation
                // row 0 is at the bottom of the dot container so we start from it's height and work up the y-axis
                yDrop = this.dotContainerHeight - gridHeight * (row + 1) + (gridHeight-hitSize)/2;
                this.yDropLocation.push(yDrop);

            }


        },

        _createDotSync:function(){
            // DISCUSS: it looks like there is no more more mouse-sync in famous/input.
            // Tried to install it but github said repository doesnt exist.
            // probably built in? we do need to add the sync for touch events

            //create a generic sync for tracking touch events and mouse events
            this.position = [0,0];
            this.genericSync = new GenericSync(function(){return this.position;},
                {direction: GenericSync.DIRECTION_Y || GenericSync.DIRECTION_X});

            //assign the sync to each one of the dot squares

            var surface
            for (var row = 0; row < this.dotRows; row++){

                for (var col = 0; col < this.dotColumns; col++){
                    surface = this.famous.surface['square-' + String(col) + '-' + String(row)];
                    surface.pipe(this.genericSync);
                }
            }

            //dispatch sync events
            this.genericSync.on('update',_.bind(function(){this.syncUpdate},this));


        },

        syncUpdate: function(data){
            console.log(data);
        },

        resetDotColors:function(){
            var key         = null,
                oldColor    = null,
                newColor    = null;

            for (var row = 0; row < this.dotRows; row++){

                for (var col = 0; col < this.dotColumns; col++){

                    key = 'dot-' + String(col) + '-' + String(row);

                    //get the old color of the dot
                    oldColor = this.currentDotColor[key];

                    //generate a new color
                    newColor = this.getRandomDotColor()[0];

                    //replace the old color with new color
                    this.replaceDotColor(key,oldColor, newColor);

                    //store the new color
                    this.currentDotColor[key] = newColor;

                }
            }
        },



        replaceDotColor: function(key, oldColor, newColor){
            //test replacement
            var content = this.famous.surface[key].getContent();
            var result = content.replace(oldColor+'-dot',newColor+'-dot');

            this.famous.surface[key].setContent(result);

        },

        getRandomDotColor: function(){

            //randomly pick dot color
            var min         = 0,
                max         = this.dotColors.length,
                index       = Math.floor(Math.random() * (max - min) + min),
                color       = this.dotColors[index],
                path        = this.dotPath + color + this.dotExtension;

            return [color, path];
        },



        dropDots: function(action){



            //remove any timers that delayed calls to this function
            this.clearTimers('dropDots');

            var modifier    = null;
            var curve       = Easing.outBounce;
            var duration    = 250; //plus an additive calculated below
            var reset       = (action ==='reset') ?true : false;

            for (var row = 0; row < this.dotRows; row++){

                for (var col = 0; col < this.dotColumns; col++){
                    modifier = this.famous.modifier['square-' + String(col) + '-' + String(row)]
                    if (reset){
                        modifier.setTransform(Transform.translate(0,Helpers.scaleY(this.topOffset)),
                            {duration:0});

                    }else{
                        modifier.setTransform(Transform.translate(0,Helpers.scaleY(this.yDropLocation[row])),
                            {duration: duration + row * 50, curve: curve});
                    }
                }
            }
        },




        applyAdder: function(){
            console.log(' apply the adder');
        },

        applyShrinker: function(){
            console.log(' apply the shrinker');
        },

        applyExpander: function(){
            console.log(' apply the expander');
        },

        closeView: function(){
            this.transitionOut();
            Timer.setTimeout(_.bind(function(){this.broadcast('close-play')}, this), this.notifyDelay);
        },

        startGame: function(delay,gameType){


            //move dots back off screen to new game drop position
            this.dropDots('reset')

            //get default game colors
            this.dotColors = this.dotDefaultColors;

            //change titles, counts and dot colors
            this.setupGame(gameType);

            //generate new random colors
            this.resetDotColors();



            //pause before dropping the dots for effect
            Timer.setTimeout(_.bind(this.dropDots, this), delay);

        },

        setupGame: function(gameType){

            var elem;

             //if famous push the color black to the color array
            if (gameType ==='famous') {
                this.dotColors.push('black');
                this.setTextField('statusTitle','Moves');
                this.setTextField('statusCount','36');
                return;
            }

            if (gameType ==='moves') {

                this.setTextField('statusTitle','Moves');
                this.setTextField('statusCount','30');
                return;
            }

            if (gameType ==='timed') {

                this.setTextField('statusTitle','Time');
                this.setTextField('statusCount','60');
                return;

            }



        },


        saveSettings: function(){
            //save the settings

            //close view
            this.closeView()
        },

        makeTransparent: function(opacity, duration){
            //surfaces that need to disappear so we can see snow
            this.famous.modifier.growBox.setOpacity(opacity,{duration: duration});

        },

        transitionIn: function(){
            this.moveHeader('down');
            this.moveFooter('up');



        },

        transitionOut: function(){
            this.moveHeader('up');
            this.moveFooter('down');
        },



        moveHeader: function(direction){
            var duration        = null,
                curve           = null,
                effect          = null,
                y               = 0,
                modifier        = this.famous.modifier.header;


            if (direction ==='down'){
                y           = 0;            //puts it back to the designed origin
                duration    = 700;
                curve       = Easing.outQuint;
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='up'){
                y           = -50;            //back off the top of the screen
                duration    = 300;
                curve       = Easing.outQuint;
                effect      = {duration: duration, curve: curve};
            }

            // apply the transfrom
            modifier.setTransform(Transform.translate(0, Helpers.scaleY(y)), effect);

        },

        moveFooter: function(direction){
            var duration        = null,
                curve           = null,
                effect          = null,
                y               = 0,
                modifier        = this.famous.modifier.footer;


            if (direction ==='down'){
                y           = 50;            //back off the bottom of the screen
                duration    = 300;
                curve       = Easing.outQuint;
                effect      = {duration: duration, curve: curve};
            }

            if (direction ==='up'){
                y           = 0;            //puts it back to the designed origin
                duration    = 700;
                curve       = Easing.outQuint;
                effect      = {duration: duration, curve: curve};
            }

            // apply the transfrom
            modifier.setTransform(Transform.translate(0, Helpers.scaleY(y)), effect);

        },

    });

    module.exports = PlayView;

});




