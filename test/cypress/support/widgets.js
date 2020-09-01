Cypress.Commands.add('getWidgets', () => cy.stageRequest('/console/widgets/list'));

Cypress.Commands.add('removeCustomWidgets', () => {
    cy.getWidgets().then(response => {
        response.body.forEach(widget => {
            if (widget.isCustom) {
                cy.stageRequest(`/console/widgets/${widget.id}`, 'DELETE');
            }
        });
    });
});
