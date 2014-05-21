define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var ScrollView      = require('./ModifiedScrollView');

    function PreviewNavigationController(options) {
        View.apply(this, arguments);

        this.menuScrollView = new ScrollView(this.options.scrollViewOptions);
        this._currentPage = null;

        _setRenderables.call(this, options);
        _addBackgrounds.call(this);
        _addMenus.call(this);
        _addPages.call(this);
        _setPageChangeListener.call(this);
        _setCurrentPage.call(this);
    }

    PreviewNavigationController.prototype = Object.create(View.prototype);
    PreviewNavigationController.prototype.constructor = PreviewNavigationController;

    PreviewNavigationController.DEFAULT_OPTIONS = {
        origin: [0.5, 0.5],
        inTransform: Transform.translate(window.innerWidth - 60, 0, 0),
        inTransition: {
            duration: 700,
            curve: 'easeOut'
        },
        outTransform: Transform.translate(window.innerWidth - 60, 0, 0),
        outTransition: {
            duration: 700,
            curve: 'easeOut'
        },
        offTransform: Transform.translate(window.innerWidth, 0, 0),
        backgroundTransition: {
            duration: 1000,
            curve: 'linear'
        },
        scrollViewOptions: {
        	paginated: true,
        	direction: 'y'
        },
        showTransform: Transform.translate(0, 0, 0),
        backgroundZ: -1 
    };

    PreviewNavigationController.prototype.showPage = function showPage(index) {
        this._currentPage.modifier.setTransform(this.options.offTransform, this.options.inTransition);
        this.setBackgroundOpacity(0.01);
        this._currentPage = this._pages[index];
        this._currentPage.index = index;
        this._currentPage.modifier.setTransform(this.options.inTransform, this.options.inTransition);
        this.setBackgroundOpacity(1); 
    };

    PreviewNavigationController.prototype.setBackgroundOpacity = function setBackgroundOpacity(value, index) {
    	index = index || this._currentPage.index;
        this._backgrounds[index].modifier.setOpacity(value, this.options.backgroundTransition);	
    };

    function _setRenderables(options) {
        // There should be equal numbers of pages, menus and backgrounds
        this._pages       = this.options.pages ? this.options.pages : [];
        this._menus       = this.options.menus ? this.options.menus : [];
        this._backgrounds = this.options.backgrounds ? this.options.backgrounds : [];
        this._currentPage = this.options.firstPage ? this.options.firstPage: 0;
    }


    function _addBackgrounds() {
        for (var i = 0; i < this._pages.length; i++) {
            this._backgrounds[i].modifier = new Modifier({
                transform: Transform.translate(0, 0, this.options.backgroundZ),
                opacity: 0.01
            });
            this._add(this._backgrounds[i].modifier).add(this._backgrounds[i]);
        }    
    }

    function _addMenus() {
        this.menuScrollView.sequenceFrom(this._menus);

        for (var i = 0; i < this._menus.length; i++) {
        	// allow for menu scrolling
        	this._menus[i].pipe(this.menuScrollView);
        	// pipe events to pages for navigation
        	this._menus[i].pipe(this._pages[i]);
        }

        this.menuScrollModifier = new Modifier({
        	origin: [0.5, 0.5],
        	transform: Transform.translate(0, 0, -1)
        });

        this._add(this.menuScrollModifier).add(this.menuScrollView);
    }

    function _addPages() {
        for (var i = 0; i < this._pages.length; i++) {
            _listenForPageToggleEvent.call(this, this._pages[i]);
            this._pages[i].modifier = new Modifier({
                transform: this.options.offTransform,
                origin: this.options.origin
            });
            this._add(this._pages[i].modifier).add(this._pages[i]);
        }
    }

    function _listenForPageToggleEvent(page) {
    	page._isCurrentPage = false;
    	page.on('togglePage', function(){
        	if (page._isCurrentPage) {
        	    page.modifier.setTransform(this.options.outTransform, this.options.outTransition);
        	    this._eventOutput.emit('showProfilePic');
        	} else {
        	    page.modifier.setTransform(this.options.showTransform, this.options.inTransition);	
        	    this._eventOutput.emit('hideProfilePic');
        	}
        	page._isCurrentPage = !page._isCurrentPage;
    	}.bind(this));
    }

    function _setPageChangeListener() {
        //this.menuScrollView.on('pageScroll', function(event) {
            //this.showPage(event.index);
        this.menuScrollView.on('pageChange', function (event) {
            this.showPage(this._currentPage.index + event.direction);
        }.bind(this));
    }

    function _setCurrentPage() {
    	var firstIndex = this._currentPage;
        this._currentPage = this._pages[firstIndex]; 
        this._currentPage.index = firstIndex;
        this._currentPage._isCurrentPage = true;
        this._currentPage.modifier.setTransform(this.options.showTransform);
    }

    module.exports = PreviewNavigationController;
});
