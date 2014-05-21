define(function(require, exports, module) {
	module.exports = Backbone.Model.extend({
		defaults: {
			task: '',
			category: '',
			due: '',
			starred: false
		}
	});
});