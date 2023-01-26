import Consts from 'app/utils/consts';

describe('Authentication', () => {
    const homePagePath = `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.HOME}`;
    const loginPagePath = `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.LOGIN}`;
    const logoutPagePath = `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.LOGOUT}`;
    const licensePagePath = `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.LICENSE}`;

    function setToken(token: string) {
        return cy.setCookie(Consts.TOKEN_COOKIE_NAME, token);
    }

    function setTokenAndLocalStorage(token: string) {
        return setToken(token).initLocalStorage();
    }

    beforeEach(() => cy.clearCookie(Consts.TOKEN_COOKIE_NAME));

    describe('during log-in process', () => {
        it('fails when token is not set in cookies', () => {
            cy.visit(Consts.CONTEXT_PATH);
            cy.location('pathname').should('be.equal', loginPagePath);
        });

        it('succeeds when only token is set in cookies and user enters "/console/external-login" page', () => {
            cy.activate()
                .getAdminToken()
                .then(token => setToken(token));
            cy.visit(`${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.EXTERNAL_LOGIN}`);
            cy.waitUntilAppLoaded();
            cy.location('pathname').should('be.equal', homePagePath);
        });

        it('succeeds when token is set in cookies and license is active', () => {
            cy.activate()
                .getAdminToken()
                .then(token => setTokenAndLocalStorage(token));
            cy.visit(Consts.CONTEXT_PATH);
            cy.location('pathname').should('be.equal', homePagePath);
        });

        it('succeeds when token is set in cookies and license is not active', () => {
            cy.activate('expired_trial_license')
                .getAdminToken()
                .then(token => setTokenAndLocalStorage(token));
            cy.visit(Consts.CONTEXT_PATH);
            cy.location('pathname').should('be.equal', licensePagePath);
        });
    });

    describe('after log-in process', () => {
        it('fails when token has expired', () => {
            cy.activate().mockLogin();

            cy.interceptSp('GET', '/*', {
                statusCode: 401
            });

            cy.location('pathname').should('be.equal', logoutPagePath);
            cy.contains('User not authorized');
            cy.contains('Back to login').click();
            cy.location('pathname').should('be.equal', loginPagePath);
        });

        it('fails when license has expired', () => {
            cy.activate().mockLogin();

            cy.interceptSp('GET', '/*', {
                statusCode: 400,
                body: {
                    error_code: Consts.EXPIRED_LICENSE_ERROR_CODE
                }
            });

            cy.location('pathname').should('be.equal', logoutPagePath);
            cy.contains('License has expired');
            cy.contains('Back to login').click();
            cy.location('pathname').should('be.equal', loginPagePath);
        });
    });
});
