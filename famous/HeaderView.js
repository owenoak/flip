
// A `Book` holds a set of `Page`s.
// Each `side` is an ImageView.
// Initialize with `{pageNumber, frontUrl, backUrl}`
define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');
	var ImageSurface = require('famous/surfaces/ImageSurface');
	var ContainerSurface = require('famous/surfaces/ContainerSurface');
	var GridLayout = require("famous/views/GridLayout");

	// native extensions
	var native = require('native');
	var PageView = require('PageView');


	function HeaderView() {
		View.apply(this, arguments);
		this._initViews();
	}

	// Establishes prototype chain for HeaderView class to inherit from View
	var PVP = HeaderView.prototype = Object.create(View.prototype);
	PVP.constructor = HeaderView;

	// Default options for HeaderView class
	HeaderView.DEFAULT_OPTIONS = {};


	// Initialize each of our page children
	PVP._initViews = function() {

		var grid = new GridLayout({
			dimensions : [4,1]
		});
		var buttons = [];
		buttons.push(this.makeButton("Front", function(){book.showFrontCover()}));
		buttons.push(this.makeButton("Prev", function(){book.showPrevPage()}));
		buttons.push(this.makeButton("Next", function(){book.showNextPage()}));
		buttons.push(this.makeButton("Back", function(){book.showBackCover()}));

		grid.sequenceFrom(buttons);
		this.add(grid);
	}

	PVP.makeButton = function(name, handler) {
		var button = new Surface({
			size: [100, 40],
			content : name,
			classes : ["button"]
		});
		button.on("mousedown", handler);
//		button.on("touchstart", handler);

		return button;
	}


	// debug
	PVP.toString = function() {
		return "[a HeaderView]";
	}

	module.exports = HeaderView;
});
