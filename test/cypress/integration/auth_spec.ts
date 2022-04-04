describe('Authentication', () => {
    function setTokenAndLocalStorage(token: string) {
        return cy.setCookie('XSRF-TOKEN', token).initLocalStorage('admin', 'sys_admin');
    }
    beforeEach(() => cy.clearCookie('XSRF-TOKEN'));

    it('fails when token is not set in cookies', () => {
        cy.visit('/console');
        cy.location('pathname').should('be.equal', '/console/login');
    });

    it('succeeds when token is set in cookies and license is active', () => {
        cy.activate()
            .getAdminToken()
            .then(token => setTokenAndLocalStorage(token));
        cy.visit('/console').waitUntilLoaded();
        cy.location('pathname').should('be.equal', '/console/');
    });

    it('succeeds when token is set in cookies and license is not active', () => {
        cy.activate('expired_trial_license')
            .getAdminToken()
            .then(token => setTokenAndLocalStorage(token));
        cy.visit('/console');
        cy.location('pathname').should('be.equal', '/console/license');
    });
});
