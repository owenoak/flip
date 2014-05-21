var Surface = require('famous/surface');
var Modifier = require('famous/modifier');
var Transform = require('famous/transform');
var View = require('famous/view');
var RenderNode = require('famous/render-node')
var SequentialLayout = require('famous/views/sequential-layout');
var Utility = require('famous/utilities/utility');
var InputSurface = require('famous/surfaces/input-surface');

function NewTaskView() {
	View.apply(this, arguments);


	this.form = new Surface({
		size: [undefined, 200],
		properties: {
            'backgroundColor': 'rgba(51, 57, 72, 1)',
            'color': '#fff'
        },
        content: template()
	});

	this._add(this.form);
};

NewTaskView.prototype = Object.create(View.prototype);
NewTaskView.prototype.constructor = NewTaskView;

NewTaskView.DEFAULT_OPTIONS = {};

NewTaskView.prototype.getSize = function() {
	return [undefined, 200];
};

var template = function() {
	return "<input name='task' class='newTask'></input>" +
	"<div class='bottom'>" +
	"<div class='fontIcon newDue'>&#xf073;</div>" +
	"<div class='fontIcon newReminder'>&#xf017;</div>" +
	"<div class='newCategory'><div class='newDot'>&#xf111;</div>Friends<div>" +
	"</div>";
};

module.exports = NewTaskView;