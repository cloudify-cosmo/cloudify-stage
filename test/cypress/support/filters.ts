import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import type { FilterRule } from '../../../widgets/common/src/filters/types';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    createDeploymentsFilter: (id: string, rules: FilterRule[]) =>
        cy.cfyRequest(`/filters/deployments/${id}`, 'PUT', null, { filter_rules: rules }),

    deleteDeploymentsFilter: (filterId: string, { ignoreFailure }: { ignoreFailure?: boolean } = {}) =>
        cy.cfyRequest(`/filters/deployments/${filterId}`, 'DELETE', undefined, undefined, {
            failOnStatusCode: !ignoreFailure
        })
};

addCommands(commands);
