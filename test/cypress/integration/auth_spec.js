describe('Authentication', () => {
    before(() => cy.activate());

    beforeEach(() => cy.clearCookie('XSRF-TOKEN'));

    it('fails when token is not set in cookies', () => {
        cy.visit('/console').waitUntilLoaded();
        cy.location('pathname').should('be.equal', '/console/login');
    });

    it('succeeds when token is set in cookies', () => {
        cy.getAdminToken().then(token => cy.setCookie('XSRF-TOKEN', token));
        cy.visit('/console').waitUntilLoaded();
        cy.location('pathname').should('be.equal', '/console/');
    });
});
