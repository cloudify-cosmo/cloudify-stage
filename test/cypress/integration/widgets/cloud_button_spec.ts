describe('Setup cloud account button widget', () => {
    before(() => cy.activate().useWidgetWithDefaultConfiguration('cloudButton'));

    it('should display a modal on button click', () => {
        cy.clickButton('Setup cloud account');

        cy.get('.modal').within(() => {
            cy.contains('Welcome to Cloudify');
        });
    });
});
