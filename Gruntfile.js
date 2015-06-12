module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            dev: {
                options: {
                    appDir: './dev',
                    baseUrl: 'js',
                    dir: './dist',
                    mainConfigFile: './dev/js/configs.js',
                    skipDirOptimize: true,
                    keepBuildDir: true,
                    optimizeAllPluginResources: true,
                    optimize: 'none',
                    modules: [{
                        name: 'configs',
                        include: ['requirejs', 'text', 'jquery', 'underscore', 'backbone', 'bootstrap' /*, 'jeasing', 'jdetect', 'isotope', 'WOW', 'waypoints', 'jscroll', 'owl', 'hammerjs'*/ ],
                    }, {
                        name: 'app',
                        exclude: ['configs'],
                        insertRequire: ['app']
                    }]
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                preserveComments: 'some',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: './dist/js',
                    src: ['*.js','!*.min.js'],
                    dest: './dist/js',
                    ext: '.min.js'
                }]
            }
        },
        bowerRequirejs: {
            all: {
                rjsConfig: "./dev/js/configs.js",
                options: {
                    exclude: ['animate.css', 'fontawesome', 'loaders', 'modernizr', 'normalize.css', 'bootstrap', 'retina.js-js'],
                    baseUrl: './dev/js'
                }
            }
        },
        bower_concat: {
            all: {
                dest: './dist/js/libs.js',
                cssDest: './dev/css/core.css',
                exclude: ['modernizr', 'requirejs', 'jquery', 'underscore', 'backbone', 'text']
            }
        },
        clean: ['./dist/built.txt', './dist/js/configs', './dist/js/helpers', './dist/js/libs', './dist/js/routers', './dist/js/views'],
        compass: {
            dev: {
                options: {
                    http_path: '/',
                    sassDir: './dev/sass',
                    cssDir: './dev/css',
                    imageDir: './dev/img',
                    relativeAssets: true
                }
            }
        },
        cssmin: {
            prod: {
                files: [{
                    expand: true,
                    cwd: './dev/css',
                    src: ['*.css', '!*.min.css'],
                    dest: './dev/css',
                    ext: '.min.css'
                }]
            }
        },
        copy: {
            fonts: {
                cwd: './dev/fonts/',
                src: '**/*',
                dest: './dist/fonts',
                expand: true
            },
            images: {
                cwd: './dev/img/',
                src: '**/*',
                dest: './dist/img',
                expand: true
            },
            css: {
                cwd: './dev/css',
                src: '**/*',
                dest: './dist/css',
                expand: true
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: './',
                    keepalive: true,
                    debug: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass'); // This task requires you to have Ruby, Sass, and Compass >=1.0.1 installed.
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-bower-requirejs');

    // Default Tasks
    grunt.registerTask('default', ['bowerRequirejs', 'corebuild', 'cssbuild', 'jsbuild', 'copyfiles', 'clean']);

    //Build the Dev JS file
    grunt.registerTask('jsbuild', ['requirejs:dev', 'uglify:prod']);
    // grunt.registerTask('jsdev', ['requirejs:dev']);

    //Core build
    grunt.registerTask('corebuild', 'bower_concat');

    // Copy
    grunt.registerTask('copyfiles', ['copy:fonts', 'copy:images', 'copy:css']);

    //Build APP CSS
    grunt.registerTask('cssdev', ['compass:dev']);
    //Minify CSS
    grunt.registerTask('cssprod', ['cssmin:prod']);
    //Combine CSS build
    grunt.registerTask('cssbuild', ['cssdev', 'cssprod']);

    // Server
    grunt.registerTask('server', ['connect:server']);
};