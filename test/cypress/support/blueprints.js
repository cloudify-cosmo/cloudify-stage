import { waitUntilEmpty } from './resource_commons';

Cypress.Commands.add('uploadBlueprint', (pathOrUrl, id, yamlFile = 'blueprint.yaml', visibility = 'tenant') => {
    if (pathOrUrl.startsWith('http')) {
        cy.cfyRequest(
            `/blueprints/${id}?blueprint_archive_url=${pathOrUrl}&visibility=${visibility}&application_file_name=${yamlFile}`,
            'PUT'
        );
    } else
        cy.cfyFileRequest(
            pathOrUrl,
            true,
            `/blueprints/${id}?visibility=${visibility}&application_file_name=${yamlFile}`
        );

    waitUntilEmpty('blueprints?state=pending&state=uploading&state=extracting&state=parsing');
});

Cypress.Commands.add('deleteBlueprint', (blueprintId, force = false) => {
    cy.cfyRequest(`/blueprints/${blueprintId}?force=${force}`, 'DELETE');
});

Cypress.Commands.add('deleteBlueprints', (search, force = false) => {
    cy.cfyRequest(`/blueprints?_search=${search}`, 'GET')
        .then(response => response.body.items.forEach(({ id }) => cy.deleteBlueprint(id, force)))
        .then(() => waitUntilEmpty('blueprints', search));
});
