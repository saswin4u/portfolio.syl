define(['jquery', 'underscore', 'backbone', 'views/pagecomps/base'], function($, _, Backbone, BaseView){
    var MenuView = BaseView.extend({
        tagName : 'div',
        className : 'menu-wrap',
        initialize: function(cfg){
            var view = this;

            if(cfg){

            }

            view.$menuContent = $('<div class="menu-content" />');
            view.$container $('<div class="container" />');
            view.$row = $('<div class="row" />');
            view.$nav = $('<div class="navigation" />');
            view.$el = $('<div class="col-md-8 col-md-offset-2 col-xs-12" />');

            view.render();

            return view;
        },
        preRender : function(){
            var view = this;
        },
        render: function(){
            var view= this;

            view.preRender();

            return view;
        }
    });

    return new MenuView();
});