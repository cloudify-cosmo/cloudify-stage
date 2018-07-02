/**
 * Created by jakubniezgoda on 07/11/2017.
 */
let _ = require('lodash');

module.exports = {
    ALLOWED_METHODS_OBJECT: {get: 'GET', post: 'POST', put: 'PUT', delete: 'DELETE', patch: 'PATCH'},
    CONTEXT_PATH: '/console',
    USER_DATA_PATH: '/userData',
    WIDGET_ID_HEADER: 'widget-id'
};

module.exports.ALLOWED_METHODS_ARRAY = _.values(module.exports.ALLOWED_METHODS_OBJECT);
