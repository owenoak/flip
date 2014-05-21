define(function(require, exports, module) {
	// Famous Modules
	var Surface          = require('famous/core/Surface');
	var Modifier         = require('famous/core/Modifier');
	var Transform        = require('famous/core/Transform');
	var View             = require('famous/core/View');
	var RenderNode       = require('famous/core/RenderNode');
	var Transitionable   = require('famous/transitions/Transitionable');
	var SequentialLayout = require('famous/views/SequentialLayout');
	var Utility          = require('famous/utilities/Utility');
	var InputSurface     = require('famous/surfaces/InputSurface');
	var KeyCodes         = require('famous/utilities/KeyCodes');

	function EditTaskView(model) {
		View.apply(this, arguments);

		this.model = model;
		this.bindModelEvents();

		this.categoryIndex = 0;
		this.categoryList = ['home', 'work', 'friends', 'shopping'];

		this.backing = new Surface({
			size: [undefined, undefined],
			classes: ["backing"],
			content: 's',
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
			this.flipClose();
		}.bind(this))

		this.editForm = new SequentialLayout({
			direction: Utility.Direction.Y,
			classes: ["form"]
		});
		buildContent.call(this);

		var formModifier = new Modifier({
			transform: Transform.translate(50, 0, 0)
		});

		var renderNode = new RenderNode();
		renderNode.add(formModifier).add(this.editForm);

		this.hingeTransitionable = new Transitionable(-Math.PI / 2);
		this.hinge = new Modifier();
		this.hinge.transformFrom(function() {
			return Transform.rotateY(this.hingeTransitionable.get())
		}.bind(this));

		this.layout = new RenderNode();
		this.layout.add(new Modifier({transform: Transform.translate(0, 0, -1)})).add(this.backing);
		this.layout.add(this.exitSurface);
		this.layout.add(renderNode);

		this._add(new Modifier({
			transform: Transform.translate(0, 0, 1),
		})).add(this.hinge).add(this.layout)
	};

	EditTaskView.prototype = Object.create(View.prototype);
	EditTaskView.prototype.constructor = EditTaskView;

	EditTaskView.prototype.editTask = function(task) {
		this.model = task;
		this.bindModelEvents();

		this.categoryIndex = this.categoryList.indexOf(this.model.get('category'));

		this.setContent();
		this.flipOpen();
	};

	EditTaskView.prototype.flipOpen = function() {
		this.hingeTransitionable.set(0, { duration: 500, curve: 'easeOut' });
	};

	EditTaskView.prototype.flipClose = function() {
		this.hingeTransitionable.set(-Math.PI/2, { duration: 500, curve: 'easeOut' });
	};

	EditTaskView.prototype.setContent = function() {
		this.setCategory();

		this.task.setValue(this.model.get('task'));

		this.due.setPlaceholder(this.model.get('due'))
		this.due.setValue(this.model.get('due'));

		this.reminder.setValue(this.model.get('reminder'));

		this.buttonContainer.removeClass("touch");
	};

	EditTaskView.prototype.setCategory = function() {
		this.topBar.setClasses(["form", "colorBar", this.model.get('category')]);
		this.category.setClasses(["form", "category", "category-" + this.model.get('category')]);
		this.category.setContent('<div class="dot">&#xf111;</div><div class="text">' + this.model.get('category') + '</div>');
	};

	EditTaskView.prototype.bindModelEvents = function() {
		this.model.on('change:category', function() {
			this.setCategory()
		}.bind(this));
	};

	var buildContent = function() {
		this.topBar = new Surface({
			size: [window.innerWidth - 50, 20],
			classes: ["form", "colorBar"]
		});

		this.task = new InputSurface({
			size: [window.innerWidth - 50, 100],
			classes: ["form"]
		});

		this.task.on('keypress', function(e) {
			var val = '';
			for (var key in KeyCodes) {
				if (KeyCodes[key] === e.charCode) {
					val = key;
					break;
				}
			}
			this.model.set('task', this.task.getValue() + val);
		}.bind(this));

		this.due = new InputSurface({
			size: [window.innerWidth - 50, 60],
			classes: ["form"],
			type: 'date'
		});

		this.reminder = new InputSurface({
			size: [window.innerWidth - 50, 60],
			classes: ["form"],
			type: 'datetime-local'
		});

		this.category = new Surface({
			size: [window.innerWidth - 50, 60],
			classes: ["form", "category"],
		});
		this.category.on('click', function() {
			this.categoryIndex = (this.categoryIndex + 1) % 4;
			this.model.set('category', this.categoryList[this.categoryIndex]);
		}.bind(this));

		this.buttonContainer = new Surface({
			size: [window.innerWidth - 50, 100],
			classes: ["form", "deleteContainer"],
			content: '<div class="deleteButton">DELETE</div>'
		});

		this.buttonContainer.on('touchstart', function() {
			this.buttonContainer.addClass("touch");
		}.bind(this));

		this.buttonContainer.on('mouseenter', function() {
			this.buttonContainer.addClass("touch");
		}.bind(this));

		this.buttonContainer.on('mouseleave', function() {
			this.buttonContainer.removeClass("touch");
		}.bind(this));

		this.buttonContainer.on('click', function() {
			this._eventOutput.emit('deleteTask', this.model);
			this.flipClose();
		}.bind(this));

		this.editForm.sequenceFrom([this.topBar, this.task, this.due, this.reminder, this.category, this.buttonContainer]);
	}

	var _template = function() {
		var left = '<div class="exit-back">&#xf060;</div>';
		var right = '<div class="exit-form">' + 'hello world' +
		'</div>';
		return '<div class="exit">' + left + right +'</div>'
	}

	module.exports = EditTaskView;
});