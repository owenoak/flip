/*** SlideshowView ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
	var Lightbox = require('famous/views/Lightbox');
	var Easing = require('famous/transitions/Easing');

	var SlideView = require('views/SlideView');

    function SlideshowView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            size: this.options.size,
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this.mainNode = this.add(this.rootModifier);

        this._initViews();

        // show the first slide
        this.showCurrentSlide();
    }

    SlideshowView.prototype = Object.create(View.prototype);
    SlideshowView.prototype.constructor = SlideshowView;

    SlideshowView.DEFAULT_OPTIONS = {
    	data : undefined,
 		size: [450, 500],
 		lightboxOpts: {
            inOpacity: 1,
            outOpacity: 0,
            inOrigin: [0, 0],
            outOrigin: [0, 0],
            showOrigin: [0, 0],
            // Transform.thenMove() first applies a transform then a
            // translation based on [x, y, z]
            inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, -300, -300]),
            outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, -1000]),
            inTransition: { duration: 650, curve: 'easeOut' },
            outTransition: { duration: 500, curve: Easing.inCubic }
 		}
	};

	SlideshowView.prototype._initViews = function() {
		// create a lightbox to hold the slides
		this.lightbox = new Lightbox(this.options.lightboxOpts);
		this.mainNode.add(this.lightbox);

		// create the slides based on our data
		this.slides = [];
		this.currentIndex = 0;
		for (var i = 0; i < this.options.data.length; i++) {
			var slide = new SlideView({
				size : this.options.size,
				photoUrl : this.options.data[i]
			});
			this.slides.push(slide);

			slide.on("click", this.showNextSlide.bind(this));
		}
	}

	SlideshowView.prototype.showCurrentSlide = function() {
		var slide = this.slides[this.currentIndex];
		this.lightbox.show(slide, function() {
            slide.fadeIn();
        }.bind(this));
	}

	SlideshowView.prototype.showNextSlide = function() {
		this.currentIndex++;
		if (this.currentIndex === this.slides.length) this.currentIndex = 0;
		this.showCurrentSlide();
	}

    module.exports = SlideshowView;
});
