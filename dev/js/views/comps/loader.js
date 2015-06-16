define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
    var LoaderView = Backbone.View.extend({
        tagName : 'div',
        className : 'loading-wrapper',
        initialize : function(cfg){
            var view = this;

            if(cfg){
                view.title = cfg.title;
                view.message = cfg.message;
                view.loadingCls = cfg.loadingCls;
                view.type = cfg.type;
            }

            if(!view.type){
                view.type = 'circle';
            }

            view.loaderCfg = {
                circle : $('<div class="loader"><div class="loader-inner ball-clip-rotate"><div></div></div></div>'),
                pacman: $('<div class="loader"><div class="loader-inner pacman"><div></div><div></div><div></div><div></div><div></div></div></div>')
            };

            view.$container = (view.type && view.loaderCfg[view.type]) || view.loaderCfg.circle;

            view.$title = $('<p class="title text-center"/>');
            view.$message = $('<p class="sub-title text-center"/>');

            view.render();
        },
        render: function(){
            var view = this,
                $container = view.$container.find('.loader-inner'),
                title = view.title,
                message = view.message;

            view.$el.append(view.$container);

            if(title){
                view.$title.append(title);
                $container.append(view.$title);
            }

            if(message){
                view.$message.append(message);
                $container.append(view.$message);
            }

            return view;
        }
    });

    return LoaderView;
});