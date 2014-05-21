
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

	// native extensions
	var native = require('native');
	var PageView = require('PageView');


	function BookView() {
		View.apply(this, arguments);
		this._initViews();
	}

	// Establishes prototype chain for BookView class to inherit from View
	var PVP = BookView.prototype = Object.create(View.prototype);
	PVP.constructor = BookView;

	// Default options for BookView class
	BookView.DEFAULT_OPTIONS = {
		sideCount 	: undefined,
		project		: undefined
	};


	// Initialize each of our page children
	PVP._initViews = function() {
		if (this.options.sideCount == null) throw "You must provide `options.pageCount`";
		if (this.options.project == null) throw "You must provide `options.project`";

		this.pageCount = Math.ceil(this.options.sideCount / 2);

		// add a StateModifier for flipping this page around its center axis (just for testing)
		this.positioner = new StateModifier({
			origin  : [0, 0],
			align	: [0, 0],
			size	: [660, 440]
		});
		this.mainNode = this.add(this.positioner);

		// page side images are numbered 01, 02, etc -- get # of letters for padding
		var sideDigits = Math.max(2, (""+this.options.sideCount).length);

		// create all of our pages
		this.pages = [];	// do we need to capture pages?
		for (var pageNum = 0, side = 1; side <= this.options.sideCount; ) {
			var frontSideName = (side++).pad(sideDigits);
			var backSideName = (side++).pad(sideDigits);
			var showShadow = (pageNum === 0 || pageNum === (this.pageCount-1));
			var pageOptions = {
				pageNumber	: pageNum++,
				frontUrl 	: "../projects/" + this.options.project+ "/" + frontSideName + ".jpg",
				backUrl  	: "../projects/" + this.options.project+ "/" + backSideName + ".jpg",
				zIndex		: (this.pageCount - pageNum),
				showShadow	: showShadow
			}
			var page = new PageView(pageOptions);
			this.pages.push(page);

			this.mainNode.add(page);
		}
	}

	PVP.currentPage = 0;
	PVP.showPage = function(pageNum) {
		if (pageNum < 0) pageNum = 0;
		if (pageNum >= this.pageCount) pageNum = this.pageCount-1;

		var currentPage = this.currentPage;
console.info(pageNum, currentPage);
		if (pageNum > currentPage) {
			for (var p = currentPage, i = 0; p <= pageNum; p++, i++) {
console.warn("forward", p, ":", this.pages[p]);
				this.pages[p].flipForward(i*20);
			}
		} else {
			for (var p = currentPage, i = 0; p >= pageNum; p--, i++) {
console.warn("back", p, ":", this.pages[p]);
				this.pages[p].flipBack(i*20);
			}
		}
		this.currentPage = pageNum;
	};

	PVP.showNextPage = function() {
		this.showPage(this.currentPage + 1);
	};

	PVP.showPrevPage = function() {
		this.showPage(this.currentPage - 1);
	};

	PVP.showFrontCover = function() {
		this.showPage(0);
	};

	PVP.showBackCover = function() {
		this.showPage(this.pageCount);
	};

	// debug
	PVP.toString = function() {
		return "[BookView "+this.project+"]";
	}

	module.exports = BookView;
});
