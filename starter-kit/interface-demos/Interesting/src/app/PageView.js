define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var HeaderView      = require('app/HeaderView');

    function PageView() {
        View.apply(this, arguments);

        this.layout = new HeaderFooterLayout({
            headerSize: 50
        });

        this.header = new HeaderView();
        this.header.pipe(this);

        this.content = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundImage: 'url(img/body.png)',
                backgroundSize: 'cover'
            }
        });
        this.content.pipe(this);

        this.layout.header.add(this.header);
        this.layout.content.add(this.content);

        this._eventInput.pipe(this._eventOutput);

        this.add(this.layout);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    module.exports = PageView;
});