Cypress.Commands.add('getPages', () => cy.stageRequest('/console/templates/pages'));

Cypress.Commands.add('getTemplates', () => cy.stageRequest('/console/templates'));

Cypress.Commands.add('removeUserPages', () => {
    cy.getPages().then(response => {
        const pages = response.body;
        pages.forEach(page => {
            if (page.custom) {
                cy.stageRequest(`/console/templates/pages/${page.id}`, 'DELETE');
            }
        });
    });
});

Cypress.Commands.add('removeUserTemplates', () => {
    cy.getTemplates().then(response => {
        const templates = response.body;
        templates.forEach(template => {
            if (template.custom) {
                cy.stageRequest(`/console/templates/${template.id}`, 'DELETE');
            }
        });
    });
});
