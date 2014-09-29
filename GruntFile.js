'use strict';

/**
 * grunt build          - clean and deploy development build to public/
 * grunt build-watch    - watch files for changes and rebuild
 * grunt test-unit      - run karma unit tests and generate coverage report
 * grunt test-watch     - run karma unit tests in watch mode
 * grunt test-e2e       - run protractor end to end integration tests
 * grunt clean          - clean all generated files
 * grunt clean:build    - clean build modules only
 * grunt clean:node     - clean npm modules only (remember to run 'npm install' again)
 *
 */
module.exports = function (grunt) {

    grunt.registerTask('build', ['clean:build', 'less', 'wiredep', 'concat', 'uglify']);

    grunt.registerTask('build-watch', ['build', 'watch']);

    grunt.registerTask('test-unit', ['clean:test', 'karma:unit', 'copy:coverageReport']);

    grunt.registerTask('test-e2e', ['build', 'protractor:test']);

    grunt.registerTask('test-watch', ['clean:test', 'karma:watch']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // https://www.npmjs.org/package/grunt-wiredep
        wiredep: {
            target: {
                src: [
                    'public/index.html'
                ],
                options: {
                    cwd: '',
                    dependencies: true,
                    devDependencies: false,
                    exclude: [ 'vendor/bootstrap/dist/css/bootstrap.css' ],
                    fileTypes: {},
                    ignorePath: '',
                    overrides: {}
                }
            }
        },

        // Compile our LESS sources
        // https://github.com/gruntjs/grunt-contrib-less
        less: {
            client: {
                options: {
                    paths: [ 'client/less', 'public/vendor/bootstrap/less' ],
                    concat: true
                },
                files: {
                    'public/css/app.css': 'client/less/styles.less'
                }
            }
        },

        // Concat our JavaScript client sources
        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            // Run this task with the 'grunt concat:client' command.
            client: {
                options: {
                    separator: '\n',
                    banner: "/*! <%= pkg.name %>-<%= pkg.version %> */\n'use strict';\n",
                    process: function (src, filepath) {
                        return '\n// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    }
                },
                src: [ 'processed/js/app.js', 'client/js/**/*.js'],
                dest: 'public/js/app.js'
            }
        },

        // Minimise our JavaScript client sources
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            // Run this task with the 'grunt uglify:client' command.
            client: {
                options: {
                    banner: '/*! <%= pkg.name %>-<%= pkg.version %> */\n',
                    mangle: false
                },
                files: {
                    'public/js/app.min.js': [ '<%= concat.client.dest %>' ]
                }
            }
        },

        // Clean
        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            // Run this task with the 'grunt clean:build' command.
            build: {
                src: [
                    'processed',
                    'public/js',
                    'public/css'
                ]
            },
            // Run this task with the 'grunt clean:test' command.
            test: {
                src: [
                    'test/reports',
                    'test/coverage'
                ]
            },
            // Run this task with the 'grunt clean:node' command.
            node: {
                src: [
                    'node_modules',
                    'public/vendor'
                ]
            }

        },

        // Watch the following files and execute the given tasks if they change
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['client/js/**/*.js'],
                tasks: ['concat', 'uglify']
            },
            css: {
                files: ['client/less/**/*.less'],
                tasks: ['less:client']
            },
            html: {
                files: ['public/index.html', 'public/partials/**/*.html']
            }

        },

        // Runs our karma tests
        // https://github.com/karma-runner/grunt-karma
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            },
            watch: {
                configFile: 'test/karma.conf.js',
                singleRun: false
            }
        },

        // Protractor
        // https://github.com/teerapap/grunt-protractor-runner
        protractor: {
            options: {
                configFile: 'node_modules/protractor/referenceConf.js',
                keepAlive: false,
                noColor: false
            },
            test: {
                configFile: 'test/e2e.conf.js',
                options: {
                    args: {
                        'baseUrl': 'http://localhost:63342/ucc-2014-camp/public/'
                    }
                }

            }

        }


    });;

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-wiredep');

};

