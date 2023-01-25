import Consts from 'app/utils/consts';
import type { ClientConfig } from 'backend/routes/Config.types';
import { secondsToMs } from '../support/resource_commons';

describe('Login', () => {
    function forceLogin(options?: Parameters<typeof cy.login>[0]) {
        cy.login({ ...options, forceVisitLoginPage: true });
    }

    beforeEach(() => cy.interceptWithoutCaching('/console/config'));

    it('succeeds when provided credentials are valid and license is active', () => {
        cy.activate().usePageMock();
        forceLogin();

        cy.location('pathname').should('be.equal', '/console/');
    });

    it('succeeds and redirects when provided credentials are valid, license is active and redirect query parameter is specified', () => {
        cy.activate().usePageMock();

        const redirectUrl = '/console/page/test_page';
        cy.visit(`/console/login?redirect=${redirectUrl}`);

        cy.login();

        cy.location('pathname').should('be.equal', redirectUrl);
    });

    it(
        'succeeds and resets user pages when application version is different than the one stored in the DB',
        { retries: { runMode: 2 } },
        () => {
            const currentAppDataVersion = Consts.APP_VERSION;
            const fetchUserAppsTimeout = secondsToMs(20);

            cy.interceptWithoutCaching<any>('/console/ua', userAppsData => ({
                ...userAppsData!,
                appDataVersion: currentAppDataVersion - 1
            })).as('fetchUserApps');
            cy.intercept('GET', '/console/templates/select?tenant=default_tenant').as('fetchTemplateId');
            cy.intercept('POST', '/console/ua').as('updateUserApps');

            cy.activate();
            forceLogin({ expectSuccessfulLogin: false });

            cy.wait('@fetchUserApps', { timeout: fetchUserAppsTimeout });
            cy.wait('@fetchTemplateId').its('response.body').should('equal', 'main-sys_admin');
            cy.wait('@updateUserApps').its('response.body.appDataVersion').should('equal', currentAppDataVersion);
        }
    );

    it('succeeds when provided credentials are valid and license is not active', () => {
        cy.uploadLicense('expired_trial_license');
        forceLogin();

        cy.get('.container h2').should('contain.text', 'License Management');
        cy.location('pathname').should('be.equal', '/console/license');
    });

    it('succeeds when provided credentials are valid, license is active and user has sys_admin role and no tenants assigned', () => {
        cy.intercept('GET', '/console/auth/user', {
            statusCode: 200,
            body: { username: 'test', role: 'sys_admin', groupSystemRoles: {}, tenantsRoles: {} }
        });

        cy.activate();
        forceLogin();

        cy.location('pathname').should('be.equal', '/console/');
    });

    it('provides credentials hint on first time login', () => {
        cy.activate();

        cy.intercept('GET', '/console/auth/first-login', { body: true });
        cy.visit('/console/login');

        cy.contains('For the first login').should('be.visible');
    });

    it('provides SSO login button when SAML is enabled', () => {
        cy.activate();

        const ssoUrl = '/sso-redirect';
        cy.intercept(ssoUrl).as('ssoRedirect');
        cy.interceptWithoutCaching<ClientConfig>('/console/config', clientConfig => {
            clientConfig.app.saml.enabled = true;
            clientConfig.app.saml.ssoUrl = ssoUrl;
            return clientConfig;
        });

        cy.visit('/console/login').waitUntilAppLoaded();
        cy.get('button').as('loginButton');

        cy.get('@loginButton').should('contain.text', 'LOGIN WITH SSO');
        cy.get('input').should('not.exist');

        cy.get('@loginButton').click();
        cy.wait('@ssoRedirect');
    });

    it('fails when provided credentials are valid, license is active but user has no tenants assigned', () => {
        cy.intercept('GET', '/console/auth/user', {
            statusCode: 200,
            body: { username: 'test', role: 'default', groupSystemRoles: {}, tenantsRoles: {} }
        });

        cy.activate();
        forceLogin();

        cy.location('pathname').should('be.equal', '/console/noTenants');
        cy.contains('User is not associated with any tenants');
    });

    it('fails when provided credentials are invalid', () => {
        cy.login({ password: 'invalid-password', expectSuccessfulLogin: false });

        cy.get('.error.message').should(
            'have.text',
            'User unauthorized: Authentication failed for user admin. Wrong credentials or locked account'
        );
        cy.location('pathname').should('be.equal', '/console/login');
    });

    it('fails when manager data cannot be fetched', () => {
        cy.intercept('GET', '/console/auth/manager', {
            statusCode: 500,
            body: {}
        });

        cy.activate();
        forceLogin();

        cy.location('pathname').should('be.equal', '/console/error');
        cy.get('.error.message').should('have.text', 'Error getting data from the manager, cannot load page');
    });
});
