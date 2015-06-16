require.config({
    paths: {
        backbone: "libs/backbone/backbone",
        jquery: "libs/jquery/dist/jquery",
        requirejs: "libs/requirejs/require",
        text: "libs/text/text",
        underscore: "libs/underscore/underscore",
        models: "models",
        views: "views",
        collections: "collections",
        templates: "templates",
        helpers: "helpers",
        bootstrap: "libs/bootstrap/dist/js/bootstrap",
        "retina.js-js": "libs/retina.js-js/src/retina"
    },
    shim: {

    },
    map: {
        "*": {
            underscore: "configs/underscore-private"
        },
        "configs/underscore-private": {
            underscore: "underscore"
        }
    },
    packages: [

    ]
});