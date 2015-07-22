/*global module*/

module.exports = function (grunt) {
    'use strict';

    // Define the configuration for all the tasks
    grunt.initConfig({
        copy: {
            test_build: {
                src: 'build/*',
                dest: 'src/javascripts/test/fixtures/examples/blog/'
            },
            test_sample_app: {
                src: 'examples/blog/*',
                dest: 'src/javascripts/test/fixtures/',
                options: {
                    process: function(content) {
                        return content.replace(/http\:\/\/localhost\:8080\//g, '/');
                    }
                }
            }
        },
        connect: {
            dev: {
                options: {
                    port: 8000,
                    base: 'examples/blog/',
                    keepalive: false,
                    livereload: false
                }
            },
            test: {
                options: {
                    port: 8000,
                    base: 'src/javascripts/test/fixtures/examples/blog/',
                    keepalive: false,
                    livereload: false
                }
            }
        },
        json_server: {
            stub: {
                options: {
                    port: 3000,
                    db: 'examples/blog/stub-server.json',
                    keepalive: false,
                    logger: false
                }
            }
        },
        karma: {
            unit: {
                configFile: 'src/javascripts/test/karma.conf.js',
                singleRun: process.env.KARMA_SINGLE_RUN !== 'false'
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
        },
        exec: {
            webpack: './node_modules/webpack/bin/webpack.js',
            webpack_watch: './node_modules/webpack-dev-server/bin/webpack-dev-server.js --colors'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-json-server');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['mochaTest', 'karma', 'test:e2e']);
    grunt.registerTask('test:e2e', ['test:e2e:prepare', 'json_server', 'connect:test', 'protractor']);
    grunt.registerTask('test:e2e:prepare', ['exec:webpack', 'copy:test_sample_app', 'copy:test_build']);

    grunt.registerTask('test:local', ['mochaTest', 'karma', 'test:local:e2e']);
    grunt.registerTask('test:local:e2e', ['test:e2e:prepare', 'json_server', 'connect:test', 'protractor']);

    grunt.registerTask('default', ['json_server', 'connect:dev', 'exec:webpack_watch']);
};
