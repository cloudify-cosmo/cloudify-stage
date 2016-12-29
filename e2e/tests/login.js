/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    'Login test': function (client) {

        var page = client.page.login();

        page.navigate()
            .waitForElementVisible('@ipField', 2000)
            .setValue('@ipField', '185.98.150.115')
            .setValue('@usernameField', 'admin')
            .setValue('@passwordField', 'NcM2YizuzatJ')
            .click('@submitButton')
            .waitForElementVisible('@tenantsDropdownText',5000)
            .assert.containsText('@tenantsDropdownText', 'default_tenant');

        client.end();
    }
};
