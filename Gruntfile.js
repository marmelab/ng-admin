/*global module*/

module.exports = function (grunt) {
    'use strict';

    // Define the configuration for all the tasks
    grunt.initConfig({

        requirejs: grunt.file.readJSON('grunt/grunt-requirejs.json'),
        compass: grunt.file.readJSON('grunt/grunt-compass.json'),

        ngAnnotate: {
            ngadmin: {
                files: {
                    'build/ng-admin.min.js': ['build/ng-admin.min.js']
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    'build/ng-admin.min.css': [
                        'build/ng-admin.css',
                        'src/javascripts/bower_components/nprogress/nprogress.css',
                        'src/javascripts/bower_components/humane/themes/flatty.css',
                        'src/javascripts/bower_components/textAngular/dist/textAngular.min.css'
                    ]
                }
            }
        },

        concat: {
            css: {
                src: [
                    'build/ng-admin.css',
                    'src/javascripts/bower_components/nprogress/nprogress.css',
                    'src/javascripts/bower_components/humane/themes/flatty.css',
                    'src/javascripts/bower_components/textAngular/dist/textAngular.min.css'
                ],
                dest: 'build/ng-admin.min.css'
            }
        },

        uglify: {
            ngadmin: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'build/ng-admin.min.map'
                },
                files: {
                    'build/ng-admin.min.js': ['build/ng-admin.min.js']
                }
            }
        },

        clean : {
            build : ["build/*", "!build/*.min.js", "!build/*.min.css", "!build/*.map"]
        },

        copy: {
            css_dev: {
                src: 'build/ng-admin.css',
                dest: 'build/ng-admin.min.css'
            },
            config: {
                src: 'src/javascripts/config-dist.js',
                dest: 'src/javascripts/config.js',
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/@@backend_url/g, process.env.CI ? 'http://ng-admin.marmelab.com:8080/' : 'http://localhost:3000/');
                    },
                },
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.',
                    keepalive: false
                }
            }
        },

        json_server: {
            stub: {
                options: {
                    port: 3000,
                    db: 'src/javascripts/test/stub-server.json',
                    keepalive: false
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            configFiles: {
                files: ['Gruntfile.js', 'grunt/grunt-*.json'],
                tasks: ['build:dev'],
                options: {
                    // reload watchers since configuration may have changed
                    reload: true
                }
            },
            javascripts: {
                files: ['src/javascripts/ng-admin/**/**/*.js', 'src/javascripts/ng-admin/**/**/*.html'],
                tasks: ['requirejs:dev']
            },
            sass: {
                files: ['src/sass/*.scss'],
                tasks: ['build:dev']
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'src/javascripts/test/karma.conf.js',
                singleRun: true
            }
        },

        protractor: {
            e2e: {
                configFile: 'src/javascripts/test/protractor.conf.js',
                keepAlive: true,
                debug: true
            }
        },

        concurrent: {
            assets_all_dev: ['requirejs:dev', 'compass:dev'],
            connect_watch: ['connect::keepalive', 'watch']
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-json-server');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-karma');

    // register tasks
    if (parseInt(process.env.TRAVIS_PULL_REQUEST, 10) > 0) {
        grunt.registerTask('test', ['karma']);
    } else {
        grunt.registerTask('test', ['karma', 'init', 'build', 'connect', 'protractor']);
    }
    grunt.registerTask('test:local', ['karma', 'json_server', 'init', 'build:dev', 'connect', 'protractor']);
    grunt.registerTask('build:dev', ['concurrent:assets_all_dev', 'copy:css_dev', 'concat:css', 'clean']);
    grunt.registerTask('build', ['requirejs:prod', 'ngAnnotate', 'uglify', 'compass:prod', 'cssmin:combine', 'clean:build']);
    grunt.registerTask('init', ['copy:config']);

    // register default task
    grunt.registerTask('default', ['build:dev', 'json_server', 'concurrent:connect_watch']);
};
