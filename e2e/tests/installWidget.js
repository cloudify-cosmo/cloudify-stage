/**
 * Created by pposel on 07/06/2017.
 */

/*
TODO: Find a solution to make widget.zip accessible for the server, then uncomment test.

module.exports = {
    before(client) {
        client.login()
            .moveToEditMode()
            .removeLastPage()
            .addPage();

        var page = client.page.page();

        page.section.page
            .click('@addWidgetButton');

        client.pause(1000);

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled('testWidget', result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal
                          .click("@removeWidgetButton");

                    client.page.page().section.removeWidgetConfirm
                          .waitForElementPresent('@okButton')
                          .click("@okButton")
                          .waitForElementNotPresent('@okButton');
                }
            });
    },

    'Validate install fields': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .click('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .click('@okButton')
            .waitForElementPresent('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.emptyFieldsError)
            .setValue('@urlField', "test")
            .click('@okButton');

        client.pause(2000);

        page.section.installWidgetModal
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.invalidURIError)
            .setValue('@fileField', client.page.resources().props.blankFile)
            .click('@okButton');

        client.pause(2000);

        page.section.installWidgetModal
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.bothFieldsError)
            .resetValue('@urlField')
            .click('@okButton');

        client.pause(2000);

        page.section.installWidgetModal
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.incorrectFilesError)
            .click('@cancelButton')
            .waitForElementNotPresent('@okButton');
    },

    'Install widget': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .click('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setValue('@fileField', client.page.resources().props.testWidget)
            .click('@okButton')
            .waitForElementNotPresent('@okButton', 10000);
    },

    'Check widget removing': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .waitForElementPresent('@removeWidgetButton')
            .click("@removeWidgetButton");

        page.section.removeWidgetConfirm
            .waitForElementPresent('@okButton')
            .assert.elementNotPresent('@widgetIsUsedLabel')
            .click("@cancelButton")
            .waitForElementNotPresent('@okButton');
    },

    'Add installed widget': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .waitForElementPresent('@updateWidgetButton');

        page.section.page
            .addWidget("testWidget")
            .waitForElementPresent('@testWidgetContent')
            .assert.containsText('@testWidgetContent', page.section.page.props.testWidgetLabel);
    },

    'Widget already installed': function (client) {
        var page = client.page.page();

        page.section.page
            .click('@addWidgetButton');

        client.pause(1000);

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .click('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setValue('@fileField', client.page.resources().props.testWidget)
            .click('@okButton')
            .waitForElementNotPresent('@loader')
            .waitForElementPresent('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.widgetAlreadyInstalledError)
            .click('@cancelButton')
            .waitForElementNotPresent('@okButton');
    },

    'Remove widget': function (client) {
        var page = client.page.page();

        page.section.addWidgetModal
            .waitForElementPresent('@removeWidgetButton')
            .click("@removeWidgetButton");

        page.section.removeWidgetConfirm
            .waitForElementPresent('@okButton')
            .assert.containsText('@widgetIsUsedLabel', page.section.removeWidgetConfirm.props.widgetIsUsed)
            .click("@okButton")
            .waitForElementNotPresent('@okButton');

        page.section.addWidgetModal
            .waitForElementNotPresent('@removeWidgetButton');
    },

    after(client) {
        client.end();
    }
};
*/