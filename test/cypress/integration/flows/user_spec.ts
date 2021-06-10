// @ts-nocheck File not migrated fully to TS
import { minutesToMs } from '../../support/resource_commons';

describe('User flow', () => {
    const resourceName = 'user_flow_test';

    before(() =>
        cy
            .activate()
            .login()
            .deleteDeployments(resourceName, true)
            .deleteBlueprints(resourceName, true)
            .deletePlugins()
            .deleteSecrets('some_key_')
            .deleteSecrets('openstack_config__lab1_tenantA')
    );

    function createSecret(secretName) {
        cy.contains('Create').click();
        cy.get('.modal').within(() => {
            cy.get('input[name=secretKey]').type(secretName);
            cy.get('textarea').type(secretName);
            cy.get('button.green').click();
        });
    }

    it('installs deployment from scratch', () => {
        cy.visitPage('Marketplace');
        cy.get('.pluginsCatalogWidget').within(() => {
            cy.contains('tr', 'Utilities').find('button').click();
        });
        cy.get('.modal').within(() => {
            cy.get('button.ok').click();
        });
        cy.get('.modal', { timeout: minutesToMs(2) }).should('not.exist');

        cy.visitPage('Resources').openTab('Secrets');
        createSecret('some_key_1');
        createSecret('some_key_4');
        createSecret('some_key_7');
        createSecret('some_key_10');
        createSecret('openstack_config__lab1_tenantA');

        cy.visitPage('Blueprints');
        cy.contains('Upload').click();
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

        cy.getSearchInput().clear().type(resourceName);
        cy.get('.blueprintsTable > tbody > tr').should('have.length', 1);
        cy.get('.rocket').click();
        cy.get('input[name=deploymentName]').type(resourceName);
        cy.get('button.green').click();

        cy.get('.modal').find('button.ok').click();
        cy.get('.modal', { timeout: minutesToMs(1) }).should('not.exist');

        cy.contains('.executionsWidget', 'install completed');
        cy.contains('.eventsTable', "'install' workflow execution succeeded");

        cy.contains('Deployment Info').click();
        cy.get('#gridContent > .nodeContainer').should('have.length', 3);
    });
});
