Cypress.Commands.add('enterEditMode', () => {
    cy.get('.usersMenu').click().contains('Edit Mode').click();
});

Cypress.Commands.add('exitEditMode', () => {
    cy.get('.editModeSidebar').contains('Exit').click();
});

Cypress.Commands.add('addWidget', widgetId => {
    cy.enterEditMode();

    cy.contains('Add Widgets').click();
    cy.contains('Add Widget').click();
    cy.get(`*[data-id=${widgetId}]`).click();
    cy.contains('Add selected widgets').click();

    cy.exitEditMode();
});

Cypress.Commands.add('addPage', pageName => {
    cy.enterEditMode();

    cy.contains('Add Page').click();
    cy.get('.breadcrumb').within(() => {
        cy.get('.pageTitle').click();
        cy.get('.pageTitle.input input').clear().type(pageName);
    });

    cy.exitEditMode();
});

Cypress.Commands.add('editWidgetConfiguration', (widgetId, fnWithinEditWidgetModal, save = true) => {
    cy.enterEditMode();

    cy.get(`.${widgetId}Widget .widgetEditButtons .editWidgetIcon`).click({ force: true });
    cy.get('.editWidgetModal').within(() => {
        fnWithinEditWidgetModal();
        cy.get(`button${save ? '.ok' : '.cancel'}`).click();
    });

    cy.exitEditMode();
});
