/**
 * Created by pposel on 26/05/2017.
 */

var Login = require('../utils/login');
var WidgetsHandler = require('../utils/WidgetsHandler');
var BlueprintHandler = require('../utils/BlueprintHandler');

module.exports = {
    before(client) {
        Login(client);
        WidgetsHandler.prepareTestWidget(client, 'blueprintInfo');
        BlueprintHandler.addBlueprint(client);
    },

    'No blueprint selected': function (client) {
        var widget = client.page.blueprintInfo().section.noData;
        widget.assert.containsText('@message', "No blueprint selected");
    },

    'Show blueprint info': function (client) {
        BlueprintHandler.selectBlueprint(client);

        var widget = client.page.blueprintInfo().section.info;
        widget.waitForElementPresent('@blueprintName')
            .assert.containsText('@blueprintName', client.page.blueprints().props.testBlueprint);
    },

    after(client) {
        client.end();
    }
};

