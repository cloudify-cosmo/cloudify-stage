/* eslint-disable node/no-unpublished-import */
import type app from '../../conf/app.json';
import type root from '../../conf/config.json';
import type logging from '../../conf/logging.json';
import type dbOptions from '../../conf/db.options.json';
import type userConfig from '../../conf/userConfig.json';
import type manager from '../../conf/manager.json';
import type { Mode } from '../serverSettings';

export type UserConfig = typeof userConfig;

export type AppConfig = typeof app &
    typeof root &
    typeof logging & { db: { options: typeof dbOptions } } & typeof userConfig;

export interface Config {
    app: AppConfig;
    manager: typeof manager;
    mode?: Mode;
    managerUrl: string;
}

export interface ClientConfig {
    app: {
        maintenancePollingInterval: AppConfig['maintenancePollingInterval'];
        singleManager: AppConfig['singleManager'];
        whiteLabel: AppConfig['whiteLabel'];
        saml: Omit<AppConfig['saml'], 'certPath'>;
        maps: typeof userConfig['maps'];
    };
    manager: {
        ip: Config['manager']['ip'];
    };
    mode: Mode;
}

export type GetConfigResponse = ClientConfig;
