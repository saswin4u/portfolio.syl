define('configs/viewport',{
    appClass: 'sylvester',
    viewportClass: 'container-fluid',
    renderTo: '#sylvesteraswin',
});
define('helpers/util',['underscore', 'jquery', 'backbone'], function(_, $, Backbone){
    var trimLeft = /^\s+/,
        trimRight = /\s+$/,
        trim = String.prototype.trim,
        rquery = /\?/;
    /**
     * @function trim
     *
     * - A function to polyfill `String.prototype.trim` function if not present in the browsers.
     *
     * @param {String} text The string that needs to be trimmed.
     * @return {String} The trimmed text.
     */
    function customTrim(text) {
        return text === null ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "");
    }
    
    /**
     * @function repeat
     *
     * - Returns a string with a specified number of repetitions with a given string pattern.
     * The pattern be separated by a different string.
     *
     * @example
     * var s = repeat('---', 4); // = '------------'
     * var t = repeat('--', 3, '/'); // = '--/--/--'
     *
     * @param {String} pattern The pattern to repeat.
     * @param {Number} count The number of times to repeat the pattern (may be 0).
     * @param {String} [sep] An optional string to separate each pattern.
     */
    function repeat(pattern, count, sep) {
        for (var buf = [], i = count; i--;) {
            buf.push(pattern);
        }
        return buf.join(sep || '');
    }

    /**
     * @function getKey
     *
     * Returns the first matching key corresponding to the given value.
     * If no matching value is found, null is returned.
     *
     *     var person = {
     *         name: 'Jacky',
     *         loves: 'food'
     *     };
     *
     *     alert(Ext.Object.getKey(person, 'food')); // alerts 'loves'
     *
     * @param {Object} object
     * @param {Object} value The value to find
     */
    function getKey(object, value) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }

        return null;
    }

    /** 
     * @function objectToQueryParams
     *
     * - Converts the given object into query param format, optionally appending it to the specified url.
     *
     * @param {Object} obj The object to be converted.
     * @param {String} [url] An optional url to append the generated query parameters.
     * @return {String} The query parameter string.
     */
    function objectToQueryParams(obj, url, prefix /*used internally*/ ) {
        var params = '',
            key;

        if (_.isArray(obj) && typeof prefix === 'string') {
            prefix = prefix + '[]';
            _.each(obj, function(val) {
                params += prefix + '=' + encodeURIComponent(val) + '&';
            });
        } else if (_.isObject(obj)) {
            _.each(obj, function(val, key) {
                if (_.isArray(val)) {
                    params += objectToQueryParams(val, null, key) + '&';
                } else {
                    params += key + '=' + encodeURIComponent(val) + '&';
                }
            });
        }
        // remove '&' from the end
        params = params.replace(/&$/, '');

        return url ? (url + (rquery.test(url) ? '&' : '?') + params) : params;
    }

    /** 
     * @function addContent
     *
     * - Appends content to a Backbone View or jQuery element.
     *
     * @param {(Backbone.View|jQuery.element)} to The Backbone View or jQuery element to wich the content will be appended.
     * @param {(Backbone.View|jQuery.element|Backbone.View[]|jQuery.element[])} content The Backbone View or jQuery element or an array which needs to be appended.
     * @param {Boolean} [delagateEvents=false] An optional parameter to specify if delegateEvents method of the Backbone View needs to be called.
     */
    function addContent(to, content, delegateEvents) {
        if (!(to instanceof $) && !(to instanceof Backbone.View)) return;

        if (to instanceof Backbone.View) to = to.$el;
        if (content instanceof Backbone.View) content = content.$el;

        if (!$.isArray(content)) {
            to.append(content);
        } else {
            _.each(content, function(c) {
                addContent(to, c);
            });
        }
    }

    /** 
     * @function scrollTo
     *
     * - Scrolls the window to the specified target. For parameter specifications read [jQuery.scrollTo plugin]{@link http://flesler.blogspot.in/2007/10/jqueryscrollto.html}
     *
     * @param {(Backbone.View|jQuery.element)} target
     * @param {Number} [duration]
     * @param {Object} [settings]
     */
    function scrollTo(target, duration, settings) {
        if (target instanceof Backbone.View) target = target.$el;
        $('body').scrollTo(target, duration, settings);
    }

    /** 
     * @function navigate
     *
     * - Navigates to the given url hash. Triggers the routes even if the url hash is same as current (unless trigger set to false).
     *
     * @param {String} urlHash
     * @param {Boolean} [trigger=true]
     */
    function navigate(urlHash, trigger) {
        if (!urlHash) return;
        if (Backbone.history.fragment === urlHash) { // current url is the same as the navigated url
            Backbone.history.fragment = null;
        }

        if (!_.isBoolean(trigger)) {
            trigger = true;
        }
        Backbone.history.navigate('#' + urlHash, {
            trigger: trigger
        });
    }

    return /** @alias module:util */ {
        trim: trim ? // Use native String.trim function wherever possible
            function(text) {
                return text === null ? "" : trim.call(text);
            } : customTrim, // Otherwise use our own trimming functionality
        repeat: repeat,
        getKey: getKey,
        objectToQueryParams: objectToQueryParams,
        addContent: addContent,
        scrollTo: scrollTo,
        navigate: navigate
    };
});
define('views/comps/loader',['jquery', 'underscore', 'backbone'], function($, _, Backbone){
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
define('views/pagecomps/base',['jquery', 'underscore', 'backbone', 'helpers/util', 'views/comps/loader'], function($, _, Backbone, Utils, LoaderView) {
    var BaseView = Backbone.View.extend({
        reset: function() {
            var view = this,
                $container = view.$container || view.$el;

            if ($container) {
                $container.empty();
                if ($container.hasClass('loading')) {
                    view.setLoading();
                }
            }

            if (_.isFunction(view.preRender)) {
                view.preRender();
            }

            return view;
        },
        set: function(type, enable, cfg) {
            var view = this,
                $container = view.$container || view.$el,
                typeView = view[type] || new LoaderView(cfg);

            if (!_.isBoolean(enable)) {
                enable = true;
            }

            if (enable) {
                $container.addClass('loading');
                $container.addClass(cfg && cfg.loadingCls);
                view.addContent(typeView);
                view[type] = typeView;
            } else {
                $container.removeClass('loading');
                $container.removeClass(typeView.loadingCls);
                typeView = typeView.remove();
                view[type] = null;
            }

            return view;
        },
        setLoading: function(enable, cfg) {
            var view = this;

            view.set('loading', enable, cfg);
        },
        setError: function(enable, cfg){
            var view= this;

            view.set('error', enable, _.extend(cfg || {}, {
                type : 'error'
            }));

            return view;
        },
        addContent: function(content){
            var view= this,
                $container = view.$container || view.$el;

            Utils.addContent($container, content);

            return view;
        },
        loadContent: function(content, cfg){
            var view = this;

            if(!cfg){
                view.reset();
            }

            view.addContent(content);

            return view;
        }
    });

    return BaseView;
});
define('views/viewport',['jquery', 'underscore', 'backbone', 'configs/viewport', 'views/pagecomps/base'], function($, _, Backbone, Configs, BaseView) {
    var viewPort;

    return function(cfg) {
        var tmpView,
            renderTo,
            className,
            containerClassName,
            styles,
            containerStyles,
            afterRenderFn,
            viewCfg = {},
            defaultCfg = {
                // className: 'container-fluid',
                styles: {
                    minHeight: 400,
                },
                containerStyles: {
                    minHeight: $(window).height()
                }
            };

        if (viewPort) {
            return viewPort;
        }

        $.extend(true, defaultCfg, cfg);
        cfg = defaultCfg;

        if ($.isPlainObject(cfg)) {
            if (cfg.renderTo) {
                viewCfg.el = $(cfg.renderTo)[0];
            }

            renderTo = cfg.renderTo;
            className = cfg.className;
            containerClassName = cfg.containerClassName;
            styles = cfg.styles;
            containerStyles = cfg.containerStyles;
            afterRenderFn = cfg.afterRenderFn;
        }

        viewCfg.initialize = function() {
            var view = this;

            if ($.isPlainObject(styles)) {
                view.$el.css(styles);
            }

            view.render();

            return view;
        };

        viewCfg.render = function() {
            var view = this;

            view.$el.addClass(className);

            // append the container
            view.$container = $('<div class="' + cfg.viewportClass + '" />');
            view.$container.addClass(containerClassName);
            view.$el.append(view.$container);

            // apply container styles
            if ($.isPlainObject(containerStyles)) {
                view.$container.css(containerStyles);
            }

            // call after render function
            if ($.isFunction(afterRenderFn)) {
                afterRenderFn.call(view, view);
            }

            return view;
        };

        tmpView = BaseView.extend(viewCfg);
        viewPort = new tmpView();

        return viewPort;
    };
});
define('configs/routes',{
    root : '!/home',
    error : '!/error',
    map : {
        home: {
            '!/home' : 'default'
        }
    }
});
define('views/pagecomps/canvas',['jquery', 'underscore', 'views/pagecomps/base'], function($, _, BaseView){
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
define('views/index',['jquery', 'underscore', 'views/pagecomps/base', 'views/pagecomps/canvas'], function($, _, BaseView, Canvas){
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
define('views/pagecomps/header',['jquery', 'underscore', 'backbone', 'views/pagecomps/base'], function($, _, Backbone, BaseView){
    var HeaderView = BaseView.extend({
        tagName : 'header',
        className: '',
        events:{
            'click #open-button' : 'openButtonSection',
            'click #close-button' : 'openButtonSection',
        },
        initialize : function(cfg){
            var view = this;

            if(cfg){

            }

            view.$el.attr({
                 'data-spy' : "affix"
            });

            view.$container = $('<div class="container"/>');
            view.$el.append(view.$container);

            view.$logo = $('<div class="logo"> <a href="#!/home"> <img src="dist/img/logo.png" data-at2x="dist/img/logo@2x.png" alt="logo" /> </a> </div>');
            view.$menuIndicator = $('<button class="main-menu-indicator" id="open-button"> <span></span> </button>');

            view.render();
            view.initAffix();
        },
        openButtonSection : function(){
            //Toggle Class on the Main App View
            SylAppView.$el.toggleClass('show-menu');
        },
        preRender: function(){
            var view = this;

            view.addContent(view.$logo);
            view.addContent(view.$menuIndicator);

            // view.addContent(new MenuView());
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
define('configs/url',{
    menus : '/services/menu.json'
});
define('configs/app',{
    globalAjaxTimeout : 120000,
    globalAjaxCache : false    
});
define('helpers/datafactory',['jquery', 'underscore', 'backbone', 'configs/app'], function($, _, Backbone, AppConfig) {
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
define('models/menu',['underscore', 'backbone', 'configs/url', 'helpers/datafactory'], function(_, Backbone, Urls, DF){
    var MenuModel = DF.BaseModel.extend({
        rel : 'menu',
        urlRoot : Urls.menus
    });

    return new MenuModel();
});

define('text!templates/item.tpl',[],function () { return '<a href="#{{ url }}">{{ name }}</a>';});

define('views/pagecomps/menu/item',['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'text!templates/item.tpl', 'helpers/util'], function($, _, Backbone, BaseView, LinkTpl, Utils) {
    var ItemView = BaseView.extend({
        tagName : 'li',
        template : _.template(LinkTpl),
        events : {
            'click' : 'onItemClick'
        },
        initialize: function(cfg){
            var view = this;

            if(cfg){
                view.parentView = cfg.parentView;
                view.name = cfg.name;
                view.url = cfg.url;
            }

            view.$container  = view.$el;

            view.render();

            return view;
        },
        render: function(){
            var view = this,
                item = view.template({
                    name : view.name,
                    url : view.url || ''
                });

            view.addContent(item);

            return view;
        },
        onItemClick:function(ev){
            var view= this,
                parentView = view.parentView,
                hash = view.url;

            ev && ev.preventDefault();

            Utils.navigate(hash);
        }
    });

    return ItemView;
});
define('views/pagecomps/menu/items',['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'views/pagecomps/menu/item'], function($, _, Backbone, BaseView, ItemView) {
    var ItemsView = BaseView.extend({
        tagName: 'ul',
        initialize: function(cfg) {
            var view = this;

            if (cfg) {
                view.items = cfg.items;
                view.cls = cfg.cls;
            }

            view.$el.addClass(view.cls || '');
            view.menuItemViews = [];

            view.render();

            return view;
        },
        render: function() {
            var view = this,
                items = view.items,
                item;

            view.addItems(items);

            return view;
        },
        addItems: function(items) {
            var view = this;

            _.each(items, function(itemCfg, index) {
                view.addItem(itemCfg);
            });
        },
        addItem: function(item) {
            var view = this,
                mi;

            item.parentView = view;
            mi = new ItemView(item);

            view.menuItemViews.push(mi);
            view.addContent(mi);

            return view;
        },
        getItems : function(){
            var view = this,
                itemViews = view.menuItemViews;

            return itemViews;
        }
    });

    return ItemsView;
});
define('views/pagecomps/menu/nav',['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'views/pagecomps/menu/items'], function($, _, Backbone, BaseView, ItemsView) {
    var NavView = BaseView.extend({
        tagName : 'nav',
        className : 'menu',
        initialize : function(cfg){
            var view = this;

            if(cfg){

            }

            view.$menuList = $('<div class="menu-list" />');

            view.$el.append(view.$menuList);

            // view.$container = view.$el;

            view.render();

            return view;
        },
        render: function(){
            var view = this,
                menuItems = view.model.get('menus'),
                itemsView = new ItemsView({
                    items : menuItems
                });

            view.$menuList.append(itemsView.$el);

            return view;
        }
    });

    return NavView;
});
define('views/pagecomps/menu/menu',['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'models/menu', 'views/pagecomps/menu/nav'], function($, _, Backbone, BaseView, MenuModel, NavView) {
    var MenuView = BaseView.extend({
        tagName: 'div',
        className: 'menu-wrap',
        model: MenuModel,
        initialize: function(cfg) {
            var view = this;

            if (cfg) {

            }

            view.$container = view.$el;

            //Wrap everything
            view.$menuContent = $('<div class="menu-content" />');
            //Container Wrapper
            view.$container = $('<div class="container" />');
            //Content wrapper
            view.$row = $('<div class="row" />');
            //Navigation wrapper
            view.$nav = $('<div class="navigation" />');
            //Close Button
            view.$closeEl = $('<span class="close-menu fa fa-close" id="close-button"></span>');
            //Nav Logo
            view.$navLogo = $('<div class="menu-logo hidden-xs"><img src="dist/img/logo_white.png" data-at2x="dist/img/logo_white@2x.png" alt="logo"></div>');
            //Menu Wrapper
            view.$elAll = $('<div class="col-md-8 col-md-offset-2 col-xs-12" />');
            //Menu 2 columns
            view.$elMenu = $('<div class="col-md-6 col-sm-6" />');
            view.$elContact = $('<div class="col-md-6 col-sm-6 hidden-xs" />');

            view.listenTo(view.model, 'sync', view.render);
            view.listenTo(view.model, 'model', view.onError);

            view.load();

            return view;
        },
        load: function() {
            var view = this,
                model = view.model;

            view.setLoading(true);

            model && model.fetch();
        },
        preRender: function() {
            var view = this;

            view.$elAll.append(view.$elMenu)
                .append(view.$elContact);

            view.$nav.append(view.$closeEl)
                .append(view.$navLogo);

            view.$row.append(view.$nav)
                .append(view.$elAll);

            view.$container.append(view.$row);

            view.$menuContent.append(view.$container);

            //Finall append everything
            view.$el.append(view.$menuContent);

        },
        onError: function() {
            console.log('Errored out Bitch!!');
        },
        render: function() {
            var view = this,
                nav = new NavView({
                    model: view.model
                });

            view.preRender();

            view.setLoading(false);

            // nav.model = view.model;
            view.$elMenu.append(nav.$el);

            return view;
        }
    });

    return new MenuView();
});
define('views/comps/button',['jquery', 'underscore', 'helpers/util', 'views/pagecomps/base'], function($, _, Utils, BaseView) {
    var BaseButton = BaseView.extend({
        className: 'btn',
        events: {
            'click': 'onBtnClick'
        },
        initialize: function(cfg) {
            var view = this;

            if (cfg) {
                view.name = cfg.name;
                view.cls = cfg.cls;
                view.icon = cfg.icon;
                view.clickHandler = cfg.onClick;
                view.parentView = cfg.parentView;
                view.preventDefault = cfg.preventDefault;
            }

            if (!_.isBoolean(view.preventDefault)) {
                view.preventDefault = true;
            }

            if (!view.cls) {
                view.cls = 'btn-default';
            }

            view.$container = view.$el;

            if (view.icon) {
                if (_.isString(view.icon)) {
                    view.$icon = $('<i class="fa fa-' + view.icon + '"/>');
                } else {
                    view.$icon = view.icon;
                }
            }

            view.render();
        },
        preRender: function() {
            var view = this,
                name = view.name,
                cls = view.cls;

            view.$el.addClass(cls);

            if (view.$icon) {
                view.addContent([view.$icon, '&nbsp;']);
            }

            view.addContent(name);

            return view;
        },
        render: function() {
            var view = this;

            view.preRender();

            return view;
        },
        onBtnClick: function(ev) {
            var view = this,
                isDisabled = view.disabled,
                parentView = view.parentView,
                handler = view.clickHandler,
                hash = view.urlHash;

            if (isDisabled) {
                ev && ev.preventDefault();
                return;
            }

            if (_.isFunction(handler)) {
                handler(ev, view, parentView);
            } else {
                Utils.navigate(hash);
            }

            if (view.preventDefault && ev) {
                ev.preventDefault();
            }

            return view;
        },
        enable: function() {
            var view = this;

            view.$el.removeClass('disabled');
            view.$el.removeAttr('disabled');

            view.disabled = false;
        },
        disable: function() {
            var view = this;

            view.$el.addClass('disabled');
            view.$el.attr('disabled', true);

            view.disabled = true;
        }
    });

    var ButtonView = BaseButton.extend({
        tagName: 'button'
    });

    var AnchorView = BaseButton.extend({
        tagName: 'a',
        initialize: function(cfg) {
            var view = this;

            cfg = cfg || {};

            cfg = _.extend({
                preventDefault: false
            }, cfg);

            if (cfg) {
                view.urlHash = cfg.urlHash;
            }

            if (!view.$el.attr('href')) {
                view.$el.attr('href', '#' + (view.urlHash || ''));
            }

            return BaseButton.prototype.initialize.apply(view, arguments);
        }
    });

    return function(cfg) {
        var view;

        if (!cfg || !cfg.type || cfg.type === 'button') return new ButtonView(cfg);

        if (cfg.type === 'anchor') return new AnchorView(cfg);
    };
});
define('views/pages/error',['jquery', 'underscore', 'backbone', 'views/pagecomps/base', 'views/comps/button'], function($, _, Backbone, BaseView, ButtonComp){
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
;
define("views/pages/404", function(){});

define('routers/app',['jquery', 'underscore', 'backbone', 'helpers/util', 'configs/routes', 'views/index', 'views/pagecomps/header', 'views/pagecomps/menu/menu', 'views/pages/error', 'views/pages/404'], function($, _, Backbone, Utils, Routes, IndexView, HeaderView, MenuView, ErrorPage, NotFoundPage) {
    var hasInit = false;
    var AppRouter = Backbone.Router.extend({
        currentView: null,
        routerUrlHashes: [],
        beforeLoadFns: [],
        initialize: function() {
            var router = this,
                rootRoute = Routes.root;

            router.route(/(.*?)/, router.invalidPathHandler);
            router.route('', _.partial(router.loadView, rootRoute));

            return router;
        },
        init: function() {
            if (!hasInit) {
                //Append Menu
                SylAppView.loadContent(MenuView);
                //Append Header
                SylAppView.loadContent(HeaderView, true);
                //Append Index View
                SylAppView.loadContent(IndexView, true);

                //Append Footer
            }
        },
        execBeforeSwitchFns: function() {
            var router = this,
                fns = router.beforeLoadFns;

            _.each(fns, function(fn) {
                if (_.isFunction(fn)) fn();
            });
            router.beforeLoadFns = [];
        },
        getPreviousHash: function() {
            var router = this,
                routerUrlHashes = router.routerUrlHashes,
                routerUrlHashesLen = routerUrlHashes.length;

            return routerUrlHashes[routerUrlHashesLen - 2];
        },
        storeHash: function() {
            var router = this;

            router.routerUrlHashes.push(Backbone.history.fragment);
        },
        getCurrentLoadedView: function() {
            var router = this;

            return router.currentView;
        },
        loadView: function(view, action) {
            var router = this,
                currentView = router.currentView;

            router.storeHash();

            router.execBeforeSwitchFns();

            if (typeof view === 'string') {
                router.navigate(view, {
                    trigger: true
                });
                return;
            }

            if (!currentView || currentView.cid !== view.cid) {
                IndexView.loadPage(view);
                router.currentView = view;
            }

            if (_.isFunction(view.switchToAction)) {
                view.switchToAction(action);
            }
        },
        loadCanvasContent: function(c) {
            IndexView.loadCanvasContent(c);
        },
        showError: function(errorPage) {
            var router = this;

            if (errorPage) {
                if (!(errorPage instanceof Backbone.View)) {
                    errorPage = new ErrorPage(errorPage);
                }

                router.loadView(errorPage);
                Utils.navigate(Routes.error, false);
            }
        },
        invalidPathHandler: function(cfg) {
            var router = this;

            console.log("ErrorPage");
            // router.showError(new NotFoundPage(cfg));
        }
    });

    return new AppRouter();
});
define('views/pages/home',['jquery', 'underscore', 'backbone', 'views/index'], function($, _, Backbone, IndexView){
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

            IndexView.setLoading(true);
        },
        canvasContent: function(){
            var page = this;

            return [];
        }
    }, Backbone.Events);

    return HomePage;
});
define('routers/home',['jquery', 'underscore', 'backbone', 'configs/routes', 'routers/app', 'views/pages/home'], function($, _, Backbone, Routes, AppRouter, HomePage){
    var HomeRouter = Backbone.Router.extend({
        initialize: function(){
            var router = this,
                homeRoutes = Routes.map['home'];

            _.each(homeRoutes, function(v, r){
                router.route(r, _.partial(router.loadView, v, r));
            });

            return router;
        },
        loadView: function(action, url){
            AppRouter.loadView(HomePage, action);
        }
    });

    return new HomeRouter();
});
var SylAppView;
define('app',['jquery', 'underscore', 'backbone', 'views/viewport', 'configs/viewport', 'routers/app', 'routers/home'], function($, _, Backbone, ViewPort, ViewPortConfig, AppRouter, HomeRouter){
    // console.log('Hello World');

    SylAppView = ViewPort(ViewPortConfig);

    /*SylAppView.setLoading(true, {
        title : 'Loading Awesomeness!!'
    });*/

    // Init the application router
    AppRouter.init();

    // Start Navigation
    Backbone.history.start();
});

require(["app"]);
