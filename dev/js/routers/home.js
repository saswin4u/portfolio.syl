define(['jquery', 'underscore', 'backbone', 'configs/routes', 'routers/app', 'views/pages/home'], function($, _, Backbone, Routes, AppRouter, HomePage){
    var HomeRouter = Backbone.Router.extend({
        initialize: function(){
            var router = this,
                homeRoutes = Routes.map['home'];

            _.each(homeRoutes, function(v, r){
                router.route(r, _.partial(router.loadView, v, r));
            });

            return router;
        },
        loadView: function(action, url){
            AppRouter.loadView(HomePage, action);
        }
    });

    return new HomeRouter();
});