define(function(require, exports, module) {
	var Engine = require('famous/core/Engine');
	var AppView = require('views/AppView');

	var mainContext = Engine.createContext();

	var appView = new AppView();

	var test = navigator.userAgent.toLowerCase();
	if (test.indexOf("android") > -1) {
		mainContext.setPerspective(1000);
	}

	mainContext.add(appView);
});