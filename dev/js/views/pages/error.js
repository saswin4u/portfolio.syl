define(['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'views/comps/button'], function($, _, Backbone, BaseView, ButtonComp){
    var ErrorView = BaseView.extend({
        tagName: 'div',
        className: '',
        initialize: function(cfg){
            var view = this,
                backBtnCfg;

            if(cfg){
                view.heading = cfg.heading || 'Page Not Found';
                view.message = cfg.message;
                view.showBackBtn = cfg.showBackBtn;
                view.backBtnCfg = cfg.backBtnCfg;
                view.btns = cfg.btns;
            }

            if(!_.isBoolean(view.showBackBtn)){
                view.showBackBtn = true;
            }

            view.$container = view.$el;
            view.$el.append(view.$container);

            if(view.showBackBtn){
                backBtnCfg = _.extend({
                    name : 'Back',
                    cls : 'btn-default',
                    onClick: _.bind(view.backToPrevious, view),
                    parentView: view
                }, view.backBtnCfg);
            }
        }
    });
});