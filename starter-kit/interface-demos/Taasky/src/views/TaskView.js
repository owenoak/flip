define(function(require, exports, module) {
	var Surface          = require('famous/core/Surface');
	var Modifier         = require('famous/core/Modifier');
	var Transform        = require('famous/core/Transform');
	var View             = require('famous/core/View');
	var SequentialLayout = require('famous/views/SequentialLayout');
	var Utility          = require('famous/utilities/Utility');
	var Transitionable   = require('famous/transitions/Transitionable');

	function TaskView(model) {
		View.apply(this);

		this.model = model;

		this.model.on('change', function() {
			this.setContent();
		}, this);

		this.transform = new Transitionable([0, 0, 0]);
		this.size = new Transitionable(100);

		this.taskModifier = new Modifier();
		this.taskModifier.transformFrom(function() {
			var currentValue = this.transform.get();
			return Transform.translate(currentValue[0], currentValue[1], currentValue[2]);
		}.bind(this));

		this.taskModifier.sizeFrom(this.getSize());

		this.taskSurface = new Surface({
			size: [undefined, 100]
		});
		this.setContent();
		this.taskSurface.pipe(this._eventOutput);

		this.taskSurface.on('click', function() {
			this._eventOutput.emit('editTask', this.model);
		}.bind(this));

		this._add(this.taskModifier).add(this.taskSurface);
	}

	TaskView.prototype = Object.create(View.prototype);
	TaskView.prototype.constructor = TaskView;

	TaskView.prototype.getSize = function() {
		return [undefined, this.size.get()];
	};

	TaskView.prototype.setContent = function() {
		this.taskSurface.setContent(template.call(this));
	};

	TaskView.prototype.delete = function(cb) {
		this.transform.set([window.innerWidth + 100, 0, 0], {duration: 1000, curve: 'easeInOut'}, function() {
			this.size.set(0, {duration: 300, curve: 'easeOut'}, function() {
				cb();
				this._eventOutput.emit('closed');
			}.bind(this));
		}.bind(this));
	};

	var template = function() {
		var due = this.model.get('due') ? "due" : "";
		return "<div class='task " + this.model.get('category') + "'>" + 
		"<div class='checkbox'>&#xf10c;</div>" + 
		"<div class='taskData " + due + "'>" + this.model.get("task") + "</div>" +
		"</div>";
	};

module.exports = TaskView;
});