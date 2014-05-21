var Surface = require('famous/surface');
var Modifier = require('famous/modifier');
var Transform = require('famous/transform');
var View = require('famous/view');
var Utility = require('famous/utilities/utility');
var Scene = require('famous/scene');

function HeaderView() {
	View.apply(this, arguments);

	this.scene = new Scene({
        id: 'header',
        opacity: 1,
        target: [
            {
            	origin: [.02, 0],
                target: {id: 'hamburger'}
            },
            {
                origin: [0.5, 0],
                target: {id: 'title'}
            },
            {
            	origin: [.9, 0],
            	target: {id: 'other'}
            },
            {
            	target: {id: 'backing'}
            }
        ]
    });

	this.hamburger = new Surface({
		size: [true, 50],
		content: "&#xf0c9;",
		classes: ["headerIcon"],
		properties: {
			lineHeight: "50px"
		}
	});

	this.hamburger.on('touchstart', function() {
		this.eventOutput.emit('openSide')
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

	this.scene.id['hamburger'].link(this.hamburger);
	this.scene.id['title'].link(this.title);
	this.scene.id['other'].link(this.other);

	this._link(Utility.transformInFront).add(this.scene);
};

HeaderView.prototype = Object.create(View.prototype);
HeaderView.prototype.constructor = HeaderView;

HeaderView.DEFAULT_OPTIONS = {};

module.exports = HeaderView;