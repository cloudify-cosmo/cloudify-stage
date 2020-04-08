Cypress.Commands.add('uploadBlueprint', (archivePath, id, yamlFile = 'blueprint.yaml') =>
    cy.cfyFileRequest(archivePath, true, `/blueprints/${id}?visibility=tenant&application_file_name=${yamlFile}`)
);

Cypress.Commands.add('deleteBlueprint', blueprintId => {
    cy.cfyRequest(`/blueprints/${blueprintId}`, 'DELETE');
});

Cypress.Commands.add('deleteBlueprints', search => {
    cy.cfyRequest(`/blueprints?_search=${search}`, 'GET').then(response =>
        response.body.items.forEach(({ id }) => cy.deleteBlueprint(id))
    );
});
