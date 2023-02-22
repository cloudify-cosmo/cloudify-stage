/* eslint-disable node/no-unpublished-import,global-require,import/no-dynamic-require,no-console */
import { defaultsDeep, keys, merge, pick } from 'lodash';
import { writeJsonSync } from 'fs-extra';
import flatten from 'flat';

import { getResourcePath } from './utils';

import root from '../conf/config.json';
import app from '../conf/app.json';
import logging from '../conf/logging.json';
import dbOptions from '../conf/db.options.json';
import manager from '../conf/manager.json';
import type { Mode } from './serverSettings';
import type { Config, ClientConfig, UserConfig, UserDataConfig } from './routes/Config.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
let userConfig: UserConfig = require('../conf/userConfig.json');

let me: Partial<Config> | null = null;

function initUserConfig() {
    let userDataConfig: UserDataConfig;
    const userDataConfigPath = getResourcePath('userConfig.json', true);

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        userDataConfig = require(userDataConfigPath);
    } catch (err: any) {
        return;
    }

    let convertedSamlSection = false;

    // Backward-compatibility layer - convert `saml` section to `auth` section
    if (userDataConfig.saml?.enabled) {
        console.warn(
            `WARNING: You are using deprecated section "saml" in user configuration file (${userDataConfigPath}).`
        );

        const { certPath, portalUrl, ssoUrl } = userDataConfig.saml;

        userDataConfig.auth = {
            ...userDataConfig.auth,
            type: 'saml',
            certPath,
            loginPageUrl: ssoUrl,
            afterLogoutUrl: portalUrl
        };

        convertedSamlSection = true;
    }

    // Security reason - get only allowed parameters
    userDataConfig = pick(userDataConfig, keys(flatten(userConfig, { safe: true })));

    if (convertedSamlSection) {
        const newUserDataConfigPath = `${userDataConfigPath}.new`;
        writeJsonSync(newUserDataConfigPath, userDataConfig, { spaces: 2, EOL: '\n', encoding: 'utf8', flag: 'w' });
        console.warn(
            `WARNING: User configuration was migrated automatically and it is ` +
                `available at ${newUserDataConfigPath}. Please verify it and use it to replace ${userDataConfigPath}.`
        );
    }

    // Create full user configuration
    userConfig = defaultsDeep(userDataConfig, userConfig);
}

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

initUserConfig();
loadMeJson();

export function getConfig(mode?: Mode): Config {
    const config = {
        app: merge(app, root, logging, { db: { options: dbOptions } }, userConfig),
        manager,
        mode,
        managerUrl: `${manager.protocol}://${manager.ip}:${manager.port}`
    };

    merge(config, me);

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
                afterLogoutUrl: config.app.auth.afterLogoutUrl
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
