/**
 * Created by kinneretzin on 02/10/2016.
 */

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.registerTask("prepareModules", "Finds and prepares modules for concatenation.", function() {

        // get the current concat object from initConfig
        var browserify = grunt.config.get('browserify') || {};
        var babel = grunt.config.get('babel') || {};

        // get all module directories
        grunt.file.expand("widgets/**/src").forEach(function (dir) {

            var destDir = dir.substr(0,dir.lastIndexOf('/src'));

            // get the module name from the directory name
            var dirName = destDir.substr(destDir.lastIndexOf('/')+1);

            // create a subtask for each module, find all src files
            // and combine into a single js file per module
            if (dirName === 'common') {
                browserify.widgets.files[destDir+'/common.js'] = [dir + '/**/*.js'];
                browserify.dist.files[destDir+'/common.js'] = [dir + '/**/*.js'];
            } else {
                browserify.widgets.files[destDir+'/widget.js'] = [dir + '/**/*.js', '!' + dir + '/**/backend.js'];
                browserify.dist.files[destDir+'/widget.js'] = [dir + '/**/*.js', '!' + dir + '/**/backend.js'];
                if (grunt.file.exists(dir, 'backend.js')) {
                    babel.dist.files[destDir+'/backend.js'] = [dir + '/**/backend.js'];
                }
            }
        });

        // add module subtasks to the concat task in initConfig
        grunt.config.set('browserify', browserify);
        grunt.config.set('babel', babel);
        console.log('Widget files:' ,browserify.widgets.files);
        console.log('Backend files:' ,babel.dist.files);
        
    });

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                }
            }
        },
        browserify: {
            options: {
                transform: [[require('babelify')]],
                browserifyOptions: {
                    debug: true,
                }
            },
            widgets: {
                files: {
                },
                options: {
                    watch: true,
                    keepAlive: true
                }
            },
            dist: {
                files: {
                },
                options: {
                }
            }
        }
    });

    grunt.registerTask('widgets',
        [
            'prepareModules',
            'babel:dist',
            'browserify:widgets'
        ]);
    grunt.registerTask('backend',
        [
            'prepareModules',
            'babel:dist'
        ]);
    grunt.registerTask('build',
        [
            'prepareModules',
            'babel:dist',
            'browserify:dist',
        ]);

};
