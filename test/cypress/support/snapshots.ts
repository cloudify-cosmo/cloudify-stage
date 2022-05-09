import type { GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { addCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    deleteSnapshot: (snapshotName: string) =>
        cy.cfyRequest(`/snapshots/${snapshotName}`, 'DELETE', null, null, { failOnStatusCode: false })
};

addCommands(commands);
