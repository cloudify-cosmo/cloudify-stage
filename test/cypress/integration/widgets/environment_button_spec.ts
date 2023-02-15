describe('Environment button widget', () => {
    before(() => {
        cy.activate().useWidgetWithDefaultConfiguration('environmentButton');
    });

    it('opens From Blueprint modal and lists only environment blueprints', () => {
        cy.interceptSp('POST', '/searches/blueprints').as('blueprintsRequest');

        cy.contains('Create Environment').click();
        cy.contains('From Blueprint').click();

        cy.contains('.modal', 'Deploy blueprint').should('be.visible');
        cy.wait('@blueprintsRequest').then(({ request }) =>
            expect(request.body).to.deep.eq({
                filter_rules: [{ operator: 'any_of', type: 'label', key: 'csys-obj-type', values: ['environment'] }]
            })
        );
    });
});
