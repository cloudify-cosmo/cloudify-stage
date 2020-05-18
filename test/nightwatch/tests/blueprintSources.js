/**
 * Created by pposel on 05/07/2017.
 */

module.exports = {
    before(client) {
        client
            .login()
            .prepareTestWidget(client.page.blueprintSources().props.widgetId)
            .addBlueprint();
    },

    'No blueprint selected': client => {
        client.page
            .blueprintSources()
            .section.noBlueprintSelected.assert.containsText(
                '@message',
                'Please select blueprint to display source files'
            );
    },

    'Browse blueprint source': client => {
        client
            .selectBlueprint()
            .page.blueprintSources()
            .section.source.waitForElementPresent('@tree')
            .waitForElementPresent('@blueprintHeader')
            .assert.containsText('@blueprintHeader', client.page.blueprints().props.testBlueprint)
            .waitForElementPresent('@blueprintYaml')
            .assert.containsText('@blueprintYaml', client.page.blueprintSources().props.blueprintYaml)
            .waitForElementPresent('@emptyContent')
            .clickElement('@blueprintYaml')
            .waitForElementPresent('@contentSnippet')
            .waitForElementPresent('@fullScreenButton')
            .clickElement('@fullScreenButton');

        client.page
            .blueprintSources()
            .waitForElementPresent('@fullScreen')
            .clickElement('@overlay')
            .api.keys(client.Keys.ESCAPE);
    },

    after(client) {
        client.removeLastPage().end();
    }
};
