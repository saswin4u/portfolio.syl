define(['jquery', 'underscore', 'backbone', 'helpers/s/util'], function($, _, Backbone, Utils){
    var s = {
        $: $,
        _: _,
        Backbone: Backbone,
        Utils: Utils,
    };

    (function(root){
        root.Sylvester = root.Sylvester || {};
        $.extend(true, root.Sylvester, s);
    })(this);

    return rk;
});