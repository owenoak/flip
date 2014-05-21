define(function(require, exports, module) {
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var HeaderView  = require('app/HeaderView');
    var FooterView  = require('app/FooterView');
    var ContentView = require('app/ContentView');

    function AppView() {
        View.apply(this, arguments);
        _createLayoutView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    function _createLayoutView() {
        this.mainLayout = new HeaderFooterLayout();

        this.headerView = new HeaderView();
        this.contentView = new ContentView();
        this.footerView = new FooterView();

        this.mainLayout.header.add(this.headerView); // attach header
        this.mainLayout.content.add(this.contentView);
        this.mainLayout.footer.add(this.footerView); // attach footer

        this.footerView.on('click', function() {
            this.contentView.nextPage();
        }.bind(this));

        this.headerView.on('click', function() {
            this.contentView.prevPage();
        }.bind(this));
        
        this.add(this.mainLayout)
    }

    module.exports = AppView;
});