define(['jquery', 'underscore', 'backbone', 'helpers/util', 'views/comps/loader'], function($, _, Backbone, Utils, LoaderView) {
    var BaseView = Backbone.View.extend({
        reset: function() {
            var view = this,
                $container = view.$container || view.$el;

            if ($container) {
                $container.empty();
                if ($container.hasClass('loading')) {
                    view.setLoading();
                }
            }

            if (_.isFunction(view.preRender)) {
                view.preRender();
            }

            return view;
        },
        set: function(type, enable, cfg) {
            var view = this,
                $container = view.$container || view.$el,
                typeView = view[type] || new LoaderView(cfg);

            if (!_.isBoolean(enable)) {
                enable = true;
            }

            if (enable) {
                $container.addClass('loading');
                $container.addClass(cfg && cfg.loadingCls);
                view.addContent(typeView);
                view[type] = typeView;
            } else {
                $container.removeClass('loading');
                $container.removeClass(typeView.loadingCls);
                typeView = typeView.remove();
                view[type] = null;
            }

            return view;
        },
        setLoading: function(enable, cfg) {
            var view = this;

            view.set('loading', enable, cfg);
        },
        setError: function(enable, cfg){
            var view= this;

            view.set('error', enable, _.extend(cfg || {}, {
                type : 'error'
            }));

            return view;
        },
        addContent: function(content){
            var view= this,
                $container = view.$container || view.$el;

            Utils.addContent($container, content);

            return view;
        },
        loadContent: function(content, cfg){
            var view = this;

            if(!cfg){
                view.reset();
            }

            view.addContent(content);

            return view;
        }
    });

    return BaseView;
});