/**
 * Created by kinneretzin on 02/04/2017.
 */

var Config = require('../config');

module.exports = {
    'Admin user menu': function (client) {
        client.login()
            .page.page().section.userMenu
            .assert.containsText('@userName', Config.admin)
            .clickElement('@userName')
            .waitForElementVisible('@userDropdownMenu')
            .assert.containsText('#maintenanceMenuItem span','Maintenance Mode')
            .assert.containsText('#resetMenuItem span','Reset')
            .assert.containsText('#editModeMenuItem span','Edit Mode')
            .assert.containsText('#logoutMenuItem span','Logout');

        client.end();
    },

    'Regular user menu': function (client) {
        client.ensureUserIsPresent(Config.user, Config.pass)
            .login(true)
            .page.page().section.userMenu
            .assert.containsText('@userName', Config.user)
            .clickElement('@userName')
            .waitForElementVisible('@userDropdownMenu')
            .assert.containsText('#resetMenuItem span','Reset')
            .assert.containsText('#logoutMenuItem span','Logout');

        client.end();
    }

};

