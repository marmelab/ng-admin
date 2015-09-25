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
                        return content.replace(/http\:\/\/localhost\:8000\//g, '/');
                    }
                }
            },
            test_fakerest: {
                src: 'node_modules/fakerest/dist/FakeRest.min.js',
                dest: 'src/javascripts/test/fixtures/examples/blog/build/fakerest.js'
            },
            test_sinon_server: {
                src: 'node_modules/sinon/pkg/sinon-server-1.14.1.js',
                dest: 'src/javascripts/test/fixtures/examples/blog/build/sinon-server.js'
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
                    port: 8001,
                    base: 'src/javascripts/test/fixtures/examples/blog/',
                    keepalive: false,
                    livereload: false
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
        exec: {
            webpack: './node_modules/webpack/bin/webpack.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['karma', 'test:e2e']);
    grunt.registerTask('test:e2e', ['test:e2e:prepare', 'connect:test', 'protractor']);
    grunt.registerTask('test:e2e:prepare', ['exec:webpack', 'copy:test_sample_app', 'copy:test_build', 'copy:test_fakerest', 'copy:test_sinon_server']);

    grunt.registerTask('test:local', ['karma', 'test:local:e2e']);
    grunt.registerTask('test:local:e2e', ['test:e2e:prepare', 'connect:test', 'protractor']);
};
