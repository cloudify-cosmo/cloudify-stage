describe('Button link widget', () => {
    const url = 'http://wp.pl';
    const label = 'Button link label';

    before(() => cy.activate('valid_trial_license').usePageMock('buttonLink', { label, url }).mockLogin());

    it('should open configured link on click', () => {
        cy.contains(label).click();

        cy.window().its('open').should('be.calledWith', url);
    });
});
