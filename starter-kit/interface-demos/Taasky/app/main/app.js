var Surface = require('famous/surface');
var Modifier = require('famous/modifier');
var Transform = require('famous/transform');
var RenderNode = require('famous/render-node');
var View = require('famous/view');
var Scrollview = require('famous/views/scrollview');
var HeaderFooterLayout = require('famous/views/header-footer-layout');
var ViewSequence = require('famous/view-sequence');

var Utility = require('famous/utilities/utility');

var SideView = require('side-view');
var HeaderView = require('header-view');
var TaskView = require('task-view');
var EditTaskView = require('edit-task-view');
var NewTaskView = require('new-task-view');

var EdgePull = require('edge-pull');

var defaultTasks = require('./default-tasks');

function App() {
	View.apply(this, arguments);

	this.mainTransform = new Modifier({
	    transform: Transform.identity
	});

	this.sideToggle = true;
	this.sideView = new SideView();

	this.tasks = [];
	this.taskSequence = new ViewSequence(this.tasks)
	this.taskList = new Scrollview();
	this.taskList.sequenceFrom(this.taskSequence);
	loadExistingTasks.call(this);

	this.mainView = new View();
	this.mainView._add(this.taskList);
	this.mainView._add(this.sideView);

	this.layout = new HeaderFooterLayout({
		size: [undefined, undefined],
		headerSize: 50
	});

	this.headerView = new HeaderView();
	this.headerView.on('openSide', toggleSide.bind(this))

	this.layout.id["header"].link(this.headerView);
	this.layout.id["content"].link(Utility.transformBehind).link(this.mainView);

	this.editTaskView = new EditTaskView();
	this.editTaskView.on('closeEdit', closeEdit.bind(this))

	this.comboView = new View();
	this.comboView._add(this.editTaskView);
	this.comboView._add(this.layout);
	
	this._link(this.mainTransform).link(this.comboView);

	var edgePullModifier = new EdgePull();
    edgePullModifier.setEdgePositionGetter(function() {
        return -this.taskList.getPosition(1);
    }.bind(this));

    var edgeSurface = new NewTaskView();
    var edgeNode = new RenderNode(edgeSurface);
    edgeNode.modifiers.push(edgePullModifier);
    edgeNode.getSize = edgePullModifier.getSize.bind(edgePullModifier); //hack hack hack
    this.taskSequence.unshift(edgeNode);
};

App.prototype = Object.create(View.prototype);
App.prototype.constructor = App;

App.DEFAULT_OPTIONS = {};

var loadExistingTasks = function() {
	var task;
	for(var i = 0; i < defaultTasks.length; i++) {
		task = new TaskView(defaultTasks[i]);
		task.pipe(this.taskList);

		task.on('click', (function(i) {
			return function() {
				openTask.call(this, defaultTasks[i]);
			}.bind(this);
		}.bind(this))(i));

		this.tasks.push(task);
	}
};

var openTask = function(data) {
	console.log(data)
	this.editTaskView.editTask(data);
};

var toggleSide = function() {
	if (this.sideToggle) {
		this.mainTransform.setTransform(Transform.translate(60, 0, 0), { duration: 500, curve: 'easeOut' });
		this.sideView.flipOut();
	}
	else {
		this.mainTransform.setTransform(Transform.translate(0, 0, 0), { duration: 500, curve: 'easeOut' });
		this.sideView.flipIn();
	}
	this.sideToggle = !this.sideToggle;
};

var closeEdit = function() {
	console.log('we got it')
};

module.exports = App;