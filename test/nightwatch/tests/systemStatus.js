/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    'System status': function(client) {
        client.login();

        const page = client.page.page();

        page.waitForElementPresent('@statusIcon').assert.cssClassPresent('@statusIcon', 'green');

        page.moveToElement('@statusIcon', 5, 5)
            .waitForElementVisible('@statusTitle')
            .assert.containsText('@statusTitle', 'System Status')
            .waitForElementVisible('@statusManager')
            .assert.containsText('@statusManager', 'Manager')
            .assert.containsText('@statusDatabase', 'Database')
            .assert.containsText('@statusBroker', 'Message Broker');

        client.end();
    }
};
