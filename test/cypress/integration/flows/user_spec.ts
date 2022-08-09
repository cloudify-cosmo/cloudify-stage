import { minutesToMs } from '../../support/resource_commons';

describe('User flow', () => {
    const resourceName = 'user_flow_test';

    before(() => {
        cy.activate().login();
    });

    function createSecret(secretName: string) {
        cy.contains('Create').click();
        cy.get('.modal').within(() => {
            cy.get('input[name=secretKey]').type(secretName);
            cy.get('textarea').type(secretName);
            cy.get('button.positive').click();
        });
    }

    it('installs deployment from scratch', () => {
        cy.deleteDeployments(resourceName, true).deleteBlueprints(resourceName, true);
        cy.deletePlugins().deleteSecrets('some_key_').deleteSecrets('openstack_config__lab1_tenantA');

        cy.visitSubPage('Resources', 'Plugins');

        cy.contains('Upload').click();
        cy.contains('Upload from Marketplace').click();

        cy.contains('.pluginsCatalogWidget tr', 'Utilities').within(() => {
            cy.get('button').click();
            cy.get('button', { timeout: minutesToMs(2) }).should('to.be.disabled');
        });

        cy.contains('Close').click();

        cy.visitPage('Secrets');
        createSecret('some_key_1');
        createSecret('some_key_4');
        createSecret('some_key_7');
        createSecret('some_key_10');
        createSecret('openstack_config__lab1_tenantA');

        cy.visitPage('Blueprints');
        cy.contains('Upload').click();
        cy.contains('Upload a blueprint package').click();
        cy.get('.modal').within(() => {
            cy.get('input[name=blueprintUrl]')
                .type(
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-74/utilities-examples-cloudify_secrets.zip'
                )
                .blur();
            cy.get('input[name=blueprintName]').clear().type(resourceName);
            cy.get('.button.ok').click();
        });
        cy.get('.modal', { timeout: minutesToMs(1) }).should('not.exist');

        cy.get('input[name=deploymentName]').type(resourceName);
        cy.clickButton('Install');

        cy.get('.modal', { timeout: minutesToMs(1) }).should('not.exist');

        cy.waitForExecutionToEnd('install', { deploymentDisplayName: resourceName });
        cy.contains('.executionsWidget', 'install completed');
        cy.contains('.eventsTable', "'install' workflow execution succeeded");

        cy.contains('Deployment Info').click();
        cy.get('#gridContent > .nodeContainer').should('have.length', 3);
    });

    it('uploads blueprint using first journey buttons', () => {
        cy.killRunningExecutions().deleteDeployments('', true);
        cy.visitPage('Dashboard');
        const uploadBlueprintButtonSelector = 'i[title="Upload blueprint"]:not(.disabled)';

        cy.contains('Create new Deployment').click();

        cy.contains('Blueprint Marketplace');
        cy.containsActiveTab('Getting Started');
        cy.get(uploadBlueprintButtonSelector).first().click();
        cy.contains('Uploading');

        cy.get('.modal').contains('Deploy blueprint', {
            timeout: minutesToMs(1)
        });
    });
});
