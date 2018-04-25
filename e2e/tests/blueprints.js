/**
 * Created by kinneretzin on 02/04/2017.
 */

let path = require('path');
let fs = require('fs');

const BLUEPRINT_NAME = 'TestBlueprint123';
const BLUEPRINT_FILENAME = 'simple-blueprint.yaml';

module.exports = {

    before : function(client) {
        client.log('Setting up...')
            .login()
            .removeBlueprint(BLUEPRINT_NAME)
            .prepareTestWidget(client.page.blueprints().props.widgetId);
    },

    'Blueprint upload': function (client) {
        let blueprintUrl = client.page.blueprints().props.testBlueprintUrl;

        let page = client.page.blueprints();

        page.clickElement('@uploadButton');
        page.section.uploadModal
            .fillIn(blueprintUrl, BLUEPRINT_NAME, BLUEPRINT_FILENAME)
            .clickUpload();
        page.section.blueprintsTable
            .checkIfBlueprintPresent(BLUEPRINT_NAME);
    },

    'Blueprints widget configuration': function (client) {
        let page = client.page.blueprints();

        // 1. Catalog view & drilldown turned on
        page.configureWidget()
            .section.configureWidgetModal
                .setDrilldown(true)
                .setCatalogView()
                .clickSave();

        // Catalog view verification
        page.assert.elementPresent(page.section.blueprintsCatalog.selector);
        page.assert.elementNotPresent(page.section.blueprintsTable.selector);

        // Drilldown on - verification
        page.section.blueprintsCatalog
            .clickSegment(BLUEPRINT_NAME)
            .waitForElementNotPresent(page.section.blueprintsCatalog.selector);
        client.page.page().assert.containsText('@pageTitle', BLUEPRINT_NAME)


        // 2. Table view & drilldown turned off
        client.back()
            .waitForElementPresent(page.section.blueprintsCatalog.selector);
        page.configureWidget()
            .section.configureWidgetModal
                .setDrilldown(false)
                .setTableView()
                .clickSave();

        // Table view verification
        client.assert.elementPresent(page.section.blueprintsTable.selector);
        client.assert.elementNotPresent(page.section.blueprintsCatalog.selector);


        // Drilldown off - verification
        page.section.blueprintsTable
            .clickRow(BLUEPRINT_NAME);
        client.page.page().assert.containsText('@pageTitle', 'Page_0');
    },

    'Blueprint deploy': function (client) {
        const DEPLOYMENT_NAME = 'TestDeployment123';
        const BLUEPRINT_INPUTS = {
            deploymentName: DEPLOYMENT_NAME,
            agent_private_key_path: 'agentpath',
            agent_user: 'agentuser',
            host_ip: 'IP'
        }

        let page = client.page.blueprints();

        // Set refresh interval to 3 seconds to get
        page.configureWidget()
            .section.configureWidgetModal
            .setPollingTime(3)
            .clickSave();

        page.section.blueprintsTable
                .checkIfDeploymentsCountEqual(BLUEPRINT_NAME, 0)
                .clickDeploy(BLUEPRINT_NAME)
            .parent.section.deployBlueprintModal
                .fillIn(BLUEPRINT_INPUTS)
                .setSkipValidation(true)
                .clickDeploy();
        client.pause(5000);

        page.section.blueprintsTable
                .checkIfDeploymentsCountEqual(BLUEPRINT_NAME, 1)

        page.removeDeployment(DEPLOYMENT_NAME);
    },

    'Blueprint remove': function (client) {
        let page = client.page.blueprints();

        page.section.blueprintsTable
            .checkIfBlueprintPresent(BLUEPRINT_NAME)
            .clickRemove(BLUEPRINT_NAME);
        page.section.removeBlueprintModal
            .clickYes();

        page.section.blueprintsTable
            .checkIfBlueprintRemoved(BLUEPRINT_NAME);
    },

    after(client) {
        client.end();
    }
};

