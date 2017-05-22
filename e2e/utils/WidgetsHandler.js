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

    moveOutOfEditMode: function(client) {
        var page = client.page.page();

        return page.section.userMenu
            .click('@userName')
            .waitForElementVisible('@userDropdownMenu', 2000)
            .click('@editModeItem');

    },

    addPage: function(client) {
        var page = client.page.page();

        page.section.sidebar
            .click('@addPageButton');

        return client.pause(2000); // waiting to move to the new page
    },

    addWidget: function(client,widgetId) {
        var page = client.page.page();

        page.section.page
            .click('@addWidgetButton');

        client.pause(1000); // Wait for modal to open

        client
            .click('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .extra .button');

        return client.pause(2000); // waiting to move to the new page
    },

    removeLastPage : function(client) {
        var page = client.page.page();

        page.section.sidebar
            .click('@lastPageRemoveButton');

        return client.pause(2000); // waiting to move to the new page

    },

    prepareTestWidget: function(client,widgetId) {
        this.moveToEditMode(client);
        this.addPage(client);
        this.addWidget(client,widgetId);
        this.moveOutOfEditMode(client);
    }

};