/**
 * Created by kinneretzin on 25/12/2016.
 */

var Config =require('../config.json');

module.exports = {
    'Manger IP and status': function (client) {
        client.login();

        var page = client.page.page();

        page.section.managerData
            .assert.containsText('@ip', Config.managerIp)
            .waitForElementPresent('@statusIconGreen')
            .assert.cssClassPresent('@statusIcon','green')
            .moveToElement('@ip', 10, 10);

        page.waitForElementVisible('@statusesTitle')
            .assert.containsText('@statusesTitle','Server Services Status')
            .assert.containsText('@statusesName','InfluxDB')
            .assert.containsText('@statusesDesc','InfluxDB Service');

        client.end();
    }
};
