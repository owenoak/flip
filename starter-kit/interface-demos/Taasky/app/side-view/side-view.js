var Surface = require('famous/surface');
var Modifier = require('famous/modifier');
var Transform = require('famous/transform');
var View = require('famous/view');
var SequentialLayout = require('famous/views/sequential-layout');
var Utility = require('famous/utilities/utility');

function SideView() {
	View.apply(this, arguments);

	this.categories = [
		{
			name: 'all',
			icon: '&#xf01c;'
		},
		{
			name: 'home',
			icon: '&#xf015;'
		},
		{
			name: 'work',
			icon: '&#xf0b1;'
		},
		{
			name: 'friends',
			icon: '&#xf0c0;'
		},
		{
			name: 'shopping',
			icon: '&#xf07a;'
		},
		{
			name: 'settings',
			icon: '&#xf013;'
		}
	];

	this.hinge = new Modifier({
	    transform: Transform.move(Transform.rotateY(-Math.PI/3), [-60, 0, 0])
	});

	this.layout = new SequentialLayout({
		direction: Utility.Direction.Y
	});

	this.buttons = [];
	this.layout.sequenceFrom(this.buttons);

	createButtons.call(this);

	this._link(new Modifier({size : [60, undefined]})).link(new Modifier({origin : [1,0]})).link(this.hinge).link(this.layout);
};

SideView.prototype = Object.create(View.prototype);
SideView.prototype.constructor = SideView;

SideView.DEFAULT_OPTIONS = {};

SideView.prototype.flipOut = function() {
	this.hinge.setTransform(Transform.translate(-60, 0, 0), { duration: 500, curve: 'easeOut' });
};

SideView.prototype.flipIn = function() {
	this.hinge.setTransform(Transform.move(Transform.rotateY(-Math.PI/3), [-60, 0, 0]), { duration: 500, curve: 'easeOut' });
};

var createButtons = function() {
	for(var i = 0; i < this.categories.length; i++) {
		this.buttons.push(new Surface({
		    size: [60, 60],
		    content: this.categories[i]['icon'],
		    classes: ["fa", "side-view-button", this.categories[i]["name"]],
		    properties: {
		    	lineHeight: '60px'
		    }
		}));
	}
};

module.exports = SideView;