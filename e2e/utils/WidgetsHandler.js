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

        // waiting to move to the new page.
        // There is no specific selector because we are always in a page, and in theory we can be in Page_0 and the
        // new page that will be created is in Page_0 as well (happens in tests all the time because the index resets each session)
        return client.pause(2000);
    },

    addWidget: function(client,widgetId) {
        var page = client.page.page();

        page.section.page
            .click('@addWidgetButton');

        client.pause(1000); // Wait for modal to open

        client
            .click('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .extra .button');

        // Waiting to move to the new widget to be added. Since i cannot be sure if the widget is indeed added by selector
        // (That same widget could be on the page so my wait for element to be visible will imediatly return true) i prefer to
        // either wait or let the widget test itself wait for the desired element (maybe it needs to wait for a data fetching or something like this)
        return client.pause(500);
    },

    removeLastPage : function(client) {
        var page = client.page.page();

        page.section.sidebar
            .click('@lastPageRemoveButton');
    },

    prepareTestWidget: function(client,widgetId) {
        this.moveToEditMode(client);
        this.addPage(client);
        this.addWidget(client,widgetId);
        this.moveOutOfEditMode(client);
    }

};