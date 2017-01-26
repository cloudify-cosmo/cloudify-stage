/**
 * Created by kinneretzin on 25/01/2017.
 */

var app = require('../conf/app.json');
var manager = require('../conf/manager.json');
var customer = require('../conf/customer.json');
var ServerSettings = require('./serverSettings');

module.exports = {
    get: function(mode) {
        var config = {
            app: app,
            manager: manager,
            mode: mode
        };

        if (mode === ServerSettings.MODE_CUSTOMER) {
            config.customer = customer;
        }

        return config;
    }
};
