import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { waitUntilEmpty } from './resource_commons';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

/**
 * Reserved system label keys. The list may be outdated, as it is defined in the Manager
 * (`/labels/deployments?_reserved=true`)
 *
 * @link https://docs.cloudify.co/api/v3.1/#list-filters
 */
type SystemLabelKeys =
    | 'csys-obj-parent'
    | 'csys-obj-type'
    | 'csys-env-type'
    | 'csys-location-long'
    | 'csys-location-name'
    | 'csys-obj-name'
    | 'csys-wrcp-services'
    | 'csys-location-lat';

export type SystemLabel = Partial<Record<SystemLabelKeys, string | string[]>>;
export type Label = SystemLabel & {
    [key: string]: string | string[];
};

const commands = {
    getDeployment: (deploymentId: string) => cy.cfyRequest(`/deployments/${deploymentId}`, 'GET'),
    deployBlueprint: (
        blueprintId: string,
        deploymentId: string,
        inputs = {},
        deploymentProperties: Record<string, any> = {}
    ) =>
        cy.cfyRequest(`/deployments/${deploymentId}`, 'PUT', null, {
            blueprint_id: blueprintId,
            inputs,
            visibility: 'tenant',
            ...deploymentProperties
        }),
    setSite: (deploymentId: string, siteName: string) =>
        cy.cfyRequest(
            `/deployments/${deploymentId}/set-site`,
            'POST',
            null,
            siteName !== '' ? { site_name: siteName } : { detach_site: true }
        ),
    getReservedLabelKeys: () =>
        cy
            .cfyRequest('/labels/deployments?_reserved=true', 'GET', null)
            .then(response => response.body.items as string[]),
    setLabels: (deploymentId: string, labels: Label[]) =>
        cy.cfyRequest(`/deployments/${deploymentId}`, 'PATCH', null, { labels }),
    deleteDeployment: (deploymentId: string, force = false) =>
        cy.cfyRequest(`/deployments/${deploymentId}?force=${force}`, 'DELETE'),
    deleteDeployments: (search: string, force = false) =>
        cy
            .cfyRequest(`/deployments?_search=${search}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteDeployment(id, force)))
            .then(() => waitUntilEmpty('deployments', { search })),
    searchInDeploymentsWidget: (deploymentId: string) =>
        cy.get('.deploymentsWidget').within(() => {
            cy.getSearchInput().clear().type(deploymentId);
            cy.get('.input.loading').should('not.exist');
            cy.get('.widgetLoader').should('be.not.visible');
        }),
    selectAndClickDeploy: () => {
        cy.get('[aria-label="Deploy or Install"]').click().contains('Deploy').click();
        cy.get('.actions').clickButton('Deploy');
    },
    revertToDefaultValue: () => {
        const revertToDefaultAriaLabel = '[aria-label="Revert value to default"]';
        return cy.get(revertToDefaultAriaLabel).click().should('not.exist');
    }
};

addCommands(commands);
