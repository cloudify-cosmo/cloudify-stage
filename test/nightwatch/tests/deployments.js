/**
 * Created by jakubniezgoda on 09/06/2017.
 */

const DEPLOYMENT_NAME = 'nodecellar0';
const BLUEPRINT_NAME = 'nodecellar';
const BLUEPRINT_URL = 'https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.zip';
const BLUEPRINT_YAML_FILENAME = 'local-blueprint.yaml';
const BLUEPRINT_INPUTS_FILENAME = 'nodecellarInputs2.yaml';
const WORKFLOW_VERIFICATION_TIMEOUT = 20000;

module.exports = {
    before(client) {
        const BLUEPRINT_INPUTS = {};

        client
            .login()
            .prepareTestWidget(client.page.deployments().props.widgetId)
            .addBlueprint(BLUEPRINT_NAME, BLUEPRINT_URL, BLUEPRINT_YAML_FILENAME)
            .deployBlueprint(DEPLOYMENT_NAME, BLUEPRINT_INPUTS, BLUEPRINT_NAME);
    },

    'Deployments widget configuration': function(client) {
        const page = client.page.deployments();

        // 1. List view & drilldown turned on
        page.configureWidget()
            .section.configureWidgetModal.setDrilldown(true)
            .setListView()
            .clickSave();

        // List view verification
        page.assert.elementPresent(page.section.deploymentsList.selector);
        page.assert.elementNotPresent(page.section.deploymentsTable.selector);

        // Drilldown on - verification
        page.section.deploymentsList
            .clickSegment(DEPLOYMENT_NAME)
            .waitForElementNotPresent(page.section.deploymentsList.selector);
        client.page.page().assert.containsText('@pageTitle', DEPLOYMENT_NAME);

        // 2. Table view & drilldown turned off
        client.back().waitForElementPresent(page.section.deploymentsList.selector);
        page.configureWidget()
            .section.configureWidgetModal.setDrilldown(false)
            .setBlueprintIdFilter(BLUEPRINT_NAME)
            .setTableView()
            .clickSave();

        // Table view verification
        client.assert.elementPresent(page.section.deploymentsTable.selector);
        client.assert.elementNotPresent(page.section.deploymentsList.selector);

        // Drilldown off - verification
        page.section.deploymentsTable.clickRow(DEPLOYMENT_NAME);
        client.page.page().assert.containsText('@pageTitle', 'Page_0');
    },

    'Execute workflow': function(client) {
        const WORKFLOW_NAME = 'install';
        const page = client.page.deployments();

        // Set refresh interval to 1 seconds to see changing execution status
        page.configureWidget()
            .section.configureWidgetModal.setPollingTime(1)
            .clickSave();

        page.section.deploymentsTable
            .checkIfDeploymentPresent(DEPLOYMENT_NAME)
            .clickExecuteWorkflow(DEPLOYMENT_NAME, WORKFLOW_NAME);
        page.section.executeWorkflowModal.clickExecute();

        page.section.deploymentsTable
            .checkIfWorkflowStartedOnDeployment(DEPLOYMENT_NAME, WORKFLOW_VERIFICATION_TIMEOUT)
            .checkIfWorkflowFinishedOnDeployment(DEPLOYMENT_NAME, WORKFLOW_VERIFICATION_TIMEOUT);
    },

    'Deployment update': function(client) {
        const page = client.page.deployments();

        page.section.deploymentsTable.checkIfDeploymentPresent(DEPLOYMENT_NAME).clickUpdate(DEPLOYMENT_NAME);
        page.section.updateDeploymentModal
            .waitUntilFormLoaded()
            .selectOptionInDropdown(
                '@blueprint',
                page.section.updateDeploymentModal.elements.blueprint.selector,
                BLUEPRINT_NAME
            )
            .setElementValue(
                '@inputsFile',
                client.page.resources().props.fileByName(BLUEPRINT_INPUTS_FILENAME, client.globals)
            )
            .clickUpdate();
        client.pause(2000);
        page.section.deploymentsTable.checkIfWorkflowFinishedOnDeployment(
            DEPLOYMENT_NAME,
            WORKFLOW_VERIFICATION_TIMEOUT
        );
    },

    'Deployment remove': function(client) {
        const page = client.page.deployments();

        page.section.deploymentsTable.checkIfDeploymentPresent(DEPLOYMENT_NAME).clickForceDelete(DEPLOYMENT_NAME);

        page.section.removeDeploymentModal.clickYes();

        page.section.deploymentsTable.checkIfDeploymentRemoved(DEPLOYMENT_NAME);

        // Fix strange issue in the filter when deployment is removed
        client.page
            .filter()
            .selectOptionInDropdown('@deploymentSearch', client.page.filter().elements.deploymentSearch.selector, '');
    },

    after(client) {
        client
            .moveToEditMode()
            .addPage() // To remove deployment and blueprint with fresh data in filter widgets
            .moveOutOfEditMode()
            .removeDeployment(DEPLOYMENT_NAME)
            .removeBlueprint(BLUEPRINT_NAME)
            .resetPages()
            .end();
    }
};
