define(['underscore'], function(_) {
    /* Setup Mustache.js style interpolation, eg: {{ name }} */
    _.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g,
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g,
    };
    
    return _.noConflict();
});