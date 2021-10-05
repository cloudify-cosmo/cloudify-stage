// @ts-nocheck File not migrated fully to TS

import path from 'path';

import { DbInitializer } from 'cloudify-ui-common/backend';
import { getConfig } from '../config';
import loggerFactory from '../handler/LoggerHandler';

import ApplicationsModel from './models/ApplicationsModel';
import BlueprintAdditionsModel from './models/BlueprintAdditionsModel';
import BlueprintUserDataModel from './models/BlueprintUserDataModel';
import ClientConfigsModel from './models/ClientConfigsModel';
import ResourcesModel from './models/ResourcesModel';
import UserAppsModel from './models/UserAppsModel';
import WidgetBackendsModel from './models/WidgetBackendsModel';

const dbInitializer = new DbInitializer(getConfig().app.db, loggerFactory, [
    ApplicationsModel,
    BlueprintAdditionsModel,
    BlueprintUserDataModel,
    ClientConfigsModel,
    ResourcesModel,
    UserAppsModel,
    WidgetBackendsModel
]);

export const { db } = dbInitializer;

export default dbInitializer;
