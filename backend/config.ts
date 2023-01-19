/* eslint-disable node/no-unpublished-import,global-require,import/no-dynamic-require */
import _ from 'lodash';
import flatten from 'flat';

import { getResourcePath } from './utils';

import root from '../conf/config.json';
import app from '../conf/app.json';
import logging from '../conf/logging.json';
import dbOptions from '../conf/db.options.json';
import manager from '../conf/manager.json';
import type { Mode } from './serverSettings';
import type { Config, ClientConfig, UserConfig } from './routes/Config.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
let userConfig: UserConfig = require('../conf/userConfig.json');

try {
    const userDataConfigPath = getResourcePath('userConfig.json', true);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let userDataConfig: Partial<UserConfig> = require(userDataConfigPath);
    userDataConfig = _.pick(userDataConfig, _.keys(flatten(userConfig, { safe: true }))); // Security reason - get only allowed parameters
    userConfig = _.defaultsDeep(userDataConfig, userConfig); // Create full user configuration
} catch (err: any) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}

let me: Partial<Config> | null = null;

export function loadMeJson() {
    try {
        // eslint-disable-next-line import/no-unresolved
        me = require('../conf/me.json');
    } catch (err: any) {
        if (err.code !== 'MODULE_NOT_FOUND') {
            throw err;
        }
    }
}

loadMeJson();

export function getConfig(mode?: Mode): Config {
    const config = {
        app: _.merge(app, root, logging, { db: { options: dbOptions } }, userConfig),
        manager,
        mode,
        managerUrl: `${manager.protocol}://${manager.ip}:${manager.port}`
    };

    _.merge(config, me);

    return config;
}

export function getClientConfig(mode: Mode): ClientConfig {
    const config = getConfig(mode);

    // For client only get from app config the relevant part (and not send passwords and shit)
    return {
        app: {
            maintenancePollingInterval: config.app.maintenancePollingInterval,
            whiteLabel: userConfig.whiteLabel,
            auth: {
                type: config.app.auth.type,
                loginPageUrl: config.app.auth.loginPageUrl,
                logoutRedirectUrl: config.app.auth.logoutRedirectUrl
            },
            maps: userConfig.maps
        },
        manager: {
            ip: config.manager.ip
        },
        mode
    };
}

export function getBackendConfig() {
    const { backend } = getConfig().app;
    return { host: backend?.host ?? 'localhost', port: backend?.port ?? 8088 };
}
