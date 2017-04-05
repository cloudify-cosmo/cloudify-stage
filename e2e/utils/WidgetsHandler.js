/**
 * Created by kinneretzin on 27/03/2017.
 */

var Config = require('../config.json');

module.exports =  {
    moveToEditMode : function(client) {
        var page = client.page.page();

        return page.section.userMenu
            .click('@userName')
            .waitForElementVisible('@userDropdownMenu', 2000)
            .click('@editModeItem');
    },

    addPage: function(client) {
        var page = client.page.page();

        return page.section.sidebar
            .click('@addPageButton')
            .pause(2000); // waiting to move to the new page
    }

};