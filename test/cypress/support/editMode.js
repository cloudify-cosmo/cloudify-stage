Cypress.Commands.add('addWidget', widgetId => {
    cy.get('.usersMenu')
        .click()
        .contains('Edit Mode')
        .click();

    cy.contains('Add Widget').click();
    cy.get(`*[data-id=${widgetId}]`).click();
    cy.contains('Add selected widgets').click();

    cy.contains('.message', 'Edit mode')
        .contains('Exit')
        .click();
});

Cypress.Commands.add('addPage', pageName => {
    cy.get('.usersMenu')
        .click()
        .contains('Edit Mode')
        .click();

    cy.contains('Add Page').click();
    cy.get('.breadcrumb').within(() => {
        cy.get('.pageTitle').click();
        cy.get('.pageTitle.input input')
            .clear()
            .type(pageName);
    });

    cy.contains('.message', 'Edit mode')
        .contains('Exit')
        .click();
});
