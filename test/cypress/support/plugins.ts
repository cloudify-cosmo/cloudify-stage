import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { minutesToMs } from './resource_commons';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const uploadPluginTimeout = minutesToMs(2);

const commands = {
    installPlugin: (wagonUrl: string, yamlUrl: string) =>
        cy.stageRequest(`/console/plugins/upload?visibility=tenant&wagonUrl=${wagonUrl}&yamlUrl=${yamlUrl}`, 'POST', {
            failOnStatusCode: false,
            timeout: uploadPluginTimeout
        }),
    deletePlugins: () =>
        cy
            .cfyRequest('/plugins')
            .then(response =>
                response.body.items.forEach(({ id }: { id: string }) =>
                    cy.cfyRequest(`/plugins/${id}`, 'DELETE', null, { force: true })
                )
            )
};

addCommands(commands);
