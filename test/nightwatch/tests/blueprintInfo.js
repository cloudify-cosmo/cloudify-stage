/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    before(client) {
        client
            .login()
            .prepareTestWidget(client.page.blueprintInfo().props.widgetId)
            .addBlueprint();
    },

    'No blueprint selected': client => {
        client.page.blueprintInfo().section.noData.assert.containsText('@message', 'No blueprint selected');
    },

    'Show blueprint info': client => {
        client
            .selectBlueprint()
            .page.blueprintInfo()
            .section.info.waitForElementPresent('@blueprintName')
            .assert.containsText('@blueprintName', client.page.blueprints().props.testBlueprint);
    },

    after(client) {
        client.removeLastPage().end();
    }
};
