import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { waitUntilEmpty } from './resource_commons';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    uploadBlueprint: (pathOrUrl: string, id: string, yamlFile = 'blueprint.yaml', visibility = 'tenant') => {
        if (pathOrUrl.startsWith('http')) {
            return cy.cfyRequest(
                `/blueprints/${id}?blueprint_archive_url=${pathOrUrl}&visibility=${visibility}&application_file_name=${yamlFile}`,
                'PUT'
            );
        }
        return cy.cfyFileRequest(
            pathOrUrl,
            true,
            `/blueprints/${id}?visibility=${visibility}&application_file_name=${yamlFile}`
        );
    },
    deleteBlueprint: (blueprintId: string, force = false) => {
        cy.cfyRequest(`/blueprints/${blueprintId}?force=${force}`, 'DELETE');
    },
    deleteBlueprints: (search: string, force = false) => {
        cy.cfyRequest(`/blueprints?_search=${search}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteBlueprint(id, force)))
            .then(() => waitUntilEmpty('blueprints', search));
    }
};

addCommands(commands);
