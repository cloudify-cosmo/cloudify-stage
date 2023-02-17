import Consts from 'app/utils/consts';
import { testPageUrl } from 'test/cypress/support/commands';
import type { GetUserAppResponse } from 'backend/routes/UserApp.types';
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

        const redirectUrl = testPageUrl;
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

            cy.interceptWithoutCaching<GetUserAppResponse>('/console/ua', userAppsData => ({
                ...userAppsData!,
                appDataVersion: currentAppDataVersion - 1
            })).as('fetchUserApps');
            cy.intercept('GET', '/console/templates/initial').as('fetchTemplateId');
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

    it('fails when provided credentials are valid, license is active but user has no tenants assigned', () => {
        cy.intercept('GET', '/console/auth/user', {
            statusCode: 200,
            body: { username: 'test', role: 'default', groupSystemRoles: {}, tenantsRoles: {} }
        });

        cy.activate();
        forceLogin();

        cy.location('pathname').should('be.equal', '/console/logout');
        cy.contains('Unfortunately you cannot login since your account is not associated with any tenants.');
    });

    it('fails when all credentials are not provided', () => {
        const expectedErrorMessage = 'Please fill your credentials';
        const getLoginField = (fieldPlaceholder: string) => {
            return cy.get(`input[placeholder="${fieldPlaceholder}"]`);
        };
        const typeToLoginField = (fieldPlaceholder: string, value: string) => {
            getLoginField(fieldPlaceholder).clear().type(value);
        };
        const submitLoginForm = () => {
            cy.clickButton('LOGIN');
        };

        cy.visit('/console/login');

        submitLoginForm();
        cy.get('.error.message').should('have.text', expectedErrorMessage);

        typeToLoginField('Username', 'test');
        submitLoginForm();
        cy.get('.error.message').should('have.text', expectedErrorMessage);

        getLoginField('Username').clear();

        typeToLoginField('Password', 'test');
        submitLoginForm();
        cy.get('.error.message').should('have.text', expectedErrorMessage);

        typeToLoginField('Username', 'test');
        submitLoginForm();
        cy.get('.error.message').should('not.have.text', expectedErrorMessage);
    });

    describe('fails when provided credentials are invalid', () => {
        it('for admin user', () => {
            cy.login({ password: 'invalid-password', expectSuccessfulLogin: false });

            cy.get('.error.message').should(
                'have.text',
                'User unauthorized: Authentication failed for user admin. Wrong credentials or locked account'
            );
            cy.location('pathname').should('be.equal', '/console/login');
        });

        it('for non admin user', () => {
            cy.login({ username: 'invalid-username', expectSuccessfulLogin: false });

            cy.get('.error.message').should(
                'have.text',
                'Incorrect username and/or password. Please check and try again.'
            );
            cy.location('pathname').should('be.equal', '/console/login');
        });
    });

    it('fails when manager data cannot be fetched', () => {
        cy.intercept('GET', '/console/auth/manager', {
            statusCode: 500,
            body: {}
        });

        cy.activate();
        forceLogin();

        cy.location('pathname').should('be.equal', '/console/logout');
        cy.get('.error.message').should('have.text', 'Error fetching data from the manager, cannot load page');
    });

    it('redirects to another page when app configured to use not default login page', () => {
        const customLoginPageUrl = '/my-login-page';
        cy.interceptWithoutCaching<ClientConfig>('/console/config', clientConfig => {
            clientConfig.app.auth.loginPageUrl = customLoginPageUrl;
            return clientConfig;
        });

        cy.visit('/');

        cy.location('pathname').should('be.equal', customLoginPageUrl);
    });
});
