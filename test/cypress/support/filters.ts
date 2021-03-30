import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

/** @see https://docs.cloudify.co/api/v3.1/#the-filter-resource */
export interface FilterRule {
    key: string;
    values: string[];
    operator: string;
    type: 'label' | 'attribute';
}

export enum FilterResource {
    Deployments = 'deployments',
    Blueprints = 'blueprints'
}

const commands = {
    createFilter: (resource: FilterResource, id: string, rules: FilterRule[]) =>
        cy.cfyRequest(`/filters/${resource}/${id}`, 'PUT', null, { filter_rules: rules }),

    deleteFilter: (resource: FilterResource, filterId: string, { ignoreFailure }: { ignoreFailure?: boolean } = {}) =>
        cy.cfyRequest(`/filters/${resource}/${filterId}`, 'DELETE', undefined, undefined, {
            failOnStatusCode: !ignoreFailure
        })
};

addCommands(commands);
