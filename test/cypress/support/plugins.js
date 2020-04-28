Cypress.Commands.add('installPlugin', (wagonUrl, yamlUrl) =>
    cy.stageRequest(`/console/plugins/upload?visibility=tenant&wagonUrl=${wagonUrl}&yamlUrl=${yamlUrl}`, 'POST', {
        failOnStatusCode: false
    })
);
