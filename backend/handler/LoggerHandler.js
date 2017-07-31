'use strict';
/**
 * Created by jakubniezgoda on 17/07/2017.
 */

var log4js = require('log4js');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');


module.exports = (function() {

    function _getAppenderFile(appenderObject) {
        return _.get(appenderObject, 'filename') || _.get(appenderObject, 'appender.filename');
    }

    function _getLogDirectory(logFile) {
        return path.dirname(path.resolve(__dirname, logFile));
    }

    function _preConfigureLog4js(log4jsConfig) {
        let logFiles = _.filter(_.map(log4jsConfig.appenders[0].appenders, _getAppenderFile), _.isString);
        let logDirectories = _.uniq(_.map(logFiles, _getLogDirectory));

        try {
            _.forEach(logDirectories, function (logDirectory) {
                console.log('Setting up logs directory:', logDirectory);
                mkdirp.sync(logDirectory)
            });
        } catch (e) {
            console.error('Could not set up directory, error was:', e);
            process.exit(1);
        }
    }

    function init(log4jsConfig) {
        _preConfigureLog4js(log4jsConfig);
        log4js.configure(log4jsConfig);
    }

    return {
        init
    }
})();
