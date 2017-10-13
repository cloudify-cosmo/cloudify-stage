/**
 * Created by kinneretzin on 25/01/2017.
 */

var app = require('../conf/app.json');
var manager = require('../conf/manager.json');
var customer = require('../conf/customer.json');
var widgets = require('../conf/widgets.json');
var log4jsConfig = require('../conf/log4jsConfig.json');
var ServerSettings = require('./serverSettings');

var me = null;
try {
    me = require('../conf/me.json');
} catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}
var _ = require('lodash');


module.exports = {
    get: function(mode) {
        var config = {
            app: app,
            manager: manager,
            mode: mode,
            widgets: widgets,
            log4jsConfig: log4jsConfig
        };

        if (mode === ServerSettings.MODE_CUSTOMER) {
            config.customer = customer;
        }

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
                singleManager: config.app.singleManager,
                whiteLabel : config.app.whiteLabel,
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
            widgets: config.widgets
        };

        if(config.customer){
            clientConfig.customer = config.customer;
        }

        return clientConfig;
    }
};
