describe('Button link widget', () => {
    before(() => cy.activate('valid_trial_license').login());

    it('should open configured link on click', () => {
        cy.contains('Getting Started Walkthrough').click();

        cy.window()
            .its('open')
            .should('be.calledWith', 'https://docs.cloudify.co/latest/trial_getting_started/examples/');
    });
});
