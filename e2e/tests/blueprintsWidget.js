/**
 * Created by kinneretzin on 02/04/2017.
 */

let path = require('path');
let fs = require('fs');

const BLUEPRINT_NAME = 'TestBlueprint';
const BLUEPRINT_ARCHIVE_FILENAME = 'blueprint.zip';
const BLUEPRINT_FILENAME = 'openstack-blueprint.yaml';
let blueprintArchiveFilePath = path.resolve(__dirname + '/../resources/' + BLUEPRINT_ARCHIVE_FILENAME);

module.exports = {

    before : function(client) {
        const BLUEPRINT_WIDGET_ID = 'blueprints';

        client.log('Setting up...')
            .login()
            .prepareTestWidget(BLUEPRINT_WIDGET_ID);
    },

    'Blueprint upload': function (client) {
        let page = client.page.blueprints();

        page.log('Verification of blueprint archive file...')
            .assert.equal(fs.existsSync(blueprintArchiveFilePath), true, 'Blueprint archive file exists - ' + blueprintArchiveFilePath);

        page.clickElement('@uploadButton');
        page.section.uploadModal
            .fillIn(blueprintArchiveFilePath, BLUEPRINT_NAME, BLUEPRINT_FILENAME)
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
        const DEPLOYMENT_NAME = 'TestDeployment';
        const BLUEPRINT_INPUTS = {
            deploymentName: DEPLOYMENT_NAME,
            agent_user: 'user',
            flavor: 'smelly',
            floating_network_id: 'ID',
            image: 'blackandwhite',
            key_pair_name: 'key',
            network_name: 'spider',
            private_key_path : '/path/to/key'
        }

        let page = client.page.blueprints();
        page.section.blueprintsTable.checkIfDeploymentsCountEqual(BLUEPRINT_NAME, 0);

        page.section.blueprintsTable
                .clickDeploy(BLUEPRINT_NAME)
            .parent.section.deployBlueprintModal
                .fillIn(BLUEPRINT_INPUTS)
                .clickDeploy();
        client.pause(2000); // FIXME: waiting for blueprints table to be updated, looking for better way than pause

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

