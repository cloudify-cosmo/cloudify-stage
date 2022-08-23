import type { GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { addCommands } from 'cloudify-ui-common/cypress/support';
import type { Visibility } from '../../../widgets/common/src/types';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

interface UploadBlueprintOptions {
    yamlFile?: string;
    visibility?: Visibility;
    timeout?: number;
}

const commands = {
    uploadBlueprint: (
        pathOrUrl: string,
        id: string,
        { yamlFile = 'blueprint.yaml', visibility = 'tenant', timeout }: UploadBlueprintOptions = {}
    ): Cypress.Chainable<unknown> => {
        if (pathOrUrl.startsWith('http')) {
            return cy.cfyRequest(
                `/blueprints/${id}?blueprint_archive_url=${pathOrUrl}&visibility=${visibility}&application_file_name=${yamlFile}`,
                'PUT'
            );
        }
        return cy.cfyFileRequest(
            pathOrUrl,
            true,
            `/blueprints/${id}?visibility=${visibility}&application_file_name=${yamlFile}`,
            timeout
        );
    },
    getBlueprint: (blueprintId: string) => cy.cfyRequest(`/blueprints?id=${blueprintId}`, 'GET'),
    deleteBlueprint: (blueprintId: string, force = false) =>
        cy
            .cfyRequest(`/deployments?blueprint_id=${blueprintId}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteDeployment(id, force)))
            .then(() => cy.waitUntilEmpty(`deployments?blueprint_id=${blueprintId}`))
            .then(() =>
                cy.cfyRequest(`/blueprints/${blueprintId}?force=${force}`, 'DELETE', null, null, {
                    failOnStatusCode: false
                })
            ),
    deleteBlueprints: (search: string, force = false) =>
        cy
            .cfyRequest(`/blueprints?_search=${search}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteBlueprint(id, force)))
            .then(() => cy.waitUntilEmpty('blueprints', { search }))
};

addCommands(commands);
