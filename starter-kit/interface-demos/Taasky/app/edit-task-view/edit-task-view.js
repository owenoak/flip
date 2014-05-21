var Surface = require('famous/surface');
var Modifier = require('famous/modifier');
var Transform = require('famous/transform');
var View = require('famous/view');
var RenderNode = require('famous/render-node')
var SequentialLayout = require('famous/views/sequential-layout');
var Utility = require('famous/utilities/utility');
var InputSurface = require('famous/surfaces/input-surface');

function EditTaskView() {
	View.apply(this, arguments);

	this.data = {
		task: 'Railroad Earth concert',
		category: 'friends',
		due: 'Thur, March 13',
		starred: false
	};

	this.backing = new Surface({
		size: [undefined, undefined],
		classes: ["backing"],
		properties: {
			backgroundColor: "rgba(77, 89, 102, 1)"
		}
	});

	this.exitSurface = new Surface({
		size: [50, undefined],
		content: "&#xf060;",
		classes: ["previous"],
		properties: {
			backgroundColor: "black"
		}
	});
	this.exitSurface.on('click', function() {
		this.close();
	}.bind(this));

	this.editForm = new SequentialLayout({
		direction: Utility.Direction.Y,
		classes: ["form"]
	});
	buildContent.call(this);

	var formModifier = new Modifier({
		transform: Transform.translate(50, 0, 0)
	});

	var renderNode = new RenderNode();
	renderNode.link(formModifier).link(this.editForm);

	this.hinge = new Modifier({
	    transform: Transform.rotateY(-Math.PI / 2)
	});

	this.layout = new RenderNode();
	this.layout.add(this.backing);
	this.layout.add(this.exitSurface);
	this.layout.add(renderNode);

	this._link(new Modifier({size : [window.innerWidth, window.innerHeight]})).link(this.hinge).link(this.layout)
	// this._link(new Modifier({size : [window.innerWidth, window.innerHeight]})).link(new Modifier({origin : [1,0]})).link(this.hinge).link(this.layout);
};

EditTaskView.prototype = Object.create(View.prototype);
EditTaskView.prototype.constructor = EditTaskView;

EditTaskView.DEFAULT_OPTIONS = {};

EditTaskView.prototype.getSize = function() {
	return [undefined, undefined];
};

EditTaskView.prototype.editTask = function(data) {
	this.data = data;
	buildContent.call(this);
	this.hinge.setTransform(Transform.rotateY(0), { duration: 500, curve: 'easeOut' });
};

EditTaskView.prototype.close = function() {
	this.hinge.setTransform(Transform.rotateY(-Math.PI/2), { duration: 500, curve: 'easeOut' });
};


var buildContent = function() {
	console.log(this.data)
	var topBar = new Surface({
		size: [window.innerWidth - 50, 20],
		classes: ["form", "colorBar", this.data.category]
	});

	console.log(this.data.task)
	var task = new InputSurface({
		size: [window.innerWidth - 50, 100],
		classes: ["form"],
		value: this.data.task
	});

	var due = new InputSurface({
		size: [window.innerWidth - 50, 60],
		classes: ["form"],
		type: 'date'
	});

	var reminder = new InputSurface({
		size: [window.innerWidth - 50, 60],
		classes: ["form"],
		type: 'datetime-local'
	});

	var category = new Surface({
		size: [window.innerWidth - 50, 60],
		classes: ["form", "category", "category-" + this.data.category],
		content: '<div class="dot">&#xf111;</div><div class="text">' + this.data.category + '</div>'
	});
	var buttonContainer = new Surface({
		size: [window.innerWidth - 50, 100],
		classes: ["form", "deleteContainer"],
		content: '<div class="deleteButton">DELETE TASK</div>'
	});

	buttonContainer.on('touchstart', function() {
		this.addClass("touch")
	}.bind(buttonContainer));

	buttonContainer.on('touchend', function() {
		console.log('delete')
	}.bind(buttonContainer));

	this.editForm.sequenceFrom([topBar, task, due, reminder, category, buttonContainer]);
};

module.exports = EditTaskView;