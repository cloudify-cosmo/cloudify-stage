import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';
import type { FilterRule } from 'app/widgets/common/filters/types';

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
        }),

    deleteDeploymentsFilters: (search: string) =>
        cy
            .cfyRequest(`/filters/deployments?_search=${search}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteDeploymentsFilter(id)))
            .then(() => cy.waitUntilEmpty('filters/deployments', { search }))
};

addCommands(commands);
