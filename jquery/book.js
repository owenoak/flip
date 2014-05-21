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


	animationOptions : {
		duration : 100,
		easing : "easeOutCubic"
	},

	// Show a particular page by manipulating CSS.
	showPage : function(pageNum) {
		if (pageNum < 0) pageNum = 0;
		if (pageNum > this.pageCount) pageNum = this.pageCount;

		var currentPage = this.currentPage;
		if (pageNum == null) pageNum = currentPage;

		// going forward in the book
		if (pageNum > currentPage) {
			for (var p = currentPage, i = 0; p < pageNum-1; p++, i++) {
				this._animatePage(p, -181, p, i);
			}
			this._animatePage(p, -180, p, i);
		}
		// going backward in the book
		else if (pageNum < currentPage) {
			for (var p = currentPage, i = 0; p >= pageNum; p--, i++) {
				var page = this.$pages[p];
				this._animatePage(p, 0, this.pageCount-p, i);
			}
			// make sure the left-side page is squared up
			this._animatePage(p, -180, p, i);
		}

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

	PAGE_ANIMATION_DURATION : 500,
	_animatePage : function(index, rotateY, zIndex, animationIndex) {
		var promise = $.Deferred();

		var page = this.$pages[index];
		if (!page) return promise.reject();

		var $page = $(page);
		var delay = (animationIndex || 0) * 20;
		setTimeout(function() {
			$page.show()
//				 .addClass("active")
				 .css({"transform":"rotateY("+rotateY+"deg)", "zIndex":zIndex});

			setTimeout(function() {
//				$page.removeClass("active");
				promise.resolve();
			}, this.PAGE_ANIMATION_DURATION);
		}.bind(this), delay);
		return promise;
	},


	// Return a page specified by 0-based index.
	get$page : function(pageNum) {
		return $("page.pp"+pageNum);
	}

};	// end Book()



var book = new Book({
	id				: "bebe/may2014",
	sideCount 		: 50,
	imageUrlPrefix 	: "../projects/bebe/may2014/",
});
