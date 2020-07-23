Cypress.Commands.add('installPlugin', (wagonUrl, yamlUrl) =>
    cy.stageRequest(`/console/plugins/upload?visibility=tenant&wagonUrl=${wagonUrl}&yamlUrl=${yamlUrl}`, 'POST', {
        failOnStatusCode: false,
        timeout: 80000
    })
);

Cypress.Commands.add('deletePlugins', () => {
    cy.cfyRequest('/plugins').then(response =>
        response.body.items.forEach(({ id }) => cy.cfyRequest(`/plugins/${id}`, 'DELETE', null, { force: true }))
    );
});
