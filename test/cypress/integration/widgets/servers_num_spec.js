describe('Number of nodes widget', () => {
    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('serversNum', { pollingTime: 1 })
            .login()
            .deleteDeployments('', true)
    );

    it('should display nodes count', () => {
        cy.contains('.serversNumWidget', '0');
    });
});
