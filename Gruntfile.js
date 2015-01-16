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
            },
            config: {
                src: 'examples/blog/config.js',
                dest: 'examples/blog/config.js',
                options: {
                    process: function (content) {
                        return process.env.CI ? content.replace(/http:\/\/localhost:3000\//g, 'http://ng-admin.marmelab.com:8081/') : content;
                    }
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'examples/blog/',
                    keepalive: false,
                    livereload: true
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
                tasks: ['requirejs:dev', 'copy:js_dev'],
                options: {
                    atBegin: true,
                    livereload: true
                }
            },
            sass: {
                files: ['src/sass/*.scss'],
                tasks: ['compass:dev', 'concat:css', 'copy:fonts_dev', 'copy:css_dev'],
                options: {
                    atBegin: true,
                    livereload: true
                }
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
    grunt.loadNpmTasks('grunt-karma');

    // register tasks
    grunt.registerTask('test', ['karma', 'build', 'copy_build', 'connect', 'protractor']);
    grunt.registerTask('build', ['requirejs:prod', 'ngAnnotate', 'uglify', 'compass:prod', 'cssmin:combine', 'clean:build']);
    grunt.registerTask('copy_build', ['copy:config', 'copy:angular', 'copy:js_dev', 'copy:css', 'copy:fonts_dev']);

    grunt.registerTask('test:local', ['karma', 'test:local:e2e']);
    grunt.registerTask('test:local:e2e', ['build:dev', 'copy_build:dev', 'json_server', 'connect', 'protractor']);
    grunt.registerTask('build:dev', ['requirejs:dev', 'compass:dev', 'concat:css']);
    grunt.registerTask('copy_build:dev', ['copy:js_dev', 'copy:angular', 'copy:css_dev', 'copy:fonts_dev', 'clean']);

    // register default task
    grunt.registerTask('default', ['copy:angular', 'json_server', 'connect', 'watch']);
};
