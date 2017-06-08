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
            .assert.containsText('.usersMenu .menu .item:nth-child(1) span','Maintenance Mode')
            // divider is 2nd
            .assert.containsText('.usersMenu .menu .item:nth-child(3) span','Configure')
            .assert.containsText('.usersMenu .menu .item:nth-child(4) span','Reset')
            .assert.containsText('.usersMenu .menu .item:nth-child(5) span','Edit Mode')
            // divider is 6th
            .assert.containsText('.usersMenu .menu .item:nth-child(7) span','Logout');

        client.end();
    },

    'Regular user menu': function (client) {
        client.login(true)
            .page.page().section.userMenu
            .assert.containsText('@userName', 'user1')
            .clickElement('@userName')
            .waitForElementVisible('@userDropdownMenu')
            .assert.containsText('.usersMenu .menu .item:nth-child(1) span','Reset')
            .assert.containsText('.usersMenu .menu .item:nth-child(2) span','Edit Mode')
            // divider is 3rd
            .assert.containsText('.usersMenu .menu .item:nth-child(4) span','Logout');

        client.end();
    }

};

