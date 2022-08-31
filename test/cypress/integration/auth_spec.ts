import Consts from 'app/utils/consts';

describe('Authentication', () => {
    function setToken(token: string) {
        return cy.setCookie(Consts.TOKEN_COOKIE_NAME, token);
    }

    function setTokenAndLocalStorage(token: string) {
        return setToken(token).initLocalStorage();
    }

    beforeEach(() => cy.clearCookie(Consts.TOKEN_COOKIE_NAME));

    it('fails when token is not set in cookies', () => {
        cy.visit(Consts.CONTEXT_PATH);
        cy.location('pathname').should('be.equal', '/console/login');
    });

    it('succeeds when only token is set in cookies and user enters "/console/external-login" page', () => {
        cy.activate()
            .getAdminToken()
            .then(token => setToken(token));
        cy.visit(`${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.EXTERNAL_LOGIN}`);
        cy.waitUntilAppLoaded();
        cy.location('pathname').should('be.equal', `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.HOME}`);
    });

    it('succeeds when token is set in cookies and license is active', () => {
        cy.activate()
            .getAdminToken()
            .then(token => setTokenAndLocalStorage(token));
        cy.visit(Consts.CONTEXT_PATH);
        cy.location('pathname').should('be.equal', `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.HOME}`);
    });

    it('succeeds when token is set in cookies and license is not active', () => {
        cy.activate('expired_trial_license')
            .getAdminToken()
            .then(token => setTokenAndLocalStorage(token));
        cy.visit(Consts.CONTEXT_PATH);
        cy.location('pathname').should('be.equal', `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.LICENSE}`);
    });
});
