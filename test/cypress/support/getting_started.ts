import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const setGettingStarted = (username = 'admin', enableGettingStarted: boolean) => {
    return cy.cfyRequest(`/users/${username}`, 'POST', undefined, { show_getting_started: enableGettingStarted });
};

const commands = {
    enableGettingStarted: (username?: string) => setGettingStarted(username, true),
    disableGettingStarted: (username?: string) => setGettingStarted(username, false)
};

addCommands(commands);
