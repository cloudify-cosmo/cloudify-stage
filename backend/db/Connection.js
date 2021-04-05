const { DbInitializer } = require('cloudify-ui-common/backend');
const dbConfig = require('../config').get().app.db;
const loggerFactory = require('../handler/LoggerHandler');

module.exports = new DbInitializer(dbConfig, loggerFactory, __dirname, ['Connection.js', 'types']);
