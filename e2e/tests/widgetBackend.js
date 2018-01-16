/**
 * Created by pposel on 28/11/2017.
 */

module.exports = {
    before : function(client) {
        client.login()
            .resetPages()
            .moveToEditMode()
            .addPage();

        var page = client.page.page();

        page.section.editModeSidebar
            .click('@addWidgetButton');

        client.pause(1000);

        var backend = client.page.widgetBackend();

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled(backend.props.widgetId, result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.uninstallWidget(backend.props.widgetId);
                }
            }).isWidgetInstalled(backend.props.broken2WidgetId, result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.uninstallWidget(backend.props.broken2WidgetId);
                }
            });
    },

    'Install broken widget': function (client) {
        var page = client.page.page();
        var backend = client.page.widgetBackend();

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .click('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setValue('@fileField', client.page.resources().props.fileByName(backend.props.broken1WidgetFilename, client.globals))
            .click('@okButton');

        client.pause(2000);

        page.section.installWidgetModal
            .assert.containsText('@errorMessage', backend.section.installWidget.props.notAllowedModuleError);
    },

    'Install broken service': function (client) {
        var page = client.page.page();
        var backend = client.page.widgetBackend();

        page.section.installWidgetModal
            .setValue('@fileField', client.page.resources().props.fileByName(backend.props.broken2WidgetFilename, client.globals))
            .click('@okButton')
            .waitForElementNotPresent('@okButton');

        page.section.addWidgetModal
            .click('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);

        client.prepareTestWidget(backend.props.broken2WidgetId);

        backend.section.brokenWidget
            .setValue('@endpoint', 'version')
            .click('@fireBtn')
            .waitForElementPresent('@errorMsg')
            .assert.containsText('@errorMsg', backend.section.installWidget.props.notAllowedModuleError);

        page.section.editModeSidebar
            .click('@addWidgetButton');

        client.pause(1000);

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled(backend.props.broken2WidgetId, result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.uninstallWidget(backend.props.broken2WidgetId);
            }
            });
    },

    'Install working service and check manager call': function (client) {
        var page = client.page.page();
        var backend = client.page.widgetBackend();

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .click('@installWidgetBtn');

        page.section.installWidgetModal
            .setValue('@fileField', client.page.resources().props.fileByName(backend.props.widgetFilename, client.globals))
            .click('@okButton')
            .waitForElementNotPresent('@okButton');

        page.section.addWidgetModal
            .click('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);

        client.prepareTestWidget(backend.props.widgetId);

        backend.section.backendWidget
            .setValue('@endpoint', 'version')
            .click('@fireBtn')
            .waitForElementPresent('@jsonResult')
            .assert.elementPresent('@jsonResult');
    },

    'Check request call': function (client) {
        var page = client.page.page();
        var backend = client.page.widgetBackend();

        backend.section.backendWidget
            .click('@configIcon')

        backend.section.widgetConfig
            .selectOptionInDropdown('@dropdown', `${backend.section.widgetConfig.selector} ${backend.section.widgetConfig.elements.dropdown.selector}`, backend.section.widgetConfig.props.requestItem)
            .click('@saveBtn')

        backend.section.backendWidget
            .waitForElementPresent('@urlIcon')
            .assert.containsText('@urlIcon', backend.section.backendWidget.props.urlLabel)
            .setValue('@urlInput', backend.section.backendWidget.props.blankUrl)
            .click('@fireBtn')
            .waitForElementPresent('@xmlResult')
            .assert.elementPresent('@xmlResult');

        page.section.editModeSidebar
            .click('@addWidgetButton');

        client.pause(1000);

        page.section.addWidgetModal
            .waitForElementPresent('@installWidgetBtn')
            .isWidgetInstalled(backend.props.widgetId, result => {
                if (result.value) {
                    client.page.page().section.addWidgetModal.uninstallWidget(backend.props.widgetId);
                }
            });
    },

    after(client) {
        client.end();
    }
};
