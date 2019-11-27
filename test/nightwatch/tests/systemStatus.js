/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    'System status': function(client) {
        client.login();

        const page = client.page.page();

        page.section.statusIcon
            .waitForElementPresent('@statusIconGreen')
            .clickElement('@statusIconGreen')
            .assert.cssClassPresent('@statusIcon', 'green');

        page.waitForElementVisible('@statusesTitle').assert.containsText('@statusesTitle', 'System Status');

        client.end();
    }
};
