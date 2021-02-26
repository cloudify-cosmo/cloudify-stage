import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { waitUntilEmpty } from './resource_commons';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

type Label = {
    [key: string]: string | string[];
};
type Labels = Array<Label>;

const commands = {
    getDeployment: (deploymentId: string) => cy.cfyRequest(`/deployments/${deploymentId}`, 'GET'),
    deployBlueprint: (blueprintId: string, deploymentId: string, inputs = {}) => {
        cy.cfyRequest(`/deployments/${deploymentId}`, 'PUT', null, {
            blueprint_id: blueprintId,
            inputs,
            visibility: 'tenant'
        });
    },
    setSite: (deploymentId: string, siteName: string) => {
        cy.cfyRequest(
            `/deployments/${deploymentId}/set-site`,
            'POST',
            null,
            siteName !== '' ? { site_name: siteName } : { detach_site: true }
        );
    },
    setLabels: (deploymentId: string, labels: Labels) => {
        cy.cfyRequest(`/deployments/${deploymentId}`, 'PATCH', null, { labels });
    },
    deleteDeployment: (deploymentId: string, force = false) => {
        cy.cfyRequest(`/deployments/${deploymentId}?force=${force}`, 'DELETE');
    },
    deleteDeployments: (search: string, force = false) => {
        cy.cfyRequest(`/deployments?_search=${search}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteDeployment(id, force)))
            .then(() => waitUntilEmpty('deployments', search));
    }
};

addCommands(commands);
