import { getDbModule } from 'cloudify-ui-common-backend';
import type { DbConfig } from 'cloudify-ui-common-backend';
import { getConfig } from '../config';
import loggerFactory from '../handler/LoggerHandler';

import BlueprintUserDataModel from './models/BlueprintUserDataModel';
import UserAppsModel from './models/UserAppsModel';
import WidgetBackendsModel from './models/WidgetBackendsModel';

// NOTE: app.db.options.dialectOptions.ssl is defined as boolean in the main configuration file,
// but manager installer overrides it, so that app.options.dialectOptions.ssl has object structure
// as defined in `DialectOptions` type in `cloudify-ui-common-backend`
const dbModule = getDbModule(getConfig().app.db as unknown as DbConfig, loggerFactory, [
    BlueprintUserDataModel,
    UserAppsModel,
    WidgetBackendsModel
]);

export const { db } = dbModule;

export default dbModule;
