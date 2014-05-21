define(function(require, exports, module) {
	var defaultTasks = require('models/defaultTasks');
	var Tasks        = require('models/Tasks');

	module.exports = Backbone.Model.extend({
		initialize: function(params) {
			this.fetch();
		},

		fetch: function() {
			this.set('tasks', new Tasks(defaultTasks));
		}
	});
});