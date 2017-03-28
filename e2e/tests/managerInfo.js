/**
 * Created by kinneretzin on 25/12/2016.
 */

var Login = require('../utils/login');

module.exports = {
    'Manger IP and status': function (client) {

        var page = client.page.page();

        Login(client);
        
        var managerDataSection = page.section.managerData;

        managerDataSection
            .assert.containsText('@ip', '10.239.3.79')
            .assert.cssClassPresent('@statusIcon','green');

        client.end();
    }
};
