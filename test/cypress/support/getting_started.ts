import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
// import { waitUntilEmpty } from './resource_commons';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const switchGettingStarted = (username = 'admin', modalEnabled: boolean) =>
    cy.cfyRequest(`/users/${username}`, 'POST', undefined, { show_getting_started: modalEnabled });

const commands = {
    enableGettingStarted: (username?: string) => switchGettingStarted(username, true),
    disableGettingStarted: (username?: string) => switchGettingStarted(username, false)
};

addCommands(commands);
