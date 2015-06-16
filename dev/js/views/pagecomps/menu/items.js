define(['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'views/pagecomps/menu/item'], function($, _, Backbone, BaseView, ItemView) {
    var ItemsView = BaseView.extend({
        tagName: 'ul',
        initialize: function(cfg) {
            var view = this;

            if (cfg) {
                view.items = cfg.items;
                view.cls = cfg.cls;
            }

            view.$el.addClass(view.cls || '');
            view.menuItemViews = [];

            view.render();

            return view;
        },
        render: function() {
            var view = this,
                items = view.items,
                item;

            view.addItems(items);

            return view;
        },
        addItems: function(items) {
            var view = this;

            _.each(items, function(itemCfg, index) {
                view.addItem(itemCfg);
            });
        },
        addItem: function(item) {
            var view = this,
                mi;

            item.parentView = view;
            mi = new ItemView(item);

            view.menuItemViews.push(mi);
            view.addContent(mi);

            return view;
        },
        getItems : function(){
            var view = this,
                itemViews = view.menuItemViews;

            return itemViews;
        }
    });

    return ItemsView;
});