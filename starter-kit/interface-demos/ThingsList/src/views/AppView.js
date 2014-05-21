define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');
    var ContainerSurface = require("famous/surfaces/ContainerSurface");

    var MenuBarView     = require('views/MenuBarView');
    var FilterView      = require('views/FilterView');
    var ListView        = require('views/ListView');
    var ListView        = require('views/ListView');
    var PlusView        = require('views/PlusView');

    function AppView() {
        View.apply(this, arguments);

        _createMenuBarView.call(this);
        _createFilterView.call(this);
        _createListContainerView.call(this);
        _createPlusView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    var height = window.innerHeight;
    AppView.DEFAULT_OPTIONS = {
        transition: {
            duration: 300,
            curve: 'easeInOut'
        },
        height: height
    };

    function _createMenuBarView() {
        this.menuBarView = new MenuBarView();
        this.menuBarView.on('filterViewToggle', this.toggleFilterView.bind(this));

        this.menuMod = new Modifier({
            transform: Transform.translate(0, 0, 1)
        });
        this._add(this.menuMod).add(this.menuBarView);
    }

    function _createFilterView() {
        this.filterView = new FilterView({
            duration: this.options.transition.duration
        });
        this._add(this.filterView);
    }

    function _createListView() {
        this.listView = new ListView();
        this._add(this.listMod).add(this.listView);
    }

    function _createListContainerView() {

        this.listContainerView = new ContainerSurface({
            size: [undefined, undefined],
            properties: {
                overflow: 'hidden'
            }
        });
        this.listContainerMod = new Modifier({
            transform: Transform.translate(0,44,0)
        });

        this.listView = new ListView();
        this.listMod = new Modifier();

        this.listContainerView.add(this.listMod).add( this.listView);
        this._add(this.listContainerMod).add(this.listContainerView);
    }

    function _createPlusView(){
        this.plusView = new PlusView();
        this.plusMod = new Modifier({
            origin: [0.5, 0.95],
            transform: Transform.translate(0, 0, 2),
            properties: {
                'opacity':1
            }
        });
        this._add(this.plusMod).add(this.plusView);
    }

    AppView.prototype.toggleFilterView = function() {
        if(this.menuBarView.filterViewSelected) {
            this.slideFilterDown();
        } else {
            this.slideFilterUp();
        }
    }

    AppView.prototype.slideFilterUp = function() {
        this.listContainerMod.setTransform(Transform.translate(0, 44, 0), this.options.transition);
        this.plusMod.setOpacity(1, this.options.transition);
    }

    AppView.prototype.slideFilterDown = function() {
        this.listContainerMod.setTransform(Transform.translate(0, this.options.height, 0), this.options.transition);
        this.plusMod.setOpacity(0, this.options.transition);
        this.filterView.animate();
    }

    module.exports = AppView;
});