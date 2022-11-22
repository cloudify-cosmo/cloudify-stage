import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';
import type { ClientConfig } from 'backend/routes/Config.types';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    modifyConfigResponseBody: (responseBodyInterceptor: (responseBody: ClientConfig) => ClientConfig) => {
        cy.intercept('GET', '/console/config', request => {
            // NOTE: Deleting `if-none-match` header to avoid getting "304 Not Modified" response
            //       which doesn't have any data in the body. For details check:
            //       https://glebbahmutov.com/blog/cypress-intercept-problems/#cached-response
            delete request.headers['if-none-match'];
            request.on('response', response => {
                const { body } = response;
                // NOTE: Turning off response caching, so the next call to /console/config
                //       won't use modified response. For details check:
                //       https://docs.cypress.io/api/commands/intercept#cy-intercept-and-request-caching
                response.headers['cache-control'] = 'no-cache';
                response.send(responseBodyInterceptor(body));
            });
        });
    }
};

addCommands(commands);
