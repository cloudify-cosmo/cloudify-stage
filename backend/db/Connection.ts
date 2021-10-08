import { getDbModule } from 'cloudify-ui-common/backend';
import { getConfig } from '../config';
import loggerFactory from '../handler/LoggerHandler';

import ApplicationsModel from './models/ApplicationsModel';
import BlueprintAdditionsModel from './models/BlueprintAdditionsModel';
import BlueprintUserDataModel from './models/BlueprintUserDataModel';
import ClientConfigsModel from './models/ClientConfigsModel';
import ResourcesModel from './models/ResourcesModel';
import UserAppsModel from './models/UserAppsModel';
import WidgetBackendsModel from './models/WidgetBackendsModel';

const dbModule = getDbModule(getConfig().app.db, loggerFactory, [
    ApplicationsModel,
    BlueprintAdditionsModel,
    BlueprintUserDataModel,
    ClientConfigsModel,
    ResourcesModel,
    UserAppsModel,
    WidgetBackendsModel
]);

export const { db } = dbModule;

export default dbModule;
