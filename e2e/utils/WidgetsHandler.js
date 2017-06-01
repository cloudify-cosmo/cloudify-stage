/**
 * Created by kinneretzin on 27/03/2017.
 */

var Config = require('../config.json');

module.exports =  {
    moveToEditMode : function(client) {
        var section = client.page.page().section.userMenu;

        section.click('@userName')
            .waitForElementVisible('@userDropdownMenu', 2000)
            .getText('@editModeMenuItem', result => {
                if (result.value === section.props.editModeLabel) {
                    section.click('@editModeMenuItem');
                }
            });
    },

    moveOutOfEditMode: function(client) {
        var section = client.page.page().section.userMenu;

        return section.click('@userName')
            .waitForElementVisible('@userDropdownMenu', 2000)
            .getText('@editModeMenuItem', result => {
                if (result.value === section.props.exitModeLabel) {
                    section.click('@editModeMenuItem');
                }
            });
    },

    addPage: function(client) {
        var section = client.page.page().section.sidebar;

        section.click('@addPageButton');

        // waiting to move to the new page.
        // There is no specific selector because we are always in a page, and in theory we can be in Page_0 and the
        // new page that will be created is in Page_0 as well (happens in tests all the time because the index resets each session)
        return client.pause(2000);
    },

    addWidget: function(client,widgetId) {
        var page = client.page.page();

        return page.section.page.isWidgetPresent(widgetId, result => {
            if (!result.value) {
                console.log("-- adding " + widgetId + " widget");

                page.section.page.click('@addWidgetButton');

                client.pause(1000); // Wait for modal to open

                page.section.addWidgetModal.addWidget(widgetId);
            }
        });
    },

    removeLastPage : function(client) {
        var section = client.page.page().section.sidebar;

        return section.getText("@lastPage", function(result) {
            if (result.value === section.props.lastPageLabel) {
                section.moveToElement('@lastPageRemoveButton', 10, 10)
                    .waitForElementVisible('@lastPageRemoveButton')
                    .click('@lastPageRemoveButton');
            }
        });
    },

    prepareTestWidget: function(client,widgetId) {
        this.moveToEditMode(client);
        this.removeLastPage(client);
        this.addPage(client);
        this.addWidget(client,widgetId);
        this.moveOutOfEditMode(client);
    }

};