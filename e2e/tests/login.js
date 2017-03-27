/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    'Successful login test': function (client) {

        var page = client.page.login();

        page.navigate()
            .waitForElementVisible('@ipField', 2000)
            .clearValue('@ipField')
            .setValue('@ipField', '10.239.3.79')
            .setValue('@usernameField', 'admin')
            .setValue('@passwordField', 'admin')
            .click('@submitButton')
            .waitForElementVisible('@managerData',5000)
            .assert.containsText('@managerData', '10.239.3.79')
            .assert.containsText('@tenantsDropdownText','default_tenant');

        client.end();
    },
    'Failed login test': function (client) {

        var page = client.page.login();

        page.navigate()
            .waitForElementVisible('@ipField', 2000)
            .clearValue('@ipField')
            .setValue('@ipField', '10.239.3.79')
            .setValue('@usernameField', 'admin')
            .setValue('@passwordField', 'a')
            .click('@submitButton')
            .waitForElementVisible('@errorMessage',5000)
            .assert.containsText('@errorMessage', 'User unauthorized');
        client.end();
    }

};
