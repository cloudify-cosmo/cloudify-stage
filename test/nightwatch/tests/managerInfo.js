/**
 * Created by kinneretzin on 25/12/2016.
 */


module.exports = {
    'Manager status': function (client) {
        client.login();

        var page = client.page.page();

        page.section.managerData
            .waitForElementPresent('@statusIconGreen')
            .clickElement('@statusIconGreen')
            .assert.cssClassPresent('@statusIcon','green');

        page.waitForElementVisible('@statusesTitle')
            .assert.containsText('@statusesTitle','Manager Services Status');

        client.end();
    }
};
