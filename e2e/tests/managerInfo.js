/**
 * Created by kinneretzin on 25/12/2016.
 */

var Login = require('../utils/login');
var Config =require('../config.json');

module.exports = {
    'Manger IP and status': function (client) {

        var page = client.page.page();

        Login(client);

        var managerDataSection = page.section.managerData;

        managerDataSection
            .assert.containsText('@ip', Config.managerIp)
            .waitForElementPresent('@statusIconGreen',2000)
            .assert.cssClassPresent('@statusIcon','green');

        managerDataSection
            .moveToElement('@ip', 10, 10);

        page.waitForElementVisible('@statusesTitle', 2000)
            .assert.containsText('@statusesTitle','Server Services Status')
            .assert.containsText('@statusesName','InfluxDB')
            .assert.containsText('@statusesDesc','InfluxDB Service');

        client.end();
    }
};
