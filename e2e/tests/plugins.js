/**
 * Created by edenp on 22/01/2018.
 */

module.exports = {
    before(client) {
        client.login()
            .prepareTestWidget(client.page.plugins().props.widgetId);
    },

    'upload from url': function (client) {
        var page = client.page.plugins();
        page.openUploadModal()
            .fillWagonUrl(page.props.testWagonUrl)
            .fillYamlUrl(page.props.testYamlUrl)
            .uploadPlugin()
            .searchFor(page.props.pluginPackageName)
            .section.pluginsTable.assert.containsText('@packageName', page.props.pluginPackageName)
            .parent.deletePlugin();
    },

    after(client) {
        client
            .removeLastPage()
            .end();
    }
};
