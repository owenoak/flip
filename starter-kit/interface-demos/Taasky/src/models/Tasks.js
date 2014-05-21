define(function(require, exports, module) {
	var Task = require('models/Task');

	module.exports = Backbone.Collection.extend({
		model: Task
	});
});