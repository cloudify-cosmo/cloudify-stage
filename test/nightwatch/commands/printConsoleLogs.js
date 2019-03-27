/**
 * Created by jakub.niezgoda on 2017-03-22.
 */

exports.command = function (callback) {
    return this
        .getLogTypes(function(result) {
            console.log(result);
        })
        .getLog('browser', function(result) {
            console.log(result);
        });
};