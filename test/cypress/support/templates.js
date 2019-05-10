Cypress.Commands.add('getPages', () =>
    cy.stageRequest('/console/templates/pages')
);

Cypress.Commands.add('getTemplates', () =>
    cy.stageRequest('/console/templates')
);

Cypress.Commands.add('removeUserPages', () => {
    cy.getPages()
        .then((response) => {
            for (let page of response.body) {
                if (page.custom) {
                    cy.stageRequest(`/console/templates/pages/${page.id}`, 'DELETE');
                }
            }
        });
});

Cypress.Commands.add('removeUserTemplates', () => {
    cy.getTemplates()
        .then((response) => {
            for (let template of response.body) {
                if (template.custom) {
                    cy.stageRequest(`/console/templates/${template.id}`, 'DELETE');
                }
            }
        })
});