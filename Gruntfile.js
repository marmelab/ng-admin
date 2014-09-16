'use strict';

module.exports = function (grunt) {

    // Define the configuration for all the tasks
    grunt.initConfig({

        requirejs: grunt.file.readJSON('grunt/grunt-requirejs.json'),
        compass: grunt.file.readJSON('grunt/grunt-compass.json'),

        ngAnnotate: {
            ngadmin: {
                src: ['src/build/common.js', 'src/build/ng-admin.js', 'src/build/app.js']
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/build/common.js', 'src/build/ng-admin.js', 'src/build/app.js'],
                dest: 'src/build/ng-admin.min.js'
            }
        },

        clean: {
            build: ["src/build/app", "src/build/bower_components", "src/build/*.js", "!src/build/*.min.js"]
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'src/',
                    keepalive: true
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            configFiles: {
                files: ['Gruntfile.js','grunt/grunt-*.json'],
                tasks: ['concurrent:assets_all_dev'],
                options: {
                    // reload watchers since configuration may have changed
                    reload: true
                }
            },
            javascripts: {
                files: ['src/**/*.js', 'src/**/*.html'],
                tasks: ['assets:js']
            },
            sass: {
                files: ['sass/*.scss'],
                tasks: ['assets:css']
            },
            livereload: {
                files: [
                    // livereload for css files will only inject files without reloading the page
                    'assets/css/**/*.css',
                    // livereload
                    'require/*.js'
                ],
                options: {
                    // true -> livereload active, but on default port 35729 (provide a number to set the port)
                    livereload: true,
                    // debounced since several changes can happen at the same time
                    debounceDelay: 500
                }
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        concurrent: {
            assets_all_dev: ['requirejs:dev', 'compass:dev'],
            assets_all_prod: ['requirejs:prod', 'compass:prod'],
            connect_watch: ['connect', 'watch']
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-karma');

    // register tasks
    grunt.registerTask('assets:js', ['requirejs:dev']);
    grunt.registerTask('assets:css', ['compass:dev']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('build', ['requirejs:prod', 'ngAnnotate', 'concat', 'clean:build']);

    // register default task
    grunt.registerTask('default', ['concurrent:assets_all_dev', 'concurrent:connect_watch']);
};
