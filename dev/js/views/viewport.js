define(['jquery', 'underscore', 'backbone', 'configs/viewport', 'views/pagecomps/base'], function($, _, Backbone, Configs, BaseView) {
    var viewPort;

    return function(cfg) {
        var tmpView,
            renderTo,
            className,
            containerClassName,
            styles,
            containerStyles,
            afterRenderFn,
            viewCfg = {},
            defaultCfg = {
                // className: 'container-fluid',
                styles: {
                    minHeight: 400,
                },
                containerStyles: {
                    minHeight: $(window).height()
                }
            };

        if (viewPort) {
            return viewPort;
        }

        $.extend(true, defaultCfg, cfg);
        cfg = defaultCfg;

        if ($.isPlainObject(cfg)) {
            if (cfg.renderTo) {
                viewCfg.el = $(cfg.renderTo)[0];
            }

            renderTo = cfg.renderTo;
            className = cfg.className;
            containerClassName = cfg.containerClassName;
            styles = cfg.styles;
            containerStyles = cfg.containerStyles;
            afterRenderFn = cfg.afterRenderFn;
        }

        viewCfg.initialize = function() {
            var view = this;

            if ($.isPlainObject(styles)) {
                view.$el.css(styles);
            }

            view.render();

            return view;
        };

        viewCfg.render = function() {
            var view = this;

            view.$el.addClass(className);

            // append the container
            view.$container = $('<div class="' + cfg.viewportClass + '" />');
            view.$container.addClass(containerClassName);
            view.$el.append(view.$container);

            // apply container styles
            if ($.isPlainObject(containerStyles)) {
                view.$container.css(containerStyles);
            }

            // call after render function
            if ($.isFunction(afterRenderFn)) {
                afterRenderFn.call(view, view);
            }

            return view;
        };

        tmpView = BaseView.extend(viewCfg);
        viewPort = new tmpView();

        return viewPort;
    };
});