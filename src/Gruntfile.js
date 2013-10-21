module.exports = function (grunt) {
    var path = require('path');
    var config = {};

    var namespaces = {};

    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-watch');
        config.watch = {};
    }

    // release
    {
        grunt.loadNpmTasks('grunt-release');

        config.release = {
            options: {
                file: 'bower.json',
                npm: false
            }
        };
    }

    var configureEnv = function (name, env) {
        // js
        {
            grunt.loadNpmTasks('grunt-auto-deps');
            config.auto_deps = config.auto_deps || {};

            if (env.demo) {
                config.auto_deps[name] = {
                    scripts: [
                        'ToneMap'
                    ],
                    dest: path.resolve(env.sitePath, 'js'),
                    loadPath: ['js/*.js'],
                    ignore: ['EventEmitter', 'inherits'],
                    forced: [],
                    locate: namespaces
                };
                config.auto_deps[name + '-demo'] = {
                    scripts: [
                        'ToneMap-demo'
                    ],
                    dest: path.resolve(env.sitePath, 'js'),
                    loadPath: ['js/*.js'],
                    ignore: ['ToneMap'],
                    forced: ['html5shiv'],
                    locate: namespaces
                };

                if (env.watch) {
                    config.watch.js = {
                        files: ['js/*.js'],
                        tasks: [
                            'auto_deps:' + name,
                            'auto_deps:' + name + '-demo'
                        ]
                    };
                }    
                env.tasks.push('auto_deps:' + name);
                env.tasks.push('auto_deps:' + name + '-demo');
            } else {
                config.auto_deps[name] = {
                    scripts: [
                        'ToneMap'
                    ],
                    dest: path.resolve(env.sitePath, 'js'),
                    loadPath: ['js/*.js'],
                    ignore: [],
                    forced: ['html5shiv'],
                    locate: namespaces
                };

                if (env.watch) {
                    config.watch.js = {
                        files: ['js/*.js'],
                        tasks: ['auto_deps:' + name]
                    };
                }    
                env.tasks.push('auto_deps:' + name);
            }
        }
    
    
        // css
        {
            grunt.loadNpmTasks('grunt-contrib-compass');
    
            config.compass = config.compass || {};
            config.compass[name] = {
                options: {
                    sassDir                 : 'sass',
                    cssDir                  : path.resolve(env.sitePath, 'css'),
                    javascriptsDir          : path.resolve(env.sitePath, 'js'),
                    imagesDir               : path.resolve(env.sitePath, 'img'),
                    generatedImagesPath     : path.resolve(env.sitePath, 'img'),
                    httpImagesPath          : path.resolve(env.httpPath, 'img'),
                    httpGeneratedImagesPath : path.resolve(env.httpPath, 'img'),
                    environment             : 'development'
                }
            };
    
            if (env.watch) {
                config.watch.css = {
                    files: ['sass/*.scss', 'sass/**/*.scss'],
                    tasks: ['compass:' + name]
                };
            }
    
            env.tasks.push('compass:' + name);
        }
    
    
        // ejs
        if (env.ejs) {
            grunt.loadNpmTasks('grunt-simple-ejs');
    
            config.ejs = config.ejs || {};
            config.ejs[name] = {
                template: ['ejs/*.ejs'],
                dest: env.sitePath,
                include: [
                    'bower_components/ejs-head-modules/*.ejs',
                    'bower_components/ejs-sns-modules/*.ejs'
                ],
                options: [
                    {
                        http_path : env.httpPath,
                        css_path  : path.resolve(env.httpPath, 'css'),
                        js_path   : path.resolve(env.httpPath, 'js' ),
                        img_path  : path.resolve(env.httpPath, 'img')
                    },
                    'options.yaml'
                ]
            };
            env.tasks.push('ejs:' + name);
            
            if (env.watch) {
                config.watch.ejs = {
                    files: [
                        'ejs/*.ejs',
                        'ejs/**/*.ejs',
                        'options.yaml'
                    ],
                    tasks: ['ejs:' + name]
                };
            }
        }

    
        // test
        if (env.test) {
            grunt.loadNpmTasks('grunt-mocha-html');
            grunt.loadNpmTasks('grunt-mocha-phantomjs');
    
            config.mocha_html = config.mocha_html || {};
            config.mocha_html[name] = {
                src   : [ path.resolve(env.sitePath, 'js', 'ToneMap.js') ],
                test  : [ 'test/*-test.js' ],
                assert : 'chai'
            };
            env.tasks.push('mocha_html');
    
            
            if (env.watch) {
                config.watch.test = {
                    files: ['test/*-test.js'],
                    tasks: ['mocha_phantomjs']
                };
                config.watch.js.tasks.push('mocha_html');
            }
    
            config.mocha_phantomjs =  {
                all: [ 'test/*.html' ]
            };
    
            grunt.registerTask('test', ['mocha_phantomjs']);
    
        }
    
    
        // server
        {
            grunt.loadNpmTasks('grunt-koko');
    
            config.koko = config.koko || {};
            config.koko[name] = {
                root: path.resolve(env.sitePath, path.relative(env.httpPath, '/')),
                openPath: env.httpPath
            };
    
            grunt.registerTask('server', ['koko:' + name]);
        }

        // set as task
        grunt.registerTask(name, env.tasks);
    };

    configureEnv('dev', {
        tasks: [],
        sitePath: '../',
        httpPath: '/',
        watch: true,
        ejs: true,
        test: true,
        demo: true
    });

    // init
    grunt.initConfig(config);
    grunt.registerTask('default', ['dev']);
};
