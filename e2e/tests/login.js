/**
 * Created by kinneretzin on 25/12/2016.
 */

var Config = require('../config.json');

module.exports = {
    'Successful login test': function (client) {

        var page = client.page.login();

        page.navigate()
            .waitForElementVisible('@ipField', 2000)
            .clearValue('@ipField')
            .setValue('@ipField', Config.managerIp)
            .setValue('@usernameField', Config.admin)
            .setValue('@passwordField', Config.adminPass)
            .click('@submitButton')
            .waitForElementVisible('@managerData',5000)
            .assert.containsText('@managerData', Config.managerIp)
            .assert.containsText('@tenantsDropdownText','default_tenant');

        client.end();
    },
    'Failed login test': function (client) {

        var page = client.page.login();

        page.navigate()
            .waitForElementVisible('@ipField', 2000)
            .clearValue('@ipField')
            .setValue('@ipField', Config.managerIp)
            .setValue('@usernameField', Config.user)
            .setValue('@passwordField', Config.pass + 'a')
            .click('@submitButton')
            .waitForElementVisible('@errorMessage',5000)
            .assert.containsText('@errorMessage', 'User unauthorized');
        client.end();
    }

};
