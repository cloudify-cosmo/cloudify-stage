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
        return _.get(appenderObject, 'filename');
    }

    function _getLogDirectory(logFile) {
        return path.dirname(path.resolve(__dirname, logFile));
    }

    function _preConfigureLog4js(log4jsConfig) {
        const appenders = _.keys(log4jsConfig.appenders);
        const logFiles = _.filter(_.map(appenders, (appender) => _getAppenderFile(log4jsConfig.appenders[appender])), _.isString);
        const logDirectories = _.uniq(_.map(logFiles, _getLogDirectory));

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
