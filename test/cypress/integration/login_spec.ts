// @ts-nocheck File not migrated fully to TS
import Consts from 'app/utils/consts';

describe('Login', () => {
    it('succeeds when provided credentials are valid and license is active', () => {
        cy.activate().usePageMock().login();

        cy.location('pathname').should('be.equal', '/console/');
    });

    it('succeeds and redirects when provided credentials are valid, license is active and redirect query parameter is specified', () => {
        cy.activate();

        const redirectUrl = '/console/page/test_page';
        cy.visit(`/console/login?redirect=${redirectUrl}`);

        cy.usePageMock().login();

        cy.location('pathname').should('be.equal', redirectUrl);
    });

    it('succeeds and resets user pages when application version is different than the one stored in the DB', () => {
        const currentAppDataVersion = Consts.APP_VERSION;
        const fetchUserAppsTimeout = 20000;

        cy.intercept('GET', '/console/ua', req => {
            req.reply(res => {
                res.body.appDataVersion = currentAppDataVersion - 1;
                res.send(res.body);
            });
        }).as('fetchUserApps');
        cy.intercept('GET', '/console/templates/select?tenant=default_tenant').as('fetchTemplateId');
        cy.intercept('POST', '/console/ua').as('updateUserApps');

        cy.activate().login('admin', 'admin', false);

        cy.wait('@fetchUserApps', { timeout: fetchUserAppsTimeout });
        cy.wait('@fetchTemplateId').its('response.body').should('equal', 'main-sys_admin');
        cy.wait('@updateUserApps').its('response.body.appDataVersion').should('equal', currentAppDataVersion);
    });

    it('succeeds when provided credentials are valid and license is not active', () => {
        cy.uploadLicense('expired_trial_license').login();

        cy.get('.container h2').should('contain.text', 'License Management');
        cy.location('pathname').should('be.equal', '/console/license');
    });

    it('provides SSO login button when SAML is enabled', () => {
        cy.activate();

        const ssoUrl = '/sso-redirect';
        cy.intercept('/console/config', {
            app: {
                saml: {
                    enabled: true,
                    ssoUrl
                }
            }
        });

        cy.visit('/console/login').waitUntilLoaded();
        cy.get('button').as('loginButton');

        cy.get('@loginButton').should('contain.text', 'LOGIN WITH SSO');
        cy.get('input').should('not.exist');

        cy.get('@loginButton').click();
        cy.url().should('include', ssoUrl);

        cy.reload();
    });

    it('fails when provided credentials are valid, license is active but user has no tenants assigned', () => {
        cy.intercept('GET', '/console/auth/user', {
            statusCode: 200,
            body: { username: 'test', role: 'default', groupSystemRoles: {}, tenantsRoles: {} }
        });

        cy.activate().login();

        cy.location('pathname').should('be.equal', '/console/noTenants');
        cy.contains('User is not associated with any tenants');
    });

    it('fails when provided credentials are invalid', () => {
        cy.login('admin', 'invalid-password', false);

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

        cy.activate().login('admin', 'admin');

        cy.location('pathname').should('be.equal', '/console/error');
        cy.get('.error.message').should('have.text', 'Error getting data from the manager, cannot load page');
    });

    it('fails when user data cannot be fetched', () => {
        cy.intercept('GET', '/console/auth/user', {
            statusCode: 500,
            body: {}
        });

        cy.activate().login('admin', 'admin');

        cy.location('pathname').should('be.equal', '/console/error');
        cy.get('.error.message').should('have.text', 'Error initializing user data, cannot load page');
    });
});
