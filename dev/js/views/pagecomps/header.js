define(['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'views/pagecomps/menu'], function($, _, Backbone, BaseView, MenuView){
    var HeaderView = BaseView.extend({
        tagName : 'header',
        className: '',
        initialize : function(cfg){
            var view = this;

            if(cfg){

            }

            view.$el.attr({
                 'data-spy' : "affix"
            });

            view.$container = $('<div class="container"/>');
            view.$el.append(view.$container);

            view.$logo = $('<div class="logo"> <a href="#!/home"> <img src="dist/img/logo.png" data-at2x="dist/img/logo@2x.png" alt="logo"> </a> </div>');
            view.$menuIndicator = $('<button class="main-menu-indicator" id="open-button"> <span></span> </button>');

            view.render();
            view.initAffix();
        },
        preRender: function(){
            var view = this;

            view.addContent(view.$logo);

            view.addContent(view.$menuIndicator);
        },
        render: function(){
            var view = this;

            view.preRender();

            return view;
        },
        initAffix: function(){
            var view = this,
                $el = view.$el;

                // $el.affix();

        }
    });

    return new HeaderView();
});