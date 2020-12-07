const { runMigration } = require('cloudify-ui-common/backend');
const loggerFactory = require('./handler/LoggerHandler');
const dbModule = require('./db/Connection');

runMigration(loggerFactory, dbModule);
