define(function(require, exports, module) {
    // import dependencies
    var Engine  = require('famous/core/Engine');
    var App = require('app/App');
   
    // create the main context
    var mainContext = Engine.createContext();
    
    var app = new App();
    mainContext.add(app);
    // mainContext.setPerspective(1000);      

});
