/**
 * Created by pposel on 05/07/2017.
 */

module.exports = {
    before(client) {
        client.login()
            .prepareTestWidget(client.page.blueprintSources().props.widgetId)
            .addBlueprint();
    },

    'No blueprint selected': function (client) {
        client.page.blueprintSources().section.noBlueprintSelected
            .assert.containsText('@message', 'Please select blueprint to display source files');
    },

    'Browse blueprint source': function (client) {
        client.selectBlueprint()
            .page.blueprintSources().section.source
            .waitForElementPresent('@tree')
            .assert.containsText('@blueprintHeader', client.page.blueprints().props.testBlueprint)
            .assert.containsText('@blueprintYaml', client.page.blueprintSources().props.blueprintYaml)
            .waitForElementPresent('@emptyContent')
            .clickElement('@blueprintYaml')
            .waitForElementPresent('@contentSnippet')
            .waitForElementPresent('@fullScreenButton')
            .clickElement('@fullScreenButton');

        client.page.blueprintSources()
            .waitForElementPresent('@fullScreen')
            .clickElement('@overlay')
            .api.keys(client.Keys.ESCAPE)
    },

    after(client) {
        client
            .removeLastPage()
            .end();
    }
};