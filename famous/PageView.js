
// A `Page` is a 2-sided piece of paper.
// Each `side` is an ImageView.
// Initialize with `{pageNumber, frontUrl, backUrl}`
define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');
	var ImageSurface = require('famous/surfaces/ImageSurface');
	var ContainerSurface = require('famous/surfaces/ContainerSurface');
	var Transitionable = require("famous/transitions/Transitionable");

	// native extensions
	var native = require('native');

	function PageView() {
		View.apply(this, arguments);

		this._angle = new Transitionable((-360).degrees());

		this._initViews();
	}

	// Establishes prototype chain for PageView class to inherit from View
	var PVP = PageView.prototype = Object.create(View.prototype);
	PVP.constructor = PageView;

	// Default options for PageView class
	PageView.DEFAULT_OPTIONS = {
	// passed in our constructor
		pageNumber 		: undefined,
		frontUrl		: undefined,
		backUrl			: undefined,
		zIndex			: undefined,

	// "constants"
		flipDuration 	: 400,
		flipCurve	 	: "linear",
		// NOTE: If we go from 0 -> -180, famo.us will flip the page BEHIND.new
		//		 The solution is to go from -360 to -540, so it flips ABOVE.
		flipStartAngle	: (-360).degrees(),
		flipSwitchAngle	: (-450).degrees(),
		flipEndAngle	: (-540).degrees()

	};


	// Initialize each of our page children
	PVP._initViews = function() {
		if (this.options.pageNumber == null) throw "You must provide `options.pageNumber`";
		if (this.options.frontUrl == null) throw "You must provide `options.frontUrl`.";
		if (this.options.backUrl == null) throw "You must provide `options.backUrl`.";

		this.front = new ImageSurface({
			content:this.options.frontUrl,
			properties : {
				boxShadow 	: (this.options.showShadow ? "2px 2px 8px rgba(0, 0, 0, 0.25)" : "none")
			}
		});

		this.back  = new ImageSurface({
			content : this.options.backUrl,
			properties : {
				boxShadow 	: (this.options.showShadow ? "2px 2px 8px rgba(0, 0, 0, 0.25)" : "none")
			}
		});

		// flip the back image round
		var backFlipper = new StateModifier({
			origin 	: [1, 0],
			align	: [0, 0],
			transform : Transform.thenMove(Transform.rotateY((-180).degrees()), [0, 0, -1])
		});

		// our `flipper` is what rotates us around our axis
		// NOTE: it's a "Modifier" so we can give it functions to dynamically evaluate values
		this.flipper = new Modifier({
			origin  : [0, 0],
			align	: [0.5, 0],
			size	: [330, 440],

			// dynamically update the transform
			transform : function() {
				// angle is changed in `_flip()`
				var angle = this._angle.get();

				// Update the zIndex dynamically as well:
				//	if we're beyond the `switchAngle`, we're on the left and we want a low zIndex
				//	so other things will be above us.
				var zIndex = (angle < this.options.flipSwitchAngle ? this.options.pageNumber : this.options.zIndex);

				return Transform.thenMove(Transform.rotateY(angle),  [0, 0, zIndex])
			}.bind(this)
		});

		this.mainNode = this.add(this.flipper);

		// add front/back to our flipper
		this.mainNode.add(this.front);
		this.mainNode.add(backFlipper).add(this.back);

		// set up event handlers
		this.front.on("click", this.onFrontClick.bind(this));
		this.back.on("click", this.onBackClick.bind(this));
	}


	PVP.isFlipped = false;
	PVP.flip = function() {
		if (this.isFlipped) 	this.flipBack();
		else					this.flipForward();
	}

	PVP.flipForward = function(delay) {
		this._flip(this.options.flipEndAngle, true, delay);
	}

	PVP.flipBack = function(delay) {
		this._flip(this.options.flipStartAngle, false, delay);
	}

	PVP._flip = function(angle, isFlipped, delay) {
		if (delay) {
			setTimeout(this._flipNow.bind(this, angle, isFlipped), delay);
		} else {
			this._flipNow(angle, isFlipped);
		}
	}

	PVP._flipNow = function(angle, isFlipped) {
		// by updating the angle, on the next tick the page will start flipping
		this._angle.set( angle, { duration: this.options.flipDuration, curve: this.options.flipCurve });
		this.isFlipped = isFlipped;
	}

	PVP.onFrontClick = function() {
		this.flipForward();
	}
	PVP.onBackClick = function() {
		this.flipBack();
	}

	// debug
	PVP.toString = function() {
		return "[PageView "+this.pageNumber+"]";
	}

	module.exports = PageView;
});
