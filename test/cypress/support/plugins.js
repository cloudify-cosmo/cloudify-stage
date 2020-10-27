const uploadPluginTimeout = 2 * 60 * 1000;

Cypress.Commands.add('installPlugin', (wagonUrl, yamlUrl) =>
    cy.stageRequest(`/console/plugins/upload?visibility=tenant&wagonUrl=${wagonUrl}&yamlUrl=${yamlUrl}`, 'POST', {
        failOnStatusCode: false,
        timeout: uploadPluginTimeout
    })
);

Cypress.Commands.add('uploadPluginFromCatalog', pluginName => {
    cy.server();
    // eslint-disable-next-line security/detect-non-literal-regexp
    cy.route('POST', new RegExp(`console/plugins/upload.*title=${pluginName}`)).as('pluginUpload');

    cy.log(`Upload ${pluginName} plugin`);
    cy.visitPage('Cloudify Catalog');
    cy.get('.pluginsCatalogWidget').within(() => {
        cy.contains('tr', pluginName).find('button').click();
    });
    cy.get('.modal').within(() => {
        cy.get('button.ok').click();
    });
    cy.wait('@pluginUpload', { responseTimeout: uploadPluginTimeout });
    cy.get('.modal').should('be.not.visible');
    cy.get('.pluginsCatalogWidget .message').should('have.text', `${pluginName} successfully uploaded`);
});

Cypress.Commands.add('deletePlugins', () => {
    cy.cfyRequest('/plugins').then(response =>
        response.body.items.forEach(({ id }) => cy.cfyRequest(`/plugins/${id}`, 'DELETE', null, { force: true }))
    );
});
