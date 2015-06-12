define(['jquery', 'underscore', 'helpers/util', 'views/pagecomps/base'], function($, _, Utils, BaseView) {
    var BaseButton = BaseView.extend({
        className: 'btn',
        events: {
            'click': 'onBtnClick'
        },
        initialize: function(cfg) {
            var view = this;

            if (cfg) {
                view.name = cfg.name;
                view.cls = cfg.cls;
                view.icon = cfg.icon;
                view.clickHandler = cfg.onClick;
                view.parentView = cfg.parentView;
                view.preventDefault = cfg.preventDefault;
            }

            if (!_.isBoolean(view.preventDefault)) {
                view.preventDefault = true;
            }

            if (!view.cls) {
                view.cls = 'btn-default';
            }

            view.$container = view.$el;

            if (view.icon) {
                if (_.isString(view.icon)) {
                    view.$icon = $('<i class="fa fa-' + view.icon + '"/>');
                } else {
                    view.$icon = view.icon;
                }
            }

            view.render();
        },
        preRender: function() {
            var view = this,
                name = view.name,
                cls = view.cls;

            view.$el.addClass(cls);

            if (view.$icon) {
                view.addContent([view.$icon, '&nbsp;']);
            }

            view.addContent(name);

            return view;
        },
        render: function() {
            var view = this;

            view.preRender();

            return view;
        },
        onBtnClick: function(ev) {
            var view = this,
                isDisabled = view.disabled,
                parentView = view.parentView,
                handler = view.clickHandler,
                hash = view.urlHash;

            if (isDisabled) {
                ev && ev.preventDefault();
                return;
            }

            if (_.isFunction(handler)) {
                handler(ev, view, parentView);
            } else {
                Utils.navigate(hash);
            }

            if (view.preventDefault && ev) {
                ev.preventDefault();
            }

            return view;
        },
        enable: function() {
            var view = this;

            view.$el.removeClass('disabled');
            view.$el.removeAttr('disabled');

            view.disabled = false;
        },
        disable: function() {
            var view = this;

            view.$el.addClass('disabled');
            view.$el.attr('disabled', true);

            view.disabled = true;
        }
    });

    var ButtonView = BaseButton.extend({
        tagName: 'button'
    });

    var AnchorView = BaseButton.extend({
        tagName: 'a',
        initialize: function(cfg) {
            var view = this;

            cfg = cfg || {};

            cfg = _.extend({
                preventDefault: false
            }, cfg);

            if (cfg) {
                view.urlHash = cfg.urlHash;
            }

            if (!view.$el.attr('href')) {
                view.$el.attr('href', '#' + (view.urlHash || ''));
            }

            return BaseButton.prototype.initialize.apply(view, arguments);
        }
    });

    return function(cfg) {
        var view;

        if (!cfg || !cfg.type || cfg.type === 'button') return new ButtonView(cfg);

        if (cfg.type === 'anchor') return new AnchorView(cfg);
    };
});