Cypress.Commands.add('deployBlueprint', (blueprintId, deploymentId, inputs = {}) => {
    cy.cfyRequest(`/deployments/${deploymentId}`, 'PUT', null, {
        blueprint_id: blueprintId,
        inputs,
        visibility: 'tenant'
    });
});

Cypress.Commands.add('deleteDeployment', (deploymentId, force = false) => {
    cy.cfyRequest(`/deployments/${deploymentId}?ignore_live_nodes=${force}`, 'DELETE');
});

Cypress.Commands.add('deleteDeployments', (search, force = false) => {
    cy.cfyRequest(`/deployments?_search=${search}`, 'GET').then(response =>
        response.body.items.forEach(({ id }) => cy.deleteDeployment(id, force))
    );
});
