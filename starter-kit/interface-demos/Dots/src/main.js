define(function(require, exports, module) {



    /*-----------------------------------------------------------------------------------------

        Each module you create must require any of the famous modules, third party libraries or
        other modules that this module depends on.

    -------------------------------------------------------------------------------------------*/
    var Engine              = require('famous/core/Engine'),
        AppView             = require('main/views/app/app-view');




    /*-----------------------------------------------------------------------------------------

        Everything in Famous must be placed in at least one context. In this application we
        have a single context

    -------------------------------------------------------------------------------------------*/
    var mainContext = Engine.createContext();



    /*-----------------------------------------------------------------------------------------

        Create an AppView instance which holds all our other views.

    -------------------------------------------------------------------------------------------*/


    var appView     = new AppView();


    /*-----------------------------------------------------------------------------------------

        Add the appView instance to our main context. Famous detects the addition of any
        renderables in the appView and automatically begins rendering our content. Proceed to
        main/views/app/app-view.js to follow the program flow.

    ------------------------------------------------------------------------------------------*/
    mainContext.add(appView);


});