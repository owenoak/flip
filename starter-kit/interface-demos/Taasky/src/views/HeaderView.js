define(function(require, exports, module) {
	// Famous Modules
	var Surface   = require('famous/core/Surface');
	var Modifier  = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var View      = require('famous/core/View');
	var Scene     = require('famous/core/Scene');
	var Utility   = require('famous/utilities/Utility');

	function HeaderView() {
		View.apply(this, arguments);

		this.hamburger = new Surface({
			size: [true, 50],
			content: "&#xf0c9;",
			classes: ["headerIcon"],
			properties: {
				lineHeight: "50px"
			}
		});

		this.hamburger.on('click', function() {
			this._eventOutput.emit('menuToggle');
		}.bind(this));

		this.title = new Surface({
			size: [undefined, 50],
			content: 'All Tasks',
			properties: {
				textAlign: 'center',
				fontSize: '20px',
				lineHeight: '50px',
				backgroundColor: 'black'
			}
		});

		this.other = new Surface({
			size: [true, 50],
			content: "&#xf055;",
			classes: ["headerIcon"],
			properties: {
				lineHeight: "50px"
			}
		});

		this.test = new View();
		this.test._add(new Modifier({
			transform: Transform.translate(15, 0, 0),
			origin: [0, 0]
		})).add(this.hamburger);

		this.test._add(new Modifier({
			origin: [0.5, 0]
		})).add(this.title);

		this.test._add(new Modifier({
			transform: Transform.translate(-40, 0, 0),
			origin: [1, 0]
		})).add(this.other);

		this._add(Utility.transformInFront).add(this.test);
	};

	HeaderView.prototype = Object.create(View.prototype);
	HeaderView.prototype.constructor = HeaderView;

	module.exports = HeaderView;
});