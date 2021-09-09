// @ts-nocheck File not migrated fully to TS

import path from 'path';

import { DbInitializer } from 'cloudify-ui-common/backend';
import { getConfig } from '../config';
import loggerFactory from '../handler/LoggerHandler';

const dbInitializer = new DbInitializer(getConfig().app.db, loggerFactory, path.resolve(__dirname, 'models'));

export const { db } = dbInitializer;

export default dbInitializer;
