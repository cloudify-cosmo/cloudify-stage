/**
 * Created by kinneretzin on 02/04/2017.
 */

var Login = require('../utils/login');
var Config =require('../config.json');

module.exports = {
    'Tenants list': function (client) {

        var page = client.page.page();

        Login(client);

        page.section.tenants
            .assert.containsText('@tenantName', 'default_tenant')
            .click('@tenantName')
            .waitForElementVisible('@tenantsDropdownMenu', 2000)
            .assert.containsText('@tenantsDropdownMenuItem','default_tenant');

        client.end();
    }
};

