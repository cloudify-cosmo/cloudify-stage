Cypress.Commands.add('deleteSecrets', search => {
    cy.cfyRequest(`/secrets?_search=${search}`, 'GET').then(response =>
        response.body.items.forEach(({ key }) => cy.cfyRequest(`/secrets/${key}`, 'DELETE'))
    );
});
