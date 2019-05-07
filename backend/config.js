/**
 * Created by kinneretzin on 25/01/2017.
 */

const _ = require('lodash');
const flatten = require('flat');

const Utils = require('./utils');

const app = require('../conf/app.json');
const manager = require('../conf/manager.json');
let userConfig = require('../conf/userConfig.json');

try {
    const userDataConfigPath = Utils.getResourcePath('userConfig.json', true);
    let userDataConfig = require(userDataConfigPath);
    userDataConfig = _.pick(userDataConfig, _.keys(flatten(userConfig, {safe: true}))); // Security reason - get only allowed parameters
    userConfig = _.defaultsDeep(userDataConfig, userConfig); // Create full user configuration
} catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}

let me = null;
try {
    me = require('../conf/me.json');
} catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}


module.exports = {
    get: function(mode) {
        let config = {
            app: _.merge(app, userConfig),
            manager: manager,
            mode: mode
        };

        _.merge(config, me);

        config.managerUrl = manager.protocol + '://' + manager.ip + ':' + manager.port;

        return config;
    },

    getForClient: function(mode) {
        let config = this.get(mode);

        // For client only get from app config the relevant part (and not send passwords and shit)
        return {
            app: {
                initialTemplate: config.app.initialTemplate,
                maintenancePollingInterval: config.app.maintenancePollingInterval,
                singleManager: config.app.singleManager,
                whiteLabel : userConfig.whiteLabel,
                saml: {
                    enabled: config.app.saml.enabled,
                    ssoUrl: config.app.saml.ssoUrl,
                    portalUrl: config.app.saml.portalUrl
                }
            },
            manager: {
                ip: config.manager.ip
            },
            mode: config.mode,
        };
    }
};
