import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

/**
 * @see https://cloudifysource.atlassian.net/wiki/spaces/WR/pages/1657405459/Complex+Filters+Design+Document
 */
export interface FilterRule {
    key: string;
    values: string[];
    operator: string;
    type: 'label' | 'attribute';
}

export interface Filter {
    id: string;
    resource: 'deployments' | 'blueprints';
    rules: FilterRule[];
    visibility?: string;
}

const commands = {
    createFilter: (filter: Filter) => {
        const payload = {
            filter_rules: filter.rules,
            visibility: filter.visibility
        };

        return cy.cfyRequest(`/filters/${filter.resource}/${filter.id}`, 'PUT', null, payload);
    },

    deleteFilter: (
        resource: Filter['resource'],
        filterId: string,
        { ignoreFailure }: { ignoreFailure?: boolean } = {}
    ) =>
        cy.cfyRequest(`/filters/${resource}/${filterId}`, 'DELETE', undefined, undefined, {
            failOnStatusCode: !ignoreFailure
        })
};

addCommands(commands);
