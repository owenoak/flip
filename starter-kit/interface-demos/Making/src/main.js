define(function(require, exports, module) {
        var Engine = require('famous/core/Engine');
        var Surface = require('famous/core/Surface');
        var AppView = require('app/AppView');

        var mainContext = Engine.createContext();
        var appView = new AppView();

        mainContext.add(appView);

        mainContext.setPerspective(500);
});
    