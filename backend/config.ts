// @ts-nocheck File not migrated fully to TS
/* eslint-disable node/no-unpublished-import,global-require,import/no-dynamic-require */
import _ from 'lodash';
import flatten from 'flat';

import { getResourcePath } from './utils';

import root from '../conf/config.json';
import app from '../conf/app.json';
import logging from '../conf/logging.json';
import dbOptions from '../conf/db.options.json';
import manager from '../conf/manager.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
let userConfig = require('../conf/userConfig.json');

try {
    const userDataConfigPath = getResourcePath('userConfig.json', true);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let userDataConfig = require(userDataConfigPath);
    userDataConfig = _.pick(userDataConfig, _.keys(flatten(userConfig, { safe: true }))); // Security reason - get only allowed parameters
    userConfig = _.defaultsDeep(userDataConfig, userConfig); // Create full user configuration
} catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}

let me = null;

export function loadMeJson() {
    try {
        me = require('../conf/me.json');
    } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
            throw err;
        }
    }
}

loadMeJson();

export function getConfig(mode) {
    const config = {
        app: _.merge(app, root, logging, { db: { options: dbOptions } }, userConfig),
        manager,
        mode
    };

    _.merge(config, me);

    config.managerUrl = `${manager.protocol}://${manager.ip}:${manager.port}`;

    return config;
}

export function getClientConfig(mode) {
    const config = getConfig(mode);

    // For client only get from app config the relevant part (and not send passwords and shit)
    return {
        app: {
            initialTemplate: config.app.initialTemplate,
            maintenancePollingInterval: config.app.maintenancePollingInterval,
            singleManager: config.app.singleManager,
            whiteLabel: userConfig.whiteLabel,
            saml: {
                enabled: config.app.saml.enabled,
                ssoUrl: config.app.saml.ssoUrl,
                portalUrl: config.app.saml.portalUrl
            },
            maps: userConfig.maps
        },
        manager: {
            ip: config.manager.ip
        },
        mode: config.mode
    };
}
