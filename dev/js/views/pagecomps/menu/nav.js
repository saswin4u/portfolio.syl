define(['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'views/pagecomps/menu/items'], function($, _, Backbone, BaseView, ItemsView) {
    var NavView = BaseView.extend({
        tagName : 'nav',
        className : 'menu',
        initialize : function(cfg){
            var view = this;

            if(cfg){

            }

            view.$menuList = $('<div class="menu-list" />');

            view.$el.append(view.$menuList);

            // view.$container = view.$el;

            view.render();

            return view;
        },
        render: function(){
            var view = this,
                menuItems = view.model.get('menus'),
                itemsView = new ItemsView({
                    items : menuItems
                });

            view.$menuList.append(itemsView.$el);

            return view;
        }
    });

    return NavView;
});