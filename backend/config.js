/**
 * Created by kinneretzin on 25/01/2017.
 */

var app = require('../conf/app.json');
var manager = require('../conf/manager.json');
var customer = require('../conf/customer.json');
var widgets = require('../conf/widgets.json');
var ServerSettings = require('./serverSettings');

module.exports = {
    get: function(mode) {
        var config = {
            app: app,
            manager: manager,
            mode: mode,
            widgets: widgets
        };

        if (mode === ServerSettings.MODE_CUSTOMER) {
            config.customer = customer;
        }

        return config;
    },

    getForClient: function(mode) {
        var config = this.get(mode);
        // For client only get from app config the relevant part (and not send passwords and shit)
        config.app = {
            initialTemplate: config.app.initialTemplate,
            singleManager: config.app.singleManager,
            whiteLabel : config.app.whiteLabel
        };
        return config;
    }
};
