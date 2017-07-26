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
        // TODO: Test is working only when user 'user1' exists and is associated with at least one tenant.
        //       To be fixed. Necessary to ensure that 'user1' exists and has at least one tenant assigned.
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

