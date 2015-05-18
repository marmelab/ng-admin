/*global module*/

module.exports = function (grunt) {
    'use strict';

    // Define the configuration for all the tasks
    grunt.initConfig({
        copy: {
            css_dev: {
                src: 'build/ng-admin.min.css',
                dest: 'examples/blog/build/ng-admin.css',
                options: {
                    process: function(content) {
                        return content.replace(/url\("\.\.\/src\/javascripts\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap/g, 'url(".');
                    }
                }
            },
            fonts_dev: {
                cwd: 'src/javascripts/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/',
                src: ['**'],
                dest: 'examples/blog/build/',
                expand: true
            },
            assets_dev: {
                cwd: 'assets/',
                src: ['**'],
                dest: 'examples/blog/assets/',
                expand: true
            },
            js_dev: {
                src: 'build/ng-admin.min.js',
                dest: 'examples/blog/build/ng-admin.js'
            },
            css: {
                src: 'build/ng-admin.min.css',
                dest: 'examples/blog/build/ng-admin.min.css',
                options: {
                    process: function(content) {
                        return content.replace(/url\("\.\.\/src\/javascripts\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap/g, 'url(".');
                    }
                }
            },
            angular: {
                src: 'src/javascripts/bower_components/angular/angular.js',
                dest: 'examples/blog/build/angular.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'examples/blog/',
                    keepalive: true,
                    livereload: false
                }
            }
        },
        json_server: {
            stub: {
                options: {
                    port: 3000,
                    db: 'examples/blog/stub-server.json',
                    keepalive: false
                }
            }
        },
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
        mochaTest: {
            test: {
                options: {
                    require: 'mocha-traceur'
                },
                src: ['src/javascripts/ng-admin/es6/tests/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-json-server');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['mochaTest', 'karma', 'build', 'copy_build', 'connect', 'protractor']);
    grunt.registerTask('copy_build', ['copy:config', 'copy:angular', 'copy:js_dev', 'copy:css', 'copy:fonts_dev']);

    grunt.registerTask('test:local', ['mochaTest', 'karma', 'copy_build:dev', 'test:local:e2e']);
    grunt.registerTask('test:local:e2e', ['json_server', 'connect', 'protractor']);

    grunt.registerTask('default', ['copy:angular', 'json_server', 'connect']);
};
