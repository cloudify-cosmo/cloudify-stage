/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(widgetId, callback) {
    return this.isPresent('.widget.' + widgetId + 'Widget', callback);
};