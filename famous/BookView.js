
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

	// touch event support
    var GenericSync     = require('famous/inputs/GenericSync');
	var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({mouse: MouseSync});
    GenericSync.register({touch: TouchSync});

	// native extensions
	var native = require('native');
	var PageView = require('PageView');


	function BookView() {
		View.apply(this, arguments);
		this._initTouch();
		this._initViews();
	}

	// Establishes prototype chain for BookView class to inherit from View
	var BVP = BookView.prototype = Object.create(View.prototype);
	BVP.constructor = BookView;

	// Default options for BookView class
	BookView.DEFAULT_OPTIONS = {
		sideCount 	: undefined,
		project		: undefined
	};


	// Initialize each of our page children
	BVP._initViews = function() {
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

//			page.on("click", function(){alert(1)});
			page.pipe(this.sync);

			this.mainNode.add(page);
		}

	}

	BVP.currentPage = 0;
	BVP.showPage = function(pageNum) {
		if (pageNum < 0) pageNum = 0;
		if (pageNum >= this.pageCount) pageNum = this.pageCount;

		var currentPage = this.currentPage;
		if (pageNum > currentPage) {
console.warn("forward", pageNum, currentPage);
			for (var p = currentPage, i = 0; p < pageNum; p++, i++) {
				var page = this.pages[p];
				if (page) page.flipForward(i*20);
			}
		} else if (pageNum < currentPage) {
console.warn("back", pageNum, currentPage);
			for (var p = currentPage, i = 0; p >= pageNum; p--, i++) {
				var page = this.pages[p];
				if (page) page.flipBack(i*20);
			}
		}
		this.currentPage = Math.max(0, Math.min(pageNum, this.pageCount));
//console.info(this.currentPage);
	};

	BVP.showNextPage = function() {
		this.showPage(this.currentPage + 1);
	};

	BVP.showPrevPage = function() {
		this.showPage(this.currentPage - 1);
	};

	BVP.showFrontCover = function() {
		this.showPage(0);
	};

	BVP.showBackCover = function() {
		this.showPage(this.pageCount);
	};

//
//	events
//
    BVP._initTouch = function() {
        GenericSync.register(MouseSync);
        this.sync = new GenericSync(['mouse', 'touch'], {direction: GenericSync.DIRECTION_X});

        this.sync.on('update', function(data) {
        	if (this.alreadySwiped) return;
        	this.alreadySwiped = true;

			console.log("update",data);
			var delta = data.delta;
			if (delta < 0) {
				this.showNextPage();
			} else {
				this.showPrevPage();
			}
        }.bind(this));

        this.sync.on('end', (function(data) {
        	this.alreadySwiped = false;
			//console.log("end",data);
        }).bind(this));
    }


	// debug
	BVP.toString = function() {
		return "[BookView "+this.project+"]";
	}

	module.exports = BookView;
});
