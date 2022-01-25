import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    deleteSecrets: (search: string) =>
        cy
            .getSecrets(search)
            .then(response =>
                response.body.items.forEach(({ key }: { key: string }) => cy.cfyRequest(`/secrets/${key}`, 'DELETE'))
            ),

    createSecret: (key: string, value: string) =>
        cy.cfyRequest(`/secrets/${key}`, 'PUT', null, { value }, { failOnStatusCode: false }),

    getSecrets: (search: string) => cy.cfyRequest(`/secrets?_search=${search}`, 'GET')
};

addCommands(commands);
