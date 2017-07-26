/**
 * Created by kinneretzin on 25/12/2016.
 */

var Config = require('../config');

module.exports = {
    'Successful login test': function (client) {
        client.page.login()
            .navigate()
            .waitForElementNotVisible('@splashPage')
            .waitForElementVisible('@usernameField')
            .setValue('@usernameField', Config.admin)
            .setValue('@passwordField', Config.adminPass)
            .clickElement('@submitButton')
            .waitForElementNotVisible('@splashPage')
            .waitForElementVisible('@managerData')
            .assert.containsText('@managerData', Config.managerVersion)
            .assert.containsText('@tenantsDropdownText','default_tenant');

        client.end();
    },

    'Failed login test': function (client) {
        client.page.login()
            .navigate()
            .waitForElementNotVisible('@splashPage')
            .waitForElementVisible('@usernameField')
            .setValue('@usernameField', Config.user)
            .setValue('@passwordField', Config.pass + 'a')
            .clickElement('@submitButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', 'User unauthorized');

        client.end();
    }

};
