/**
 * Created by kinneretzin on 02/10/2016.
 */

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.registerTask("prepareModules", "Finds and prepares modules for concatenation.", function() {

        // get all module directories
        grunt.file.expand("plugins/**/src").forEach(function (dir) {


            // get the current concat object from initConfig
            var browserify = grunt.config.get('browserify') || {};

            var destDir = dir.substr(0,dir.lastIndexOf('/src'));

            // get the module name from the directory name
            var dirName = destDir.substr(destDir.lastIndexOf('/')+1);

            // create a subtask for each module, find all src files
            // and combine into a single js file per module
            browserify.plugins.files[destDir+'/widget.js'] = [dir + '/**/*.js'];
            browserify.dist.files[destDir+'/widget.js'] = [dir + '/**/*.js'];
            //    src: [dir + '/**/*.js'],
            //    dest: destDir+'/widget.js'
            //};

            // add module subtasks to the concat task in initConfig
            grunt.config.set('browserify', browserify);

            console.log(browserify.plugins.files);
        });
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
            plugins: {
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
        //babel: {
        //    plugins: {
        //        files: [{
        //            "expand": true,
        //            "cwd": "plugins/",
        //            "src": ["*/src/**/*.js"],
        //            "dest": ".tmp",
        //            //rename: function (dest,src) {
        //            //    var pluginLib = src.substring(0,src.indexOf('/src'));
        //            //    return pluginLib + '/widget-1.js';
        //            //},
        //            "ext": ".js",
        //            extDot: 'first'
        //        }]
        //    }
        //},
        //concat: {
        //    // Being built with prepareModules
        //},
        //copy: {
        //    plugins: {
        //        files: [
        //            {
        //                expand: true,
        //                cwd: '.tmp',
        //                src: ['*/widget.js'],
        //                dest: 'plugins',
        //                filter: 'isFile'
        //            }
        //        ]
        //    }
        //},
        //watch: {
        //    plugins: {
        //        files: ['plugins/**/src/*.js'],
        //        //tasks: ['buildPlugins'],
        //        options: {
        //            spawn: false
        //        }
        //    }
        //}
    });

    //grunt.registerTask('buildPlugins',
    //    [
    //        'babel:plugins',
    //        'prepareModules',
    //        'concat',
    //        'copy:plugins'
    //    ]);
    //
    //grunt.registerTask('watchPlugins',
    //    [
    //        'clean',
    //        'buildPlugins',
    //        'watch:plugins'
    //    ]);
    //
    //grunt.registerTask('default',
    //    [
    //        'clean',
    //        'buildPlugins'
    //    ]);

    grunt.registerTask('plugins',
        [
            'prepareModules',
            'browserify:plugins'
        ]);
    grunt.registerTask('build',
        [
            'prepareModules',
            'browserify:dist'
        ]);

};
