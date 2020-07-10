import { waitUntilEmpty } from './resource_commons';

Cypress.Commands.add('getDeployment', deploymentId => cy.cfyRequest(`/deployments/${deploymentId}`, 'GET'));

Cypress.Commands.add('deployBlueprint', (blueprintId, deploymentId, inputs = {}) => {
    cy.cfyRequest(`/deployments/${deploymentId}`, 'PUT', null, {
        blueprint_id: blueprintId,
        inputs,
        visibility: 'tenant'
    });
});

Cypress.Commands.add('setSite', (deploymentId, siteName) => {
    cy.cfyRequest(
        `/deployments/${deploymentId}/set-site`,
        'POST',
        null,
        siteName !== ''
            ? {
                  site_name: siteName,
                  detach_site: false
              }
            : {
                  detach_site: true
              }
    );
});

Cypress.Commands.add('deleteDeployment', (deploymentId, force = false) => {
    cy.cfyRequest(`/deployments/${deploymentId}?force=${force}`, 'DELETE');
});

Cypress.Commands.add('deleteDeployments', (search, force = false) => {
    cy.cfyRequest(`/deployments?_search=${search}`, 'GET')
        .then(response => response.body.items.forEach(({ id }) => cy.deleteDeployment(id, force)))
        .then(() => waitUntilEmpty('deployments', search));
});
