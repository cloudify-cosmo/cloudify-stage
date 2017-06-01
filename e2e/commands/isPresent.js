/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(selector, callback) {
    return this.element('css selector', selector, result => {
        if (callback) {
            result.value = !!(result.value && result.value.ELEMENT);
            callback(result);
        }
    });
};