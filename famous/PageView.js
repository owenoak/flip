
// A `Page` is a 2-sided piece of paper.
// Each `side` is an ImageView.
// Initialize with `{pageNumber, frontUrl, backUrl}`
define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');
	var ImageSurface = require('famous/surfaces/ImageSurface');
	var ContainerSurface = require('famous/surfaces/ContainerSurface');

	// native extensions
	var native = require('native');

	function PageView() {
		View.apply(this, arguments);
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
				boxShadow : "2px 2px 8px rgba(0, 0, 0, 0.25)"
			}
		});

		this.back  = new ImageSurface({
			content : this.options.backUrl,
			properties : {
				boxShadow : "-2px 2px 8px rgba(0, 0, 0, 0.25)"
			}
		});

		// flip the back image round
		var backFlipper = new StateModifier({
			origin 	: [1, 0],
			align	: [0, 0],
			transform : Transform.thenMove(Transform.rotateY((-180).degrees()), [0, 0, -1])
		});

console.info(this.options.pageNumber, this.options.zIndex);
		// our `flipper` is what rotates us around our axis
		this.flipper = new StateModifier({
			origin  : [0, 0],
			align	: [0.5, 0],
			size	: [660, 880],
			transfrom : Transform.thenMove(Transform.rotateY(this.options.flipStartAngle),
										   [0,0,this.options.zIndex*10])
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

	PVP.flipForward = function() {
		this._flip(this.options.flipEndAngle, true);
	}

	PVP.flipBack = function() {
		this._flip(this.options.flipStartAngle, false);
	}

	PVP._flip = function(angle, isFlipped) {
		this.flipper.setTransform(Transform.rotateY(angle),
								 { duration: this.options.flipDuration, curve: this.options.flipCurve }
								);
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
