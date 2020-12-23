describe('Maintenance mode button widget', () => {
    before(() => cy.activate('valid_trial_license').usePageMock('maintenanceModeButton').mockLogin());

    it('should enter maintenance mode on click', () => {
        cy.contains('Activate Maintenance Mode').click();
        cy.contains('Yes').click();
        cy.contains('Deactivate Maintenance Mode').click();
        cy.contains('Yes').click();

        cy.location('pathname').should('be.equal', '/console/');
    });
});
