/**
 * Created by jakub.niezgoda on 2017-03-22.
 */

exports.command = function(callback) {
    return this.getLogTypes(result => {
        console.log(result);
    }).getLog('browser', result => {
        console.log(result);
    });
};
