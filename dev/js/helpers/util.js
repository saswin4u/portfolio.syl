define(['underscore', 'jquery', 'backbone'], function(_, $, Backbone){
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