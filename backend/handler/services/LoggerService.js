/**
 * Created by jakubniezgoda on 06/11/2017.
 */

const LoggerHandler = require('../LoggerHandler');

module.exports = (() => (category = '') => LoggerHandler.getLogger(`WidgetBackend${category ? `-${category}` : ''}`))();
