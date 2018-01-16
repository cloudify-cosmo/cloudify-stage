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
        var backend = client.page.widgetBackend();

        page.section.editModeSidebar
            .clickElement('@addWidgetButton');

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
            .clickElement('@installWidgetBtn');

        page.section.installWidgetModal
            .waitForElementPresent('@okButton')
            .setValue('@fileField', client.page.resources().props.fileByName(backend.props.broken1WidgetFilename, client.globals))
            .clickElement('@okButton');

        page.section.installWidgetModal
            .waitForElementPresent('@errorMessage')
            .assert.containsText('@errorMessage', backend.section.installWidget.props.notAllowedModuleError);
    },

    'Install broken service': function (client) {
        var page = client.page.page();
        var backend = client.page.widgetBackend();

        page.section.installWidgetModal
            .setValue('@fileField', client.page.resources().props.fileByName(backend.props.broken2WidgetFilename, client.globals))
            .clickElement('@okButton')
            .waitForElementNotPresent('@okButton');

        page.section.addWidgetModal
            .clickElement('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);

        client.prepareTestWidget(backend.props.broken2WidgetId);

        backend.section.brokenWidget
            .setValue('@endpoint', 'version')
            .clickElement('@fireBtn')
            .waitForElementPresent('@errorMsg')
            .assert.containsText('@errorMsg', backend.section.installWidget.props.notAllowedModuleError);

        page.section.editModeSidebar
            .clickElement('@addWidgetButton');

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
            .clickElement('@installWidgetBtn');

        page.section.installWidgetModal
            .setValue('@fileField', client.page.resources().props.fileByName(backend.props.widgetFilename, client.globals))
            .clickElement('@okButton')
            .waitForElementNotPresent('@okButton');

        page.section.addWidgetModal
            .clickElement('@closeIcon')
            .waitForElementNotPresent(page.section.addWidgetModal.selector);

        client.prepareTestWidget(backend.props.widgetId);

        backend.section.backendWidget
            .setValue('@endpoint', 'version')
            .clickElement('@fireBtn')
            .waitForElementPresent('@jsonResult')
            .assert.elementPresent('@jsonResult');
    },

    'Check request call': function (client) {
        var page = client.page.page();
        var backend = client.page.widgetBackend();

        backend.section.backendWidget
            .clickElement('@configIcon')

        backend.section.widgetConfig
            .selectOptionInDropdown('@dropdown', `${backend.section.widgetConfig.selector} ${backend.section.widgetConfig.elements.dropdown.selector}`, backend.section.widgetConfig.props.requestItem)
            .clickElement('@saveBtn')

        backend.section.backendWidget
            .waitForElementPresent('@urlIcon')
            .assert.containsText('@urlIcon', backend.section.backendWidget.props.urlLabel)
            .setValue('@urlInput', backend.section.backendWidget.props.blankUrl)
            .clickElement('@fireBtn')
            .waitForElementPresent('@xmlResult')
            .assert.elementPresent('@xmlResult');

        page.section.editModeSidebar
            .clickElement('@addWidgetButton');

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
