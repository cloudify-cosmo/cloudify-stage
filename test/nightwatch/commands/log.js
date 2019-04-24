/**
 * Created by jakubniezgoda on 2017-06-01.
 */

var _ = require('lodash');

exports.command = function() {
    return this.perform(() => {
        const LOG_PREFIX = '--';
        const getString = (variable) => _.isObject(variable) ? JSON.stringify(variable) : variable

        let logString = '';
        _.each(arguments, (argument) => logString += ' ' + getString(argument));

        console.log(LOG_PREFIX + logString);
    });
};