/**
 * Created by kinneretzin on 02/04/2017.
 */

module.exports = {
    'Admin user menu': function (client) {
        client.login()
            .page.page().section.userMenu
            .assert.containsText('@userName', 'admin')
            .clickElement('@userName')
            .waitForElementVisible('@userDropdownMenu')
            .assert.containsText('#maintenanceMenuItem span','Maintenance Mode')
            .assert.containsText('#configureMenuItem span','Configure')
            .assert.containsText('#resetMenuItem span','Reset')
            .assert.containsText('#editModeMenuItem span','Edit Mode')
            .assert.containsText('#logoutMenuItem span','Logout');

        client.end();
    },

    'Regular user menu': function (client) {
        client.login(true)
            .page.page().section.userMenu
            .assert.containsText('@userName', 'user1')
            .clickElement('@userName')
            .waitForElementVisible('@userDropdownMenu')
            .assert.containsText('#resetMenuItem span','Reset')
            .assert.containsText('#editModeMenuItem span','Edit Mode')
            .assert.containsText('#logoutMenuItem span','Logout');

        client.end();
    }

};

