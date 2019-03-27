/**
 * Created by kinneretzin on 02/04/2017.
 */

module.exports = {
    'Tenants list': function (client) {
        client.login()
            .page.page().section.tenants
            .assert.containsText('@tenantName', 'default_tenant')
            .clickElement('@tenantName')
            .waitForElementVisible('@tenantsDropdownMenu')
            .assert.containsText('@tenantsDropdownMenuItem','default_tenant');

        client.end();
    }
};

