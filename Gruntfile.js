/**
 * Created by kinneretzin on 02/10/2016.
 */

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
    require('grunt-contrib-uglify')(grunt);

    grunt.registerTask("prepareModules", "Finds and prepares modules for concatenation.", function() {

        // get the current concat object from initConfig
        var browserify = grunt.config.get('browserify') || {};
        var uglify = grunt.config.get('uglify') || {};

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
                uglify.dist.files[destDir+'/common.js'] = [destDir + '/common.js'];
            } else {
                browserify.widgets.files[destDir+'/widget.js'] = [dir + '/**/*.js'];
                browserify.dist.files[destDir+'/widget.js'] = [dir + '/**/*.js'];
                uglify.dist.files[destDir+'/widget.js'] = [destDir + '/widget.js'];
            }
        });

        // add module subtasks to the concat task in initConfig
        grunt.config.set('browserify', browserify);
        grunt.config.set('uglify', uglify);
        console.log('browserify files:' ,browserify.widgets.files);

    });

    grunt.initConfig({
        //clean: ['.tmp'],
        browserify: {
            options: {
                transform: [[require('babelify')]],
                browserifyOptions: {
                    debug: true
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
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: {
                }
            }
        }
    });

    grunt.registerTask('widgets',
        [
            'prepareModules',
            'browserify:widgets'
        ]);
    grunt.registerTask('build',
        [
            'prepareModules',
            'browserify:dist',
            'uglify:dist'
        ]);

};
