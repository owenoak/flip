// Book constructor
window.Book = function Book(options) {
	this.initialize(options);
}

// instance properties
Book.prototype = {
	// id for the book
	id : undefined,

	// URL where our images come from.
	imageUrlPrefix : "pages/",

	// Total number of page SIDES in our book
	sideCount : 0,

	// current page we're displaying
	currentPage : 0,

	// mode: "fan" or "flat"
	mode : "flat",

	// List of all pages we manipulate, as:
	// 		<page><side class='front'/><side class='back'/></page>
	// Set up in `createPages()`.
	$pages : undefined,


	// Initialize our book.
	initialize : function(options) {
		if (options) {
			for (var key in options) this[key] = options[key];
		}
		if (!this.sideCount) throw "Error: you must pass `sideCount` so we can create pages.";
		if ((this.sideCount % 2) === 2) throw "Error: you must pass an even `sideCount`.";

		this.createPages();
		this.showPage();
		this.initEvents();
	},

	// Create pages for the book and stick 'em in the body.
	createPages : function() {
		var $book = this.$book = $(this.BOOK_TEMPLATE.expand(this));

		// Figure out the number of digits of our side count
		// We'll pad the page/side numbers with this, eg:  "01" or "021".
		var digits = (""+this.sideCount).length;

		this.pageCount = this.sideCount / 2;
		var pageNum = 0;
		var sideNum = 1;
		var zIndex = this.pageCount;

		var params = {
			urlPrefix : this.imageUrlPrefix
		}

		while (sideNum < this.sideCount) {
			// what type of page are we dealing with?
			if (pageNum === 0) {
				params.pageClass = "frontCover";
			} else if (pageNum === this.pageCount-1) {
				params.pageClass = "backCover";
			} else {
				params.pageClass = "inside";
			}

			params.pageName = pageNum++;
			params.frontSideName = (sideNum++).pad(digits);
			params.backSideName = (sideNum++).pad(digits);

			// set the z-index of the cover to the highest number, go down from there
			params.zIndex = zIndex--;

			// instantiate the template for the page and its sides
			var $page = $(this.PAGE_TEMPLATE.expand(params));

			// add it to the book
			this.$book.append($page);
		}

		// add to the book to the body
		$("body").append(this.$book);

		// get a reference to all of the $pages
		this.$pages = this.$book.find("page");

		// show the front cover
		this.showPage(0);
	},
	// Templates for creating the book & pages.
	BOOK_TEMPLATE : "<book id='{{id}}'></book>",
	PAGE_TEMPLATE : "<page class='pp{{pageName}} {{pageClass}}' style='z-index:{{zIndex}}'>"
						+"<side class='p{{frontSideName}} front' style='background-image:url({{urlPrefix}}{{frontSideName}}.jpg)'></side>"
						+"<side class='p{{backSideName}} back' style='background-image:url({{urlPrefix}}{{backSideName}}.jpg)'></side>"
				   +"</page>",

	// Show a particular page by manipulating CSS.
	showPage : function(pageNum) {
		if (pageNum < 0) pageNum = 0;
		if (pageNum > this.pageCount) pageNum = this.pageCount;

		var currentPage = this.currentPage;
		if (pageNum == null) pageNum = currentPage;

		// build up a list of animations that we want to perform
		var animations = [];

		// going forward in the book
		if (pageNum > currentPage) {
			for (var p = currentPage, i = 0; p < pageNum-1; p++, i++) {
				animations.push([p, -181, p, i]);
			}
			animations.push([p, -180, p, i]);
		}
		// going backward in the book
		else if (pageNum < currentPage) {
			for (var p = currentPage, i = 0; p >= pageNum; p--, i++) {
				animations.push([p, 0, this.pageCount-p, i]);
			}
			// make sure the left-side page is squared up
			animations.push([p, -180, p, i]);
		}
		this.animatePages(animations);

		this.currentPage = pageNum;
	},

	showNextPage : function() {
		this.showPage(this.currentPage + 1);
	},

	showPrevPage : function() {
		this.showPage(this.currentPage - 1);
	},

	showFrontCover : function() {
		this.showPage(0);
	},

	showBackCover : function() {
		this.showPage(this.pageCount);
	},


//
//	animation code
//
	// Set this to true to use `requestAnimationFrame` to attempt to synchronize the animations.
	// Otherwise we'll do our own looping...
	USE_REQUEST_ANIMATION_FRAME : false,

	// Animate a bunch of page flipping.
	animatePages : function(list) {
		if (this.USE_REQUEST_ANIMATION_FRAME) {
			this.animateWithRequestAnimationFrame(list);
		} else {
			this.animateWithTimers(list);
		}
	},

	// Animate using a recursive call to `requestAnimationFrame`.
	animateWithRequestAnimationFrame : function(list) {
		console.debug("using 'requestAnimationFrame()'");
		var book = this;
		function doit() {
			var args = list.shift();
			if (!args) return;
			requestAnimationFrame(doit);
			book._animatePageNow.apply(book, args);
		}
		requestAnimationFrame(doit);
	},

	// Animate using timers to spread the animations apart
	ANIMATION_TIMER_DELAY : 1000/60,
	ANIMATION_DURATION : 400,
	animateWithTimers : function(list) {
		console.debug("using timers");
		var book = this;
		// start moving each page after an increasing delay so we see the fan-out
		list.forEach(function(args) {
			var index = args[0];
			var delay = (args[3] || 0) * book.ANIMATION_TIMER_DELAY;
			setTimeout(function() {
				book._animatePageNow.apply(book, args);
			}, delay);
		});
	},

	// Actually perform one page animation.
	_animatePageNow : function(index, rotateY, zIndex, animationIndex) {
		var page = this.$pages[index];
		if (!page) return;
		$(page).css({"transform":"rotateY("+rotateY+"deg)", "zIndex":zIndex, "display":"block"});
	},

//
// event handling
//

	initEvents : function() {
		// eat body touch events on mobile if in catalog view
		//	- this prevents annoying drag up/down bounce behavior
		//	- unfortunately, it also prevents pinch
		$("body").on('touchmove', function (event) {
			event.preventDefault();
		});

		// switch pages when they swipe in the book
		this.$book.on("swipe", this.onSwipe.bind(this));

		this.$rafCheckbox = $("input#RAF");
		this.$rafCheckbox.prop("checked", false);
		this.$rafCheckbox.on("change", function(event){
			this.USE_REQUEST_ANIMATION_FRAME = this.$rafCheckbox.prop("checked");
		}.bind(this));
	},

	onSwipe : function(event) {
		if (event.direction === "left") {
			this.showNextPage();
		} else if (event.direction === "right") {
			this.showPrevPage();
		}
		event.preventDefault();
	},



};	// end Book()



var book = new Book({
	id				: "bebe/may2014",
	sideCount 		: 50,
	imageUrlPrefix 	: "../projects/bebe/may2014/",
});
