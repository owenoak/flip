/*** AppView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    // Constructor function for our AppView class
    function AppView() {
        // Applies View's constructor function to AppView class
        View.apply(this, arguments);

        this._initViews();
    }

    // Establishes prototype chain for AppView class to inherit from View
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    // Default options for AppView class
    AppView.DEFAULT_OPTIONS = {
    	data : undefined,
        cameraWidth: 0.6 * window.innerHeight
    };

    AppView.DEFAULT_OPTIONS.slideWidth = 0.8 * AppView.DEFAULT_OPTIONS.cameraWidth;
    AppView.DEFAULT_OPTIONS.slideHeight = AppView.DEFAULT_OPTIONS.slideWidth + 40;
    AppView.DEFAULT_OPTIONS.slidePosition = 0.77 * AppView.DEFAULT_OPTIONS.cameraWidth;

    // Define your helper functions and prototype methods here
	AppView.prototype._initViews = function() {
        // camera
        var camera = new ImageSurface({
        	size : [this.options.cameraWidth, true],
        	content : "img/camera.png",
        	properties : {
        		width: "100%"
        	}
        });

        var cameraModifier = new StateModifier({
        	origin : [0.5, 0],
        	align  : [0.5, 0],
        	transform : Transform.behind
        });

        this.add(cameraModifier).add(camera);

		// slideshow view
		this.slideshowView = new SlideshowView({
			data:this.options.data,
			size: [this.options.slideWidth, this.options.slideHeight],
		});

        var slideshowModifier = new StateModifier({
            origin: [0.5, 0],
            align: [0.5, 0],
            transform: Transform.translate(0, this.options.slidePosition, 0)
        });

        var slideshowContainer = new ContainerSurface({
            properties: {
                overflow: 'hidden'
            }
        });

		this.add(slideshowModifier).add(slideshowContainer);
		slideshowContainer.add(this.slideshowView);
        slideshowContainer.context.setPerspective(1000);

    }
    module.exports = AppView;
});
