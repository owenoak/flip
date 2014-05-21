define(function(require, exports, module) {
	var View         = require('famous/core/View');
	var Modifier     = require('famous/core/Modifier');
	var ViewSequence = require('famous/core/ViewSequence');
	var Scrollview   = require('famous/views/Scrollview');
	var TaskView     = require('views/TaskView');
	var EventHandler = require('famous/core/EventHandler');
	var RenderNode   = require('famous/core/RenderNode');
	var Task         = require('models/Task');
	var GenericSync  = require('famous/inputs/GenericSync');
	var MouseSync    = require('famous/inputs/MouseSync');

	GenericSync.register({mouse: MouseSync});

	function TaskListView(collection) {
		View.apply(this, arguments);

		this.collection = collection;

		var temp = false;

		this.collection.on('remove', function(task, collection, removalData) {
			this.taskViews[removalData.index].delete(function() {
				this.viewSequence.splice(removalData.index, 1);
			}.bind(this));
		}.bind(this));

		this.taskViews = [];

		this.scrollview = new Scrollview({
			margin: 100000
		});

		this.scrollview.sync = new GenericSync(['mouse', 'touch', 'scroll'], {direction: 1});
		this.scrollview._eventInput.pipe(this.scrollview.sync);
		this.scrollview.sync.pipe(this.scrollview._eventInput);


		this.viewSequence = new ViewSequence(this.taskViews);
		this.scrollview.sequenceFrom(this.viewSequence);
		this.setContent();

		this._eventInput.on('editTask', function(data) {
			this._eventOutput.emit('editTask', data);
		}.bind(this));

		this._add(this.scrollview);
	};

	TaskListView.prototype = Object.create(View.prototype);
	TaskListView.prototype.constructor = TaskListView;

	TaskListView.prototype.setContent = function() {
		var tasks = this.collection.models;
		var node = this.tasksSequence;
		for (var i = 0; i < tasks.length; i++) {
			temp = new TaskView(tasks[i]);
			temp.pipe(this.scrollview);
			temp.pipe(this._eventInput);

			this.taskViews.push(temp);
		}
	};

	module.exports = TaskListView;
});