import { getDbModule } from 'cloudify-ui-common/backend';
import { getConfig } from '../config';
import loggerFactory from '../handler/LoggerHandler';

import BlueprintUserDataModel from './models/BlueprintUserDataModel';
import ResourcesModel from './models/ResourcesModel';
import UserAppsModel from './models/UserAppsModel';
import WidgetBackendsModel from './models/WidgetBackendsModel';

const dbModule = getDbModule(getConfig().app.db, loggerFactory, [
    BlueprintUserDataModel,
    UserAppsModel,
    WidgetBackendsModel
]);

export const { db } = dbModule;

export default dbModule;
