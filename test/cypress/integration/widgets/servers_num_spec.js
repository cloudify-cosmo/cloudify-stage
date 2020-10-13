describe('Number of nodes widget', () => {
    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .deleteDeployments('', true)
            .addWidget('serversNum')
    );

    it('should display nodes count', () => {
        cy.contains('.serversNumWidget', '0');
    });
});
