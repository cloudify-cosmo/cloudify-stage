import { waitUntilEmpty } from './resource_commons';

Cypress.Commands.add('uploadBlueprint', (pathOrUrl, id, yamlFile = 'blueprint.yaml') => {
    if (pathOrUrl.startsWith('http')) {
        return cy.cfyRequest(
            `/blueprints/${id}?blueprint_archive_url=${pathOrUrl}&visibility=tenant&application_file_name=${yamlFile}`,
            'PUT'
        );
    }

    return cy.cfyFileRequest(pathOrUrl, true, `/blueprints/${id}?visibility=tenant&application_file_name=${yamlFile}`);
});

Cypress.Commands.add('deleteBlueprint', (blueprintId, force = false) => {
    cy.cfyRequest(`/blueprints/${blueprintId}?force=${force}`, 'DELETE');
});

Cypress.Commands.add('deleteBlueprints', (search, force = false) => {
    cy.cfyRequest(`/blueprints?_search=${search}`, 'GET')
        .then(response => response.body.items.forEach(({ id }) => cy.deleteBlueprint(id, force)))
        .then(() => waitUntilEmpty('blueprints', search));
});
