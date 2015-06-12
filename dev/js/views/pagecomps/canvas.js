define(['jquery', 'underscore', 'views/pagecomps/base'], function($, _, BaseView){
    var CanvasView = BaseView.extend({
        tagName: "section",
        className : 'canvas',
        initialize: function(cfg){
            var view = this;

            view.$container = view.$el;

            view.render();

            return view;
        },
        render:function(){
            var view = this;

            return view;
        }
    });

    return new CanvasView();
});