define(function(require, exports, module) {
	var View      = require('famous/core/View');
	var Surface   = require('famous/core/Surface');
	var Modifier  = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');

	var PlusView = function(){
	  View.apply(this, arguments);

	  _createPlus.call(this);
	};

	PlusView.prototype = Object.create(View.prototype);
	PlusView.prototype.constructor = PlusView;

	PlusView.DEFAULT_OPTIONS = {};

	var _createPlus = function(){
	  var plusSurf = new Surface({
	    size: [window.innerHeight / 8, window.innerHeight / 8],
	    content: '<img height='+window.innerHeight / 8+' width'+window.innerHeight / 8+' src="./img/list-add-icon.png"/>'
	  });

	  this._add(plusSurf);
	};

	module.exports = PlusView;
});