define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function MenuItemView(content) {
        View.apply(this, arguments);
        _addHeaderView.call(this, content.header);
        _addContentView.call(this, content.content);

        this.isLastPage = content.lastPage || false;
    }

    MenuItemView.prototype = Object.create(View.prototype);
    MenuItemView.prototype.constructor = MenuItemView;

    MenuItemView.DEFAULT_OPTIONS = {
    	headerHeight: 60,
    	contentHeight: 300,
    	footerHeight: 40
    };

    MenuItemView.prototype.getSize = function() {
        if (this.isLastPage) {
            return [undefined, undefined];
        } else {
    	    return [undefined, window.innerHeight - 80];
        }
    };

    function _addHeaderView(header) {
    	this.titleSurface = new Surface({
    		size: [undefined, this.options.headerHeight],
    		content: header,
            classes: ['headerTitle'],
            properties: {
                webkitUserSelect: 'none',
                userSelect: 'none'
            }
    	});

    	this.titleModifier = new Modifier({
    		origin: [0, 0]
    	});

        this.titleSurface.pipe(this._eventOutput);
    	this._add(this.titleModifier).add(this.titleSurface);
    }

    function _concatinateContent(contentArray) {
        var HTMLstring = "";	
        for (var i = 0; i < contentArray.length; i++) {
        	HTMLstring += '<p>' + contentArray[i] + '</p>';
        }
        return HTMLstring;
    }

    function _addContentView(content) {
    	this.contentSurface = new Surface({
    		size: [undefined, this.options.contentHeight],
    		content: _concatinateContent(content),
    		classes: ['menuContent'],
            properties: {
                webkitUserSelect: 'none',
                userSelect: 'none'
            }
    	});

    	this.contentModifier = new Modifier({
    		origin: [0, 0.5]
    	});

        this.contentSurface.pipe(this._eventOutput);
    	this._add(this.contentModifier).add(this.contentSurface);
    }

    module.exports = MenuItemView;
});

