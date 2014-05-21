define(function(require, exports, module) {
	var Engine             = require('famous/core/Engine');
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');
    var ImageSurface       = require('famous/surfaces/ImageSurface');
    var Timer              = require('famous/utilities/Timer');
    var Easing             = require('famous/transitions/Easing');
    
    function RefresherView() {
        View.apply(this, arguments);

        this._xhrBegun = false;
        this._begunAnimation = false;

        this.totalShift = 0;

        _attachRefresherSurface.call(this);
        _listenForRefresherEvents.call(this);
    }

    RefresherView.prototype = Object.create(View.prototype);
    RefresherView.prototype.constructor = RefresherView;

    RefresherView.DEFAULT_OPTIONS = {
    	backgroundPosition: -250,
    	signFlipTransition: {
    		duration: 150,
    		curve: Easing.inOutBounce
    	},
    	shipTranslateTransition: {
    		duration: 400,
    		curve: 'easeOut'
    	},
    	groundTranslateTransition: {
    		duration: 400,
    		curve: 'linear'
        },
    	shipPosition: -150,
    	bearPosition: 26,
    	groundPosition: 110,
    	moonPosition: 160
    };

    RefresherView.prototype.getSize = function getSize() {
    	return [undefined, 100];
    };

    RefresherView.prototype.handleScrollMove = function handleScrollMove(event) {
    	if (!this._xhrBegun) {
    	    this.moveScene(event.delta);	
    	}

    	if (!this._begunAnimation) {
    		 this._begunAnimation = true;
    	}

    };

    RefresherView.prototype.moveScene = function moveScene(amount) {
        if (this.totalShift < 250) {
            this.options.shipPosition += 1.4 * amount;
            if (this.options.shipPosition > 5) this.options.shipPosition = 5;

        	this.options.bearPosition += -0.56 * amount;
        	if(this.options.bearPosition < -35) this.options.bearPosition = -35;


            this.options.groundPosition += -0.5 * amount;
            if(this.options.groundPosition < 55) this.options.groundPosition = 55;

        	this.options.moonPosition += -1.5 * amount;
        	if(this.options.moonPosition < -6) this.options.moonPosition = -6;

            this.shipTranslateModifier.setTransform(Transform.translate(0, this.options.shipPosition, 0));
        	this.bearModifier.setTransform(Transform.translate(0, this.options.bearPosition, -1));
        	this.groundModifier.setTransform(Transform.translate(0, this.options.groundPosition, -2));
        	this.moonModifier.setTransform(Transform.translate(0, this.options.moonPosition, -3));
        }
    };

    function _resetAnimations() {
        this.totalShift = 0;
    	this.options.backgroundPosition = -250;
    	this.options.shipPosition = -150;
    	this.options.bearPosition = 26;
    	this.options.groundPosition = 110;
    	this.options.moonPosition = 160;
    }

    function _attachRefresherSurface() {
    	this.backgroundSurface = new ImageSurface({
    		size: [window.innerWidth + 20, 293 + (window.innerWidth + 20)/window.innerWidth]
    	});
        this.backgroundModifier = new Modifier({
        	origin: [0.5, 0.5],
        	transform: Transform.translate(0, this.options.backgroundPosition, -4)
        });

    	this.backgroundSurface.setContent('img/clouds.png');
        this.backgroundSurface.pipe(this._eventInput);
        //this._eventInput.pipe(this._eventOutput);
    	this._add(this.backgroundModifier).add(this.backgroundSurface);

    	this.groundSurface = new Surface({
    		size: [undefined, 100],
    		properties: {
    			borderTop: '1px solid black',
    			backgroundColor: '#CCC'
    		}
    	});

    	this.groundModifier = new Modifier({
    		//origin: [0.5, 1],
    		transform: Transform.translate(0, this.options.groundPosition, -2)
    	});
    	this._add(this.groundModifier).add(this.groundSurface);

    	this.bearSurface = new ImageSurface({
    		size: [22, 26]
    	});
    	this.bearSurface.setContent('img/bear.png');
    	this.bearModifier = new Modifier({
    		origin: [0.5, 1],
    		transform: Transform.translate(0, this.options.bearPosition, -1)
    	});
    	this.sizeModifier = new Modifier({
    	    size: [undefined, 100]	
    	});

    	var sizeModified = this._add(this.sizeModifier);

    	sizeModified.add(this.bearModifier).add(this.bearSurface);

    	this.shipSurface = new ImageSurface({
    		size: [68, 64]
    	});
    	this.shipSurface.setContent('img/ship.png');
    	this.shipModifier = new Modifier({
    		origin: [0.5, 0.5],
    		transform: Transform.translate(0, -10, 0)
    	});
    	this.shipBackground = new ImageSurface({
    		size: [36, 36]
    	});
    	this.shipBackground.setContent('img/ship-bkgd.png');
    	this.shipBackgroundModifier = new Modifier({
    		origin: [0.5, 0.5],
    		transform: Transform.translate(0, -7, -2)
    	});

    	this.shipTranslateModifier = new Modifier({
    		transform: Transform.translate(0, this.options.shipPosition, 0)
    	});

    	this.shipFire = new ImageSurface({
    		size: [18, 20]
    	});

    	this.shipFire.setContent('img/fire.png');

    	this.fireModifier = new Modifier({
    		origin: [0.5, 0],
    		transform: Transform.translate(0, 66, -1)
    	});

    	this.fireRotateModifier = new Modifier();

    	var shipModified = sizeModified.add(this.shipTranslateModifier);

    	shipModified.add(this.shipModifier).add(this.shipSurface);
    	shipModified.add(this.shipBackgroundModifier).add(this.shipBackground);
    	shipModified.add(this.fireModifier).add(this.fireRotateModifier).add(this.shipFire);


    	this.signSurface = new ImageSurface({
    		size: [168, 28]
    	});

    	this.signSurface.setContent('img/sign.png');
    	this.signModifier = new Modifier({
    		origin: [0.5, 1],
    		transform: Transform.rotateX(-1 * Math.PI / 2),
    		opacity: 0
    	});
    	sizeModified.add(this.signModifier).add(this.signSurface);

    	this.moonSurface = new ImageSurface({
    		size: [36, 36]
    	});
    	this.moonSurface.setContent('img/moon.png');
    	this.moonModifier = new Modifier({
    		origin: [0.15, 0.25],
    		opacity: 0.8,
    		transform: Transform.translate(0, this.options.moonPosition, -3)
    	});
        sizeModified.add(this.moonModifier).add(this.moonSurface);
    }

    function _rocketTakeoff() {
        this._xhrBegun = true;
    	this._eventOutput.emit('beginRefresh');
        _takeoffAnimations.call(this);
    }

    function _takeoffAnimations() {
    	this._begunAnimation = false;
    	this.signModifier.setOpacity(1);
    	this.signModifier.setTransform(Transform.identity, this.options.signFlipTransition);
    }

    function _setFirePosition() {
    	var now = Date.now();
    	var position = Math.sin(now / 60);
    	this.fireRotateModifier.setTransform(Transform.rotateZ(position * Math.PI / 16));
    }

    function _translateSky() {
        this.options.backgroundPosition += 1; 
        this.backgroundModifier.setTransform(Transform.translate(0, this.options.backgroundPosition, -4));
    }

    function _collapseRefresher() {
    	Engine.removeListener('prerender', this.fireSetter);
    	Engine.removeListener('prerender', this.skyMover);
    	this._xhrBegun = false;
    	this._eventOutput.emit('completeRefresh', {data: 'foobar'});
    	_resetAnimations.call(this);
    	_closeRefresher.call(this);
    }

    function _closeRefresher() {
    	this._eventOutput.emit('collapseRefresher');
    }

    function _listenForRefresherEvents() {
        this._eventInput.on('edgeHit', function (scrollPosition) {
        	if (scrollPosition < -10 && !this._xhrBegun) {
        		this._readyForTakeOff = true;
        		_rocketTakeoff.call(this);
        	}
        }.bind(this));

        this._eventInput.on('scrollend', function() {
        	if (this._readyForTakeOff) {
        		this._readyForTakeOff = false;
                this.options.groundPosition += 100;
                this.groundModifier.setTransform(Transform.translate(0, this.options.groundPosition, -3), this.options.groundTranslateTransition);
                this.signModifier.setTransform(Transform.translate(0, this.options.groundPosition, -3), this.options.groundTranslateTransition);

                this.fireSetter = _setFirePosition.bind(this);
                this.skyMover = _translateSky.bind(this);
                Engine.on('prerender', this.fireSetter);
                Engine.on('prerender', this.skyMover);
                Timer.after(function () {
                    _collapseRefresher.call(this); 
                }.bind(this), 180);
            } else {
                _closeRefresher.call(this);
                _resetAnimations.call(this);
            }
        }.bind(this));
    }
    module.exports = RefresherView;
});
