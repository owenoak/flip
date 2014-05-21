var Surface = require('famous/surface');
var Modifier = require('famous/modifier');
var Transform = require('famous/transform');
var View = require('famous/view');
var SequentialLayout = require('famous/views/sequential-layout');
var Utility = require('famous/utilities/utility');

function TaskView(data) {
	View.apply(this, arguments);

	this.data = data;

	this.taskSurface = new Surface({
		size: [undefined, 100]
	});
	this.taskSurface.setContent(template.call(this));
	this.taskSurface.pipe(this.eventOutput);

	this._add(this.taskSurface);
};

TaskView.prototype = Object.create(View.prototype);
TaskView.prototype.constructor = TaskView;

TaskView.DEFAULT_OPTIONS = {};

TaskView.prototype.getSize = function() {
	return [undefined, 100]
};

var template = function() {
	var due = this.data['due'] ? "due" : "";
	return "<div class='task " + this.data['category'] + "'>" + 
	"<div class='checkbox'>&#xf10c;</div>" + 
	"<div class='taskData " + due + "'>" + this.data["task"] + "</div>" +
	"</div>";
};

module.exports = TaskView;