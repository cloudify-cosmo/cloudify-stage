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
});
