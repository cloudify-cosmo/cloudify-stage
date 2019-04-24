/**
 * Created by kinneretzin on 02/04/2017.
 */

const BLUEPRINT_NAME = 'TestBlueprint123';
const BLUEPRINT_FILENAME = 'simple-blueprint.yaml';
const BLUEPRINT_SINGLE_YAML_NAME = 'SingleYamlBlueprint';
const BLUEPRINT_SINGLE_YAML_FILENAME = 'singleYamlBlueprint.yaml';

module.exports = {

    before : function(client) {
        client.log('Setting up...')
            .login()
            .removeBlueprint(BLUEPRINT_NAME)
            .prepareTestWidget(client.page.blueprints().props.widgetId);
    },

    'Blueprint upload - archive file': function (client) {
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
            agent_private_key_path: {
                value: 'agentpath',
                type: null
            },
            agent_user: {
                value: 'agentuser',
                type: null
            },
            host_ip: {
                value: 'IP',
                type: null
            }
        };

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
                .fillIn(DEPLOYMENT_NAME, BLUEPRINT_INPUTS)
                .setSkipValidation(true)
                .clickDeploy();

        // Wait for widget to fetch data and update deployment count
        client.pause(5000);
        page.section.blueprintsTable
                .checkIfDeploymentsCountEqual(BLUEPRINT_NAME, 1);

        page.removeDeployment(DEPLOYMENT_NAME);

        // Wait for widget to fetch data and update deployment count
        client.pause(5000);
        page.section.blueprintsTable
            .checkIfDeploymentsCountEqual(BLUEPRINT_NAME, 0);
    },

    'Blueprint remove - archive file': function (client) {
        let page = client.page.blueprints();

        page.section.blueprintsTable
            .checkIfBlueprintPresent(BLUEPRINT_NAME)
            .clickRemove(BLUEPRINT_NAME);
        page.section.removeBlueprintModal
            .clickYes();

        page.section.blueprintsTable
            .checkIfBlueprintRemoved(BLUEPRINT_NAME);
    },

    'Blueprint upload - single YAML file': function (client) {
        const blueprintSingleYamlFile
            = client.page.resources().props.fileByName(BLUEPRINT_SINGLE_YAML_FILENAME, client.globals);

        let page = client.page.blueprints();

        page.clickElement('@uploadButton');
        page.section.uploadModal
            .fillInForSingleYaml(blueprintSingleYamlFile, BLUEPRINT_SINGLE_YAML_NAME)
            .clickUpload();
        page.section.blueprintsTable
            .checkIfBlueprintPresent(BLUEPRINT_SINGLE_YAML_NAME);
    },

    'Blueprint remove - single YAML file': function (client) {
        let page = client.page.blueprints();

        page.section.blueprintsTable
            .checkIfBlueprintPresent(BLUEPRINT_SINGLE_YAML_NAME)
            .clickRemove(BLUEPRINT_SINGLE_YAML_NAME);
        page.section.removeBlueprintModal
            .clickYes();

        page.section.blueprintsTable
            .checkIfBlueprintRemoved(BLUEPRINT_SINGLE_YAML_NAME);
    },

    after(client) {
        client
            .removeLastPage()
            .end();
    }
};

