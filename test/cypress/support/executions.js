Cypress.Commands.add('getExecutions', (filter = '') => {
    cy.cfyRequest(`/executions${filter ? `?${filter}` : ''}`, 'GET');
});
