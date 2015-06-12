var SylAppView;
define(['jquery', 'underscore', 'backbone', 'views/viewport', 'configs/viewport', 'routers/app', 'routers/home'], function($, _, Backbone, ViewPort, ViewPortConfig, AppRouter, HomeRouter){
    // console.log('Hello World');

    SylAppView = ViewPort(ViewPortConfig);

    /*SylAppView.setLoading(true, {
        title : 'Loading Awesomeness!!'
    });*/

    // Init the application router
    AppRouter.init();

    // Start Navigation
    Backbone.history.start();
});