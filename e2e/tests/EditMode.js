/**
 * Created by kinneretzin on 02/04/2017.
 */

var Login = require('../utils/login');
var WidgetsUtils = require('../utils/WidgetsHandler');

module.exports = {
    'Move to edit mode': function (client) {

        var page = client.page.page();

        Login(client);
        WidgetsUtils.moveToEditMode(client);

        page.section.sidebar.waitForElementVisible('@addPageButton',2000);
        page.section.page.waitForElementVisible('@addWidgetButton',2000);

        page.section.page
            .waitForElementVisible('@firstWidget',2000)
            .moveToElement('@firstWidget',30,30)
            .waitForElementVisible('@firstWidgetRemoveIcon',2000)
            .waitForElementVisible('@firstWidgetConfigureIcon',2000)
            .waitForElementVisible('@firstWidgetResizeHandle',2000);

        client.end();
    }
};