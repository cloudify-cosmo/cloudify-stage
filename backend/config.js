/**
 * Created by kinneretzin on 25/01/2017.
 */

var _ = require('lodash');
var flatten = require('flat');
var pathlib = require('path');
var fs = require('fs-extra');

var Consts = require('./consts');

var app = require('../conf/app.json');
var manager = require('../conf/manager.json');
var log4jsConfig = require('../conf/log4jsConfig.json');
var userConfig = require('../conf/userConfig.json');

var userDataConfigPath = pathlib.resolve(`..${Consts.USER_DATA_PATH}/userConfig.json`);
if (!fs.existsSync(userDataConfigPath)) {
    userDataConfigPath = pathlib.resolve(`../dist${Consts.USER_DATA_PATH}/userConfig.json`);
}
console.log(`Trying to fetch user config from: ${userDataConfigPath}`);

try {
    var userDataConfig = require(userDataConfigPath);
    userDataConfig = _.pick(userDataConfig, _.keys(flatten(userConfig))); // Security reason - get only allowed parameters
    userConfig = _.defaultsDeep(userDataConfig, userConfig); // Create full user configuration
} catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}

var me = null;
try {
    me = require('../conf/me.json');
} catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}


module.exports = {
    get: function(mode) {
        var config = {
            app: _.merge(app, userConfig),
            manager: manager,
            mode: mode,
            log4jsConfig: log4jsConfig
        };

        _.merge(config, me);

        config.managerUrl = manager.protocol + '://' + manager.ip + ':' + manager.port;

        return config;
    },

    getForClient: function(mode) {
        var config = this.get(mode);
        // For client only get from app config the relevant part (and not send passwords and shit)
        var clientConfig = {
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

        return clientConfig;
    }
};
