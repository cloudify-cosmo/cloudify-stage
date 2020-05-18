/**
 * Created by kinneretzin on 25/12/2016.
 */

const Config = require('../config');

module.exports = {
    'Successful login test': client => {
        client.page
            .login()
            .navigate()
            .waitForSplashPageNotVisible()
            .waitForElementVisible('@usernameField')
            .setElementValue('@usernameField', Config.admin)
            .setElementValue('@passwordField', Config.adminPass)
            .clickElement('@submitButton')
            .waitForSplashPageNotVisible()
            .waitForElementVisible('@statusIcon')
            .assert.containsText('@tenantsDropdownText', 'default_tenant');

        client.end();
    },

    'Failed login test': client => {
        client.page
            .login()
            .navigate()
            .waitForSplashPageNotVisible()
            .waitForElementVisible('@usernameField')
            .setElementValue('@usernameField', Config.user)
            .setElementValue('@passwordField', `${Config.pass}a`)
            .clickElement('@submitButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', `User unauthorized: Authentication failed for user ${Config.user}`);

        client.end();
    }
};
