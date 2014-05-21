define(function(require, exports, module) {
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');
    var Easing             = require('famous/transitions/Easing');
    var ImageSurface       = require('famous/surfaces/ImageSurface');

    var CoverView          = require('./CoverView');
    var MenuItemView       = require('./MenuItemView');
    var DiagonalLinearGradientBackground = require('./DiagonalLinearGradientBackground');
    var PreviewNavigationController = require('./PreviewNavigationController');

    function AppView() {
        View.apply(this, arguments);

        this._pages = [];
        this._menus = [];
        this._backgrounds = [];

        _createGradientBackgrounds.call(this);
        _createMenuViews.call(this);
        _createProfilePicView.call(this);
        _createCoverViews.call(this);
        _createPreviewNavigationController.call(this);
        _listenForProfilePicEvents.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
    	coverAngleOffset: (-1 * Math.PI / 6),
    	coverScale:       [0.6, 0.6, 1],
    	coverTranslation: [190, 0, 40],
    	coverDefaultTransition: {
    		duration: 200,
    		curve: "easeOut"
    	},
    	coverRotateTransition: {
    		duration: 200,
    		curve: "linear"
    	},
    	noTransition: {
    		duration: 0
    	},
    	profileBounceTransition: {
    		duration: 600,
    		curve: Easing.outBounce
    	},
    	profilePicSize: 50,
    	profilePicTranslation: [0.35 * window.innerWidth, 0.4 * window.innerHeight, -1],
    	scrollViewOptions: {
    		direction: 'y',
    		paginated: true
        },
        coverTransform: Transform.multiply(Transform.multiply(
            Transform.translate(window.innerWidth - 140, 0, 80), 
            Transform.rotateY(-1 * Math.PI / 6)
        ), Transform.scale(0.6, 0.6, 1)),
        outTransition: {
        	duration: 200,
        	curve: 'linear'
        },
        inTransition: {
        	duration: 200,
        	curve: 'linear'
        }
    };

    function _createPreviewNavigationController() {
    	this.options.inTransform = this.options.outTransform = this.options.coverTransform;
    	this.options.offTransform = Transform.multiply(this.options.coverTransform, Transform.translate(200, 0, 0));
    	this.options.pages = this._pages;
    	this.options.menus = this._menus;
    	this.options.backgrounds = this._backgrounds;
        this.previewNavigationController = new PreviewNavigationController(this.options);
        this._add(this.previewNavigationController);
    }

    // Profile Pic in bottom right corner of menu view

    function _createProfilePicView() {
        this.profilePic = new ImageSurface({
        	classes: ['profilePic'],
    		size: [this.options.profilePicSize, this.options.profilePicSize],
        })
        this.profilePic.setContent('img/profile_pic.png');
        this.profileTranslateModifier = new Modifier({
            origin: [0.5, 0.5],
            transform: Transform.translate.apply(this, this.options.profilePicTranslation)
        });
        this.profileCorrectionModifier = new Modifier();
        this.profileScaleModifier = new Modifier({
        	transform: Transform.scale(0.01, 0.01, 0.01)
        });
        this._add(this.profileTranslateModifier).add(this.profileCorrectionModifier).add(this.profileScaleModifier).add(this.profilePic);
    }

    function _bounceProfilePicIn() {
    	this.profileScaleModifier.setTransform(Transform.scale(1, 1, 1), this.options.profileBounceTransition);
    }

    function _bounceProfilePicOut() {
    	this.profileScaleModifier.setTransform(Transform.scale(0.01, 0.01, 0.01), this.options.profileBounceTransition);
    }

    function _listenForProfilePicEvents() {
    	this.previewNavigationController.on('showProfilePic', _bounceProfilePicIn.bind(this));
    	this.previewNavigationController.on('hideProfilePic', _bounceProfilePicOut.bind(this));
    }
    
    // Cover views are the major renderables (the pages) in the PreviewNavigationController

    function _createCoverViews() {
        var coverSurface;
        var imagePaths = [
            "airBnb_demo_background_wo_menubar.png",
            "listing_wo_menubar.png"
        ];
    	for (var i = 0; i < imagePaths.length; i++) {
    		coverSurface = new CoverView(this.options, imagePaths[i]);
            this._pages.push(coverSurface);
    	}
    }

    // Menu views are the minor renderables (the menus) that go behind the pages in PreviewNavigationController

    function _createMenuViews() {
    	var menuItemView;
    	var MENU_DATA = [
            {
            	header: "Travel",
            	content: ["Search", "<strong>Discover</strong>", "Your Trips", "Wish List", "Inbox"],
                footer: "Host"
            },
            {
            	header: "Host",
            	content: ["<strong>List Your Spaces</strong>", "Why Host?"],
                footer: "Travel",
                lastPage: true     // this allows the last item in the scroll view to scroll to the top of the page
            }
    	];
    	for (var i = 0; i < MENU_DATA.length; i++) {
    		menuItemView = new MenuItemView(MENU_DATA[i]);
    	    this._menus.push(menuItemView); 
    	}
    }

    function _createGradientBackgrounds() {
        var colors = {
            gray:      '#B9B9B9', 
            grayGreen: '#A7C5BB',
            blue:      '#C9E0F0', 
            tan:       '#D4D3C6', 
            beige:     '#F8ECD9'  
        };

        var firstBackgroundStops = [
            {
            	position: 1,
            	color: colors.gray
            },
            {
            	position: 0.4,
            	color: colors.gray
            },
            {
            	position: 0,
            	color: colors.grayGreen
            }
        ];

        var secondBackgroundStops = [
            {
            	position: 0,
            	color: colors.blue
            },
            {
            	position: 0.6,
            	color: colors.tan
            },
            {
            	position: 1,
            	color: colors.beige
            }
        ];

        var firstBackground = new DiagonalLinearGradientBackground(this.options, firstBackgroundStops);
        var secondBackground = new DiagonalLinearGradientBackground(this.options, secondBackgroundStops);

    	//using this as a generator of background renderables instead of a view to add
        this._backgrounds = [firstBackground, secondBackground];
    }
    
    module.exports = AppView;
});

