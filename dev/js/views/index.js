define(['jquery', 'underscore', 'views/pagecomps/base', 'views/pagecomps/canvas'], function($, _, BaseView, Canvas){
    var IndexView = BaseView.extend({
        tagName: 'div',
        className: 'canvas-wrapper',
        initialize: function(){
            var view= this;

            view.$container = view.$el;

            view.render();

            return view;
        },
        render: function(){
            var view = this;

            view.addContent(Canvas);

            return view;
        },
        setLoading: function(){
            BaseView.prototype.setLoading.apply(SylAppView, arguments);
        },
        loadPage: function(Page){
            var view= this;

            if(!Page) return;

            if(_.isFunction(Page)) Page = Page(view);
            if(_.isFunction(Page.init)) Page.init(view);
            if(Page.canvasContent){
                view.loadCanvasContent(Page.canvasContent, Page);
            }
            if(_.isFunction(Page.delegateEvents)){
                Page.delegateEvents();
            }
            if(_.isFunction(Page.load)) Page.load(view);
        },
        loadCanvasContent: function(c, Page){
            var view = this;
            if(_.isFunction(c)) c = c.call(Page, view);
            Canvas.loadContent(c);

            return Canvas;
        },
        getCanvas: function(){
            return Canvas;
        }
    });

return new IndexView();
});