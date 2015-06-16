define(['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'text!templates/item.tpl', 'helpers/util'], function($, _, Backbone, BaseView, LinkTpl, Utils) {
    var ItemView = BaseView.extend({
        tagName : 'li',
        template : _.template(LinkTpl),
        events : {
            'click' : 'onItemClick'
        },
        initialize: function(cfg){
            var view = this;

            if(cfg){
                view.parentView = cfg.parentView;
                view.name = cfg.name;
                view.url = cfg.url;
            }

            view.$container  = view.$el;

            view.render();

            return view;
        },
        render: function(){
            var view = this,
                item = view.template({
                    name : view.name,
                    url : view.url || ''
                });

            view.addContent(item);

            return view;
        },
        onItemClick:function(ev){
            var view= this,
                parentView = view.parentView,
                hash = view.url;

            ev && ev.preventDefault();

            Utils.navigate(hash);
        }
    });

    return ItemView;
});