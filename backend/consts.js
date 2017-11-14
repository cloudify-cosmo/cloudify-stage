/**
 * Created by jakubniezgoda on 07/11/2017.
 */
var _ = require('lodash');

module.exports = {
    WIDGET_ID_HEADER: 'widget-id',
    ALLOWED_METHODS_OBJECT: {get: 'GET', post: 'POST', put: 'PUT', delete: 'DELETE', patch: 'PATCH'},
};

module.exports.ALLOWED_METHODS_ARRAY = _.values(module.exports.ALLOWED_METHODS_OBJECT);
