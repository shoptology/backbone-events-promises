
'use strict';

exports = module.exports = function( grunt ) {
    grunt.initConfig({
        docco: {
            options: {
                layout: "linear",
                output: "docs/"
            },
            all: {
                files: {
                    src: ['backbone-events-promises.js']
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            src: ['**']
        },
        mocha: {
            src: [ 'test/index.html' ],
            options: {
                run: true,
                reporter: 'List',
                timeout: 5000
            }
        },
        uglify: {
            build: {
                options: {
                    sourceMap: true,
                    preserveComments: 'some',
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'backbone-events-promises.min.js': ['backbone-events-promises.js']
                }
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-docco-multi' );
    grunt.loadNpmTasks( 'grunt-mocha' );
    grunt.loadNpmTasks( 'grunt-gh-pages' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask('default', ['mocha', 'docco', 'uglify']);

};
