import { runMigration } from 'cloudify-ui-common-backend';
import loggerFactory from './handler/LoggerHandler';
import dbModule from './db/Connection';

runMigration(loggerFactory, dbModule);
