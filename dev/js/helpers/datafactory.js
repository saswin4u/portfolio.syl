define(['jquery', 'underscore', 'backbone', 'configs/app'], function($, _, Backbone, AppConfig) {
    var Base = {
        rel: null,
        fetch: function(options) {
            var mc = this,
                r;

            options = options || {};
            options.cache = options.cache || AppConfig.globalAjaxCache;
            options.timeout = options.timeout || AppConfig.globalAjaxTimeout;

            if (mc instanceof Backbone.Collection) {
                r = Backbone.Collection.prototype.fetch.call(mc, options);
            } else {
                r = Backbone.Model.prototype.fetch.call(mc, options);
            }

            return r;
        }
    };

    var BaseModel = Backbone.Model.extend(Base);

    var BaseCollection = Backbone.Collection.extend(_.extend({
        parse: function(response, xhr) {
            var collection = this;

            collection.dataCache = $.extend({}, response);
        }
    }, Base));

    return {
        BaseModel: BaseModel,
        BaseCollection: BaseCollection
    };
});