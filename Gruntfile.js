
'use strict';

exports = module.exports = function( grunt ) {
    grunt.initConfig({
        mocha: {
            test: {
                src: [ 'test/index.html' ],
                options: {
                    run: true,
                    reporter: 'List',
                    timeout: 5000
                }
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-mocha' );

    grunt.registerTask('default', ['mocha:test']);
};
