define(function(require, exports, module) {
	// Famous Modules
	var View               = require('famous/core/View');
	var RenderNode         = require('famous/core/RenderNode')
	var Transform          = require('famous/core/Transform');
	var Surface            = require('famous/core/Surface');
	var Modifier           = require('famous/core/Modifier');
	var EventHandler       = require('famous/core/EventHandler');
	var ViewSequence       = require('famous/core/ViewSequence');
	var Transitionable     = require('famous/transitions/Transitionable');
	var Scrollview         = require('famous/views/Scrollview');
	var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
	var Utility            = require('famous/utilities/Utility');

	// Custom Views
	var HeaderView    = require('views/HeaderView');
	var EditTaskView  = require('views/EditTaskView');
	var SideView      = require('views/SideView');
	var TaskView      = require('views/TaskView');
	var TaskListView  = require('views/TaskListView');

	var Task          = require('models/Task');

	function AppView(model) {
		View.apply(this);

		this.model = model;

		// Create the mainTransforms for shifting the entire view over on menu open
		this.mainTransform = new Modifier({
		    transform: Transform.identity
		});

		this.mainTransitionable = new Transitionable(0);
		this.mainTransform.transformFrom(function() {
			return Transform.translate(this.mainTransitionable.get(), 0, 0);
		}.bind(this));

		// Create the SideView with category buttons for filtering tasks
		this.sideView = new SideView();

		// Create TaskListView based on the apps models
		this.taskListView = new TaskListView(this.model.get('tasks'));
		this.taskListView.pipe(this._eventInput);

		this._eventInput.on('editTask', function(task) {
			if (!this.sideView.open) {
				this.editTaskView.editTask(task);			
			}
		}.bind(this));

		this._eventInput.on('deleteTask', function(task) {
			this.model.get('tasks').remove(task);
		}.bind(this));

		// Tie the sideView and the taskList together
		this.mainNode = new RenderNode();
		this.mainNode.add(this.taskListView);
		this.mainNode.add(this.sideView);

		// Layout for specifically sized header and variable content
		this.layout = new HeaderFooterLayout({
			size: [undefined, undefined],
			headerSize: 50,
			footerSize: 1
		});

		// Create the HeaderView
		this.headerView = new HeaderView();
		this.headerView.pipe(this._eventInput);
		this._eventInput.on('menuToggle', this.menuToggle.bind(this))

		// Place the HeaderView and mainNode (containing the tasks and sidebar
		// inside of the header-footer-layout
		this.layout.header.add(this.headerView);
		this.layout.content.add(Utility.transformBehind).add(this.mainNode);

		// Create the EditTaskView
		this.editTaskView = new EditTaskView(new Task());
		this.editTaskView.pipe(this._eventInput);

		// Attach the EditTaskView and the HeaderFooterLayout to the same RenderNode
		this.comboNode = new RenderNode();
		this.comboNode.add(new Modifier({transform: Transform.translate(0,0,5)})).add(this.editTaskView);
		this.comboNode.add(this.layout);
		
		// Attach the main transform and the comboNode to the renderTree
		this._add(this.mainTransform).add(this.comboNode);

	};

	AppView.prototype = Object.create(View.prototype);
	AppView.prototype.constructor = AppView;

	var openTask = function(data) {
		this.editTaskView.editTask(data);
	};

	AppView.prototype.menuToggle = function() {
		if (!this.sideView.open) {
			this.mainTransitionable.set(100, { duration: 500, curve: 'easeOut' });
			this.sideView.flipOut();
		}
		else {
			this.mainTransitionable.set(0, { duration: 500, curve: 'easeOut' });
			this.sideView.flipIn();
		}
		this.sideView.open = !this.sideView.open;
	};

	module.exports = AppView;

});