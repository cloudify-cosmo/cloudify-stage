/**
 * Created by pposel on 28/11/2017.
 */

module.exports = {
    before(client) {
        client
            .login()
            .resetPages()
            .moveToEditMode()
            .addPage();

        const page = client.page.page();
        const backend = client.page.widgetBackend();

        page.section.editModeSidebar.clickElement('@addWidgetButton');

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled(backend.props.widgetId, result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.uninstallWidget(backend.props.widgetId);
                }
            })
            .isWidgetInstalled(backend.props.broken2WidgetId, result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.uninstallWidget(backend.props.broken2WidgetId);
                }
            });
    },

    'Install broken widget': function(client) {
        const page = client.page.page();
        const backend = client.page.widgetBackend();

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .clickElement('@installWidgetBtn')
            .waitForElementVisible(page.section.installWidgetModal.selector);

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setElementValue(
                '@fileField',
                client.page.resources().props.fileByName(backend.props.broken1WidgetFilename, client.globals)
            )
            .assert.containsText('@fieldLabel', page.section.installWidgetModal.props.fileLabelString)
            .clickElement('@okButton')
            .waitForElementNotPresent('@loader')
            .waitForElementVisible('@errorMessage')
            .assert.containsText('@errorMessage', backend.section.installWidget.props.notAllowedModuleError);
    },

    'Install broken service': function(client) {
        const page = client.page.page();
        const backend = client.page.widgetBackend();

        page.section.installWidgetModal
            .setElementValue(
                '@fileField',
                client.page.resources().props.fileByName(backend.props.broken2WidgetFilename, client.globals)
            )
            .assert.containsText('@fieldLabel', page.section.installWidgetModal.props.fileLabelString)
            .clickElement('@okButton')
            .waitForElementNotPresent('@loader')
            .waitForElementNotPresent('@okButton');

        page.section.addWidgetModal
            .clickElement('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);

        client.prepareTestWidget(backend.props.broken2WidgetId);

        backend.section.brokenWidget
            .setElementValue('@endpoint', 'version')
            .clickElement('@fireBtn')
            .waitForElementPresent('@errorMsg')
            .assert.containsText('@errorMsg', backend.section.installWidget.props.notAllowedModuleError);

        page.section.editModeSidebar.moveToEditMode().clickElement('@addWidgetButton');

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled(backend.props.broken2WidgetId, result => {
                if (result.value) {
                    page.section.addWidgetModal.uninstallWidget(backend.props.broken2WidgetId);
                }
            });
    },

    'Install working service and check manager call': function(client) {
        const page = client.page.page();
        const backend = client.page.widgetBackend();

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .clickElement('@installWidgetBtn')
            .waitForElementVisible(page.section.installWidgetModal.selector);

        page.section.installWidgetModal
            .setElementValue(
                '@fileField',
                client.page.resources().props.fileByName(backend.props.widgetFilename, client.globals)
            )
            .assert.containsText('@fieldLabel', page.section.installWidgetModal.props.fileLabelString)
            .clickElement('@okButton')
            .waitForElementNotPresent('@loader')
            .waitForElementVisible(page.section.addWidgetModal.selector);

        page.section.addWidgetModal
            .clickElement('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);

        client.prepareTestWidget(backend.props.widgetId);

        backend.section.backendWidget
            .setElementValue('@endpoint', 'version')
            .clickElement('@fireBtn')
            .waitForElementPresent('@jsonResult')
            .assert.elementPresent('@jsonResult');
    },

    'Check request call': function(client) {
        const page = client.page.page();
        const backend = client.page.widgetBackend();

        backend.section.backendWidget.configureWidget();

        backend.section.widgetConfig
            .selectOptionInDropdown(
                '@dropdown',
                `${backend.section.widgetConfig.selector} ${backend.section.widgetConfig.elements.dropdown.selector}`,
                backend.section.widgetConfig.props.requestItem
            )
            .clickElement('@saveBtn');

        backend.section.backendWidget
            .waitForElementPresent('@urlIcon')
            .assert.containsText('@urlIcon', backend.section.backendWidget.props.urlLabel)
            .setElementValue('@urlInput', backend.section.backendWidget.props.blankUrl)
            .clickElement('@fireBtn')
            .waitForElementPresent('@xmlResult')
            .assert.elementPresent('@xmlResult');

        page.section.editModeSidebar.clickElement('@addWidgetButton');

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled(backend.props.widgetId, result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.uninstallWidget(backend.props.widgetId);
                }
            })
            .clickElement('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);
    },

    after(client) {
        client.resetPages().end();
    }
};
