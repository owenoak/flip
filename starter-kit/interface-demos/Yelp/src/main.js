define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var AppView = require('app/AppView');
    var GenericSync        = require('famous/inputs/GenericSync');
    var MouseSync          = require('famous/inputs/MouseSync');
    require('famous/inputs/FastClick');
    window._isMobile = function() {
        return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) );
    }; 

    GenericSync.register(MouseSync);
   
    // create the main context
    var mainContext = Engine.createContext();
    
    // your app here
    var appView = new AppView();

    mainContext.add(appView);
    mainContext.setPerspective(1000);

});
