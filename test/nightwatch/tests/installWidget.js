/**
 * Created by pposel on 07/06/2017.
 */

module.exports = {
    before(client) {
        client
            .login()
            .resetPages()
            .moveToEditMode()
            .addPage();

        const page = client.page.page();

        page.section.editModeSidebar.clickElement('@addWidgetButton');

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled('testWidget', result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.clickElement('@removeWidgetButton');

                    client.page
                        .page()
                        .section.removeWidgetConfirm.clickElement('@okButton')
                        .waitForElementNotPresent('@okButton');
                }
            });
    },

    'Install widget - error handling': client => {
        const page = client.page.page();

        page.section.addWidgetModal.clickElement('@installWidgetBtn');

        page.section.installWidgetModal
            .clickElement('@okButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.emptyFieldsError);

        page.section.installWidgetModal
            .setElementValue('@urlField', 'test')
            .clickElement('@okButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.invalidURIError);

        const errors = [
            'IncorrectFiles',
            'InvalidPermission',
            'InstallIncorrectDirectoryName',
            'MandatoryFieldMissingName'
        ];

        for (const error of errors) {
            const errorMessage = page.section.installWidgetModal.props[`widget${error}Error`];

            page.section.installWidgetModal
                .resetValue('@urlField')
                .setElementValue('@fileField', client.page.resources().props.testWidget(client.globals, error))
                .assert.containsText('@fieldLabel', page.section.installWidgetModal.props.fileLabelString)
                .clickElement('@okButton')
                .waitForElementVisible('@errorMessage')
                .assert.containsText('@errorMessage', errorMessage);
        }

        page.section.installWidgetModal.clickElement('@cancelButton').waitForElementNotPresent('@okButton');
    },

    'Install and update widget': client => {
        const page = client.page.page();

        page.section.addWidgetModal.clickElement('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setElementValue('@fileField', client.page.resources().props.testWidget(client.globals))
            .assert.containsText('@fieldLabel', page.section.installWidgetModal.props.fileLabelString)
            .clickElement('@okButton')
            .waitForElementNotPresent('@okButton');

        page.section.addWidgetModal.waitForElementPresent('@testWidget').clickElement('@updateWidgetButton');

        // Check update error handling
        const errorMessage = page.section.updateWidgetModal.props.widgetUpdateIncorrectDirectoryNameError;
        page.section.updateWidgetModal
            .resetValue('@urlField')
            .setElementValue(
                '@fileField',
                client.page.resources().props.testWidget(client.globals, 'InvalidPermission')
            )
            .clickElement('@okButton')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', errorMessage);

        page.section.updateWidgetModal
            .resetValue('@urlField')
            .setElementValue('@fileField', client.page.resources().props.testWidget(client.globals, ''))
            .clickElement('@okButton')
            .waitForElementNotPresent('@okButton');
    },

    'Check widget removing': client => {
        const page = client.page.page();

        page.section.addWidgetModal.waitForElementPresent('@testWidget').clickElement('@removeWidgetButton');

        page.section.removeWidgetConfirm
            .waitForElementPresent('@okButton')
            .assert.elementNotPresent('@widgetIsUsedLabel')
            .clickElement('@cancelButton')
            .waitForElementNotPresent('@okButton');
    },

    'Add installed widget': client => {
        const page = client.page.page();

        page.section.page
            .addWidget('testWidget')
            .waitForElementPresent('@testWidgetContent')
            .assert.containsText('@testWidgetContent', page.section.page.props.testWidgetLabel);
    },

    'Widget already installed': client => {
        const page = client.page.page();

        page.section.editModeSidebar.clickElement('@addWidgetButton');

        page.section.addWidgetModal.clickElement('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setElementValue('@fileField', client.page.resources().props.testWidget(client.globals))
            .assert.containsText('@fieldLabel', page.section.installWidgetModal.props.fileLabelString)
            .clickElement('@okButton')
            .waitForElementNotPresent('@loader')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', page.section.installWidgetModal.props.widgetAlreadyInstalledError)
            .clickElement('@cancelButton')
            .waitForElementNotPresent('@okButton');
    },

    'Remove widget': client => {
        const page = client.page.page();

        page.section.addWidgetModal.clickElement('@removeWidgetButton');

        page.section.removeWidgetConfirm
            .waitForElementPresent('@okButton')
            .assert.containsText('@widgetIsUsedLabel', page.section.removeWidgetConfirm.props.widgetIsUsed)
            .clickElement('@okButton')
            .waitForElementNotPresent('@okButton');
        page.section.addWidgetModal
            .waitForElementNotPresent('@removeWidgetButton')
            .clickElement('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);
    },

    after(client) {
        client.resetPages().end();
    }
};
