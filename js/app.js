/**
 * Created by User: nikulinsanya
 * Collect the backbone of WEB-Application.
 */
(function($){


    /////////////////////////////////////////////
    //Models
    /////////////////////////////////////////////
    var User = Backbone.Model.extend({
        defaults:
        {
            phone: ""
        },
        validate: function (attrs)
        {
            if (attrs.phone.length<3)
            {
                //return 'err';
            }
        }
    });
    /*
     Model uses to store/restore data to localStorage
     */
    var Storage = Backbone.Model.extend({
        store: function(data,name)
        {
            var u = JSON.stringify(model);
            if (Modernizr.localstorage)
            {
                localStorage.setItem(name,u);
            }
        },
        restore: function(name)
        {
            if (Modernizr.localstorage && localStorage.getItem(name))
            {
                var m = localStorage.getItem(name);
                m = !!m ? JSON.parse(m): {};
                if (!$.isEmptyObject(m))
                {
                    return m
                }
            }
        }
    });


    /////////////////////////////////////////////
    //Views
    /////////////////////////////////////////////

    var Views = { };

    var Index = Backbone.View.extend({
        el: $("#contentholder"), // DOM element of widget

        template: _.template($('#index').html()),

        events:
        {
            "click input": "check"
        },

        check: function ()
        {
            var phone = $(this.el).find("#phone-input").val();
            if (phone.length > 5) //simple validation
            {
                app_controller.user.set('phone',phone);
                alert(app_controller.user.get('phone'))
                return false;
            }
            else
            {
                app_controller.navigate("error", true);
                return false;
            }
        },

        render: function ()
        {
            $(this.el).html(this.template());
        }
    });

    var Error = Backbone.View.extend({
        el: $("#contentholder"), // DOM element of widget

        template: _.template($('#error').html()),

        render: function () {
            $(this.el).html(this.template());
        }
    });

    Views =
    {
        index: new Index(),
        error: new Error()
    };

    /////////////////////////////////////////////
    //Controller
    /////////////////////////////////////////////
    var AppController = Backbone.Router.extend({

        initialize: function(params)
        {
            //init models
            this.user = new User();
            this.storage = new Storage();
        },

        routes: {
            ""     : "index", // empty hash
            "index": "index", // main page
            "error": "error" // Error block
        },

        index: function () {
            if (Views.index != null)
            {
                Views.index.render();
            }
        },
        error: function () {
            if (Views.error != null)
            {
                Views.error.render();
            }
        }
    });
    //init controller
    var app_controller = new AppController();
    window.app = app_controller;
    Backbone.history.start();
    //for old browsers
    if (!Modernizr.geolocation && !Modernizr.localstorage)
    {
        alert('You should use more modern browser to enjoy GetTaxi');
    }
})(jQuery);