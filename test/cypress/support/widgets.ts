Cypress.Commands.add('getWidgets', () => cy.stageRequest('/console/widgets/list'));

Cypress.Commands.add('removeCustomWidgets', () => {
    (cy as any).getWidgets().then((response: any) => {
        response.body.forEach((widget: any) => {
            if (widget.isCustom) {
                cy.stageRequest(`/console/widgets/${widget.id}`, 'DELETE');
            }
        });
    });
});
