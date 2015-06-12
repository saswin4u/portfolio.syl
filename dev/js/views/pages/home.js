define(['jquery', 'underscore', 'backbone', 'views/index'], function($, _, Backbone, IndexView){
    var HomePage = _.extend({
        cid : _.uniqueId(),
        hasInit : false,
        init : function(){
            var page = this;

            if(page.hasInit) return;

            page.initViews();

            page.hasInit = true;
        },
        initViews: function(){
            var page = this;
        },
        reset: function(){
            var page = this;
        },
        load: function(){
            var page = this;

            page.reset();

            // IndexView.setLoading(true);
        },
        canvasContent: function(){
            var page = this;

            return [];
        }
    }, Backbone.Events);

    return HomePage;
});