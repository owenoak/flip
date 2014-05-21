define(function(require, exports, module) {

    var View                = require('main/helpers/view'),
        StartView           = require('main/views/start/start-view');




    /*  -----------------------------------------------------------------------------------------

        Name:       AppView

                    This is the primary view that gets added to the famous context. It holds the
                    startView, which acts as the display manager for all the other views and
                    controls how they transition in and out of the display area.


        Authors:    Larry Robinson

        Notes:      Uses View.extend to make things cleaner. (read comments in helpers/view.js)

                    At first glance this view feels like an extra layer (why not just start with
                    startView) but it exists for several reasons:

                    (1) Allows us to decide how we want to handle window resize and orientation
                    at a root level. Should allow for some neat tricks although for now we are
                    just letting startView deal with it.

                    (2) If we wanted to put any visual sugar around our application (like an image
                    of a phone or whateever else it could be done here.)


        ---------------------------------------------------------------------------------------*/

    var AppView =  View.extend({


        surfaces: {

        },

        events:{
        },

        initialize : function(){

            //put any code here that should run before anything else in the app gets started
        },

        onReady: function(){

            // Create a start view
            this.startView  = new StartView();

            // Add it to this view which gets things rolling on the display
            this.addView(this.startView);

            // That's all! appView doesn't do much else right now!

        },



    });

    module.exports = AppView;

});






