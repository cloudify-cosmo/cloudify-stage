/**
 * Created by kinneretzin on 02/04/2017.
 */

const BLUEPRINT_NAME = 'TestBlueprint123';
const BLUEPRINT_FILENAME = 'blueprint.yaml';
const BLUEPRINT_SINGLE_YAML_NAME = 'SingleYamlBlueprint';
const BLUEPRINT_SINGLE_YAML_FILENAME = 'singleYamlBlueprint.yaml';
const DEPLOYMENT_NAME = 'TestDeployment123';

module.exports = {
    before(client) {
        client
            .log('Setting up...')
            .login()
            .removeDeployment(DEPLOYMENT_NAME)
            .removeBlueprint(BLUEPRINT_NAME)
            .prepareTestWidget(client.page.blueprints().props.widgetId);
    },

    'Blueprint upload - archive file': client => {
        const blueprintUrl = client.page.blueprints().props.testBlueprintUrl;

        const page = client.page.blueprints();

        page.clickElement('@uploadButton');
        page.section.uploadModal.fillIn(blueprintUrl, BLUEPRINT_NAME, BLUEPRINT_FILENAME).clickUpload();
        page.section.blueprintsTable.checkIfBlueprintPresent(BLUEPRINT_NAME);
    },

    'Blueprints widget configuration': client => {
        const page = client.page.blueprints();

        // 1. Catalog view & drilldown turned on
        page.configureWidget()
            .section.configureWidgetModal.setDrilldown(true)
            .setCatalogView()
            .clickSave();

        // Catalog view verification
        page.assert.elementPresent(page.section.blueprintsCatalog.selector);
        page.assert.elementNotPresent(page.section.blueprintsTable.selector);

        // Drilldown on - verification
        page.section.blueprintsCatalog
            .clickSegment(BLUEPRINT_NAME)
            .waitForElementNotPresent(page.section.blueprintsCatalog.selector);
        client.page.page().assert.containsText('@pageTitle', BLUEPRINT_NAME);

        // 2. Table view & drilldown turned off
        client.back().waitForElementPresent(page.section.blueprintsCatalog.selector);
        page.configureWidget()
            .section.configureWidgetModal.setDrilldown(false)
            .setTableView()
            .clickSave();

        // Table view verification
        client.assert.elementPresent(page.section.blueprintsTable.selector);
        client.assert.elementNotPresent(page.section.blueprintsCatalog.selector);

        // Drilldown off - verification
        page.section.blueprintsTable.clickRow(BLUEPRINT_NAME);
        client.page.page().assert.containsText('@pageTitle', 'Page_0');
    },

    'Blueprint deploy': client => {
        const BLUEPRINT_INPUTS = {
            webserver_port: {
                value: '9999',
                type: null
            }
        };

        const page = client.page.blueprints();

        // Set refresh interval to 3 seconds to get
        page.configureWidget()
            .section.configureWidgetModal.setPollingTime(3)
            .clickSave();

        page.section.blueprintsTable
            .checkIfDeploymentsCountEqual(BLUEPRINT_NAME, 0)
            .clickDeploy(BLUEPRINT_NAME)
            .parent.section.deployBlueprintModal.fillIn(DEPLOYMENT_NAME, BLUEPRINT_INPUTS)
            .setSkipValidation(true)
            .clickDeploy();

        // Wait for widget to fetch data and update deployment count
        client.pause(5000);
        page.section.blueprintsTable.checkIfDeploymentsCountEqual(BLUEPRINT_NAME, 1);
    },

    'Blueprint upload - single YAML file': client => {
        const blueprintSingleYamlFile = client.page
            .resources()
            .props.fileByName(BLUEPRINT_SINGLE_YAML_FILENAME, client.globals);

        const page = client.page.blueprints();

        page.clickElement('@uploadButton');
        page.section.uploadModal.fillInForSingleYaml(blueprintSingleYamlFile, BLUEPRINT_SINGLE_YAML_NAME).clickUpload();
        page.section.blueprintsTable.checkIfBlueprintPresent(BLUEPRINT_SINGLE_YAML_NAME);
    },

    'Blueprint remove - single YAML file': client => {
        const page = client.page.blueprints();

        page.section.blueprintsTable
            .checkIfBlueprintPresent(BLUEPRINT_SINGLE_YAML_NAME)
            .clickRemove(BLUEPRINT_SINGLE_YAML_NAME);
        page.section.removeBlueprintModal.clickYes();

        page.section.blueprintsTable.checkIfBlueprintRemoved(BLUEPRINT_SINGLE_YAML_NAME);
    },

    after(client) {
        client.removeLastPage().end();
    }
};
