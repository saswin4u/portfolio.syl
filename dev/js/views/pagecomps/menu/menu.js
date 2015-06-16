define(['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'models/menu', 'views/pagecomps/menu/nav'], function($, _, Backbone, BaseView, MenuModel, NavView) {
    var MenuView = BaseView.extend({
        tagName: 'div',
        className: 'menu-wrap',
        model: MenuModel,
        initialize: function(cfg) {
            var view = this;

            if (cfg) {

            }

            view.$container = view.$el;

            //Wrap everything
            view.$menuContent = $('<div class="menu-content" />');
            //Container Wrapper
            view.$container = $('<div class="container" />');
            //Content wrapper
            view.$row = $('<div class="row" />');
            //Navigation wrapper
            view.$nav = $('<div class="navigation" />');
            //Close Button
            view.$closeEl = $('<span class="close-menu fa fa-close" id="close-button"></span>');
            //Nav Logo
            view.$navLogo = $('<div class="menu-logo hidden-xs"><img src="dist/img/logo_white.png" data-at2x="dist/img/logo_white@2x.png" alt="logo"></div>');
            //Menu Wrapper
            view.$elAll = $('<div class="col-md-8 col-md-offset-2 col-xs-12" />');
            //Menu 2 columns
            view.$elMenu = $('<div class="col-md-6 col-sm-6" />');
            view.$elContact = $('<div class="col-md-6 col-sm-6 hidden-xs" />');

            view.listenTo(view.model, 'sync', view.render);
            view.listenTo(view.model, 'model', view.onError);

            view.load();

            return view;
        },
        load: function() {
            var view = this,
                model = view.model;

            view.setLoading(true);

            model && model.fetch();
        },
        preRender: function() {
            var view = this;

            view.$elAll.append(view.$elMenu)
                .append(view.$elContact);

            view.$nav.append(view.$closeEl)
                .append(view.$navLogo);

            view.$row.append(view.$nav)
                .append(view.$elAll);

            view.$container.append(view.$row);

            view.$menuContent.append(view.$container);

            //Finall append everything
            view.$el.append(view.$menuContent);

        },
        onError: function() {
            console.log('Errored out Bitch!!');
        },
        render: function() {
            var view = this,
                nav = new NavView({
                    model: view.model
                });

            view.preRender();

            view.setLoading(false);

            // nav.model = view.model;
            view.$elMenu.append(nav.$el);

            return view;
        }
    });

    return new MenuView();
});