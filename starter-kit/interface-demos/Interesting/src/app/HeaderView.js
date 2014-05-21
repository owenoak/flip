define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function HeaderView() {
        View.apply(this, arguments);

        _createHeader.call(this);
        _setListeners.call(this);
    }

    HeaderView.prototype = Object.create(View.prototype);
    HeaderView.prototype.constructor = HeaderView;

    function _createHeader() {
        var backgroundSurface = new Surface({
            size: [undefined, undefined],
            properties: {
                // coloring pink, but background should not be visible anyway when viewed at device screen size
                backgroundColor: 'rgb(236,73,137)'
            }
        });
        
		this.hamburgerSurface = new Surface({
			size: [53, undefined],
			content: '<img width="53" src="img/hamburger.png"/>'
		});

		this.titleSurface = new Surface({
			size: [267, undefined],
			content: '<img width="267" src="img/title.png"/>'
		});
		
		this.hamburgerModifier = new Modifier({
            transform: Transform.translate(0, 0, 1)
        });

		this.titleModifier = new Modifier({
			origin: [1, 0]
		});
		
		this._add(this.hamburgerModifier).add(this.hamburgerSurface);
        this._add(this.titleModifier).add(this.titleSurface);

        this._add(backgroundSurface);
    }
    
    function _setListeners() {
        this.hamburgerSurface.on('touchstart', function() {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('mousedown', function() {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('click', function() {
            this.hamburgerModifier.setOpacity(1);
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }

    module.exports = HeaderView;
});