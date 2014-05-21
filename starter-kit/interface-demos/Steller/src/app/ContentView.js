define(function(require, exports, module) {
    var Surface                 = require('famous/core/Surface');
    var Modifier                = require('famous/core/Modifier');
    var Transform               = require('famous/core/Transform');
    var TouchSync               = require('famous/inputs/TouchSync');
    var GenericSync             = require('famous/inputs/GenericSync');
    var View                    = require('famous/core/View');
    var Transitionable          = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    
    var PageView  = require('app/PageView');
    var templates = require('app/templates');

    function ContentView() {
        View.apply(this, arguments);
        _createPages.call(this);
    }

    ContentView.prototype = Object.create(View.prototype);
    ContentView.prototype.constructor = ContentView;

    ContentView.DEFAULT_OPTIONS = {};

    function _createPages() {
        this.pages = [];
        this.mods = [];
        this.currentPageIndex = 0;

        for (var key in templates) {
            this.pages.push(new PageView({
                content: templates[key]
            }));
        }

        var zIndex = this.pages.length;

        for (var x = 0; x < this.pages.length; x++) {
            this.mods.push(new Modifier({
                origin: [0, 0]
            }));

            this._add(this.mods[x]).add(this.pages[x]);

            this.pages[x].on('nextPage', function() {
                this._eventOutput.emit('nextPage');
            }.bind(this));

            // Gets event from slide transfers rotation to previous slide.
            this.pages[x].on('rotatePrevious', function(data) {
                if (this.currentPageIndex > 0) {
                    this.pages[this.currentPageIndex - 1].rotate(-data.radians);
                }

            }.bind(this));

            // Determines whether the previous slide will become current page or not
            this.pages[x].on('touchEndPrevious', function(data) {
                if (this.currentPageIndex > 0) {
                    this.pages[this.currentPageIndex - 1]._eventOutput.emit('end', data);
                    this._eventOutput.emit('prevPage');
                }
            }.bind(this));

            // Sets the zIndex so the page are stacked properly
            this.pages[x].setZIndex(zIndex);
            zIndex--;

            // Last flag disables page from turning.
            if (x == this.pages.length - 1) {
                this.pages[x].setOptions({
                    last: true,
                    classes: ["page", "last"]
                });
            }
        }

        /**
         * Event handler for a nextPage event. Increments pageIndex
         * @return {[type]} [description]
         */
        this.on('nextPage', function() {
            if (this.currentPageIndex < this.pages.length - 1) {
                this.currentPageIndex++;
            }
        }.bind(this));

        /**
         * Event handler for a prevPage event. Increments pageIndex
         * @return {[type]} [description]
         */
        this.on('prevPage', function() {
            if (this.currentPageIndex > 0) {
                this.currentPageIndex--;
            }
        }.bind(this));
    }

    /**
     * Manually triggers next page
     * @return {[type]} [description]
     */
    ContentView.prototype.nextPage = function() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.pages[this.currentPageIndex].turn();
            this._eventOutput.emit('nextPage');
        } else {
            this.pages[this.currentPageIndex].hop();
        }
    }

    /**
     * Manually triggers previous page
     * @return {[type]} [description]
     */
    ContentView.prototype.prevPage = function() {
        if (this.currentPageIndex > 0) {
            this._eventOutput.emit('prevPage');
            this.pages[this.currentPageIndex].turnBack();
        }
    }

    module.exports = ContentView;
});