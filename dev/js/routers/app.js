define(['jquery', 'underscore', 'backbone', 'helpers/util', 'configs/routes', 'views/index', 'views/pagecomps/header', 'views/pages/error', 'views/pages/404'], function($, _, Backbone, Utils, Routes, IndexView, HeaderView, ErrorPage, NotFoundPage) {
    var hasInit = false;
    var AppRouter = Backbone.Router.extend({
        currentView: null,
        routerUrlHashes: [],
        beforeLoadFns: [],
        initialize: function() {
            var router = this,
                rootRoute = Routes.root;

            router.route(/(.*?)/, router.invalidPathHandler);
            router.route('', _.partial(router.loadView, rootRoute));

            return router;
        },
        init: function() {
            if (!hasInit) {
                //Append Header
                SylAppView.loadContent(HeaderView);
                //Append Index View
                SylAppView.loadContent(IndexView, true);

                //Append Footer
            }
        },
        execBeforeSwitchFns: function() {
            var router = this,
                fns = router.beforeLoadFns;

            _.each(fns, function(fn) {
                if (_.isFunction(fn)) fn();
            });
            router.beforeLoadFns = [];
        },
        getPreviousHash: function() {
            var router = this,
                routerUrlHashes = router.routerUrlHashes,
                routerUrlHashesLen = routerUrlHashes.length;

            return routerUrlHashes[routerUrlHashesLen - 2];
        },
        storeHash: function() {
            var router = this;

            router.routerUrlHashes.push(Backbone.history.fragment);
        },
        getCurrentLoadedView: function() {
            var router = this;

            return router.currentView;
        },
        loadView: function(view, action) {
            var router = this,
                currentView = router.currentView;

            router.storeHash();

            router.execBeforeSwitchFns();

            if (typeof view === 'string') {
                router.navigate(view, {
                    trigger: true
                });
                return;
            }

            if (!currentView || currentView.cid !== view.cid) {
                IndexView.loadPage(view);
                router.currentView = view;
            }

            if (_.isFunction(view.switchToAction)) {
                view.switchToAction(action);
            }
        },
        loadCanvasContent: function(c) {
            IndexView.loadCanvasContent(c);
        },
        showError: function(errorPage) {
            var router = this;

            if (errorPage) {
                if (!(errorPage instanceof Backbone.View)) {
                    errorPage = new ErrorPage(errorPage);
                }

                router.loadView(errorPage);
                Utils.navigate(Routes.error, false);
            }
        },
        invalidPathHandler: function(cfg) {
            var router = this;

            console.log("ErrorPage");
            // router.showError(new NotFoundPage(cfg));
        }
    });

    return new AppRouter();
});