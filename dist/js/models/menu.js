define(['underscore', 'backbone', 'configs/url', 'helpers/datafactory'], function(_, Backbone, Urls, DF){
    var MenuModel = DF.BaseModel.extend({
        rel : 'menu',
        urlRoot : Urls.menus
    });

    return new MenuModel();
});