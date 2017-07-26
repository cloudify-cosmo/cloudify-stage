/**
 * Created by kinneretzin on 25/12/2016.
 */

var Config =require('../config');

module.exports = {
    'Manager IP and status': function (client) {
        client.login();

        var page = client.page.page();

        page.section.managerData
            .waitForElementPresent('@statusIconGreen')
            .clickElement('@version')
            .assert.containsText('@ip', Config.managerVersion)
            .assert.cssClassPresent('@statusIcon','green')

        page.waitForElementVisible('@statusesTitle')
            .assert.containsText('@statusesTitle','Server Services Status')
            .assert.containsText('@statusesName','Cloudify Composer')
            .assert.containsText('@statusesDesc','Cloudify Composer Service');

        client.end();
    }
};
