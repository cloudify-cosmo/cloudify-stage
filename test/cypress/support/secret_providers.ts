import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';
import type { SecretProvidersWidget } from '../../../widgets/secretProviders/src/widget.types';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    createSecretProvider: (secretProvider: Partial<SecretProvidersWidget.DataItem>) => {
        const { name, type, visibility } = secretProvider;
        return cy.cfyRequest('/secrets-providers', 'PUT', null, { name, type, visibility });
    },

    getSecretProvider: (key: string) => cy.cfyRequest(`/secrets-providers/${key}`, 'GET'),

    deleteSecretProvider: (search: string) => {
        cy.cfyRequest(`/secrets-providers?_search=${search}`, 'GET').then(response =>
            response.body.items.forEach(({ key }: { key: string }) =>
                cy.cfyRequest(`/secrets-providers/${key}`, 'DELETE')
            )
        );
    }
};

addCommands(commands);
