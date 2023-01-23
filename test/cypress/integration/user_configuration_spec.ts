import Consts from 'app/utils/consts';
import type { ClientConfig } from 'backend/routes/Config.types';
import userConfig from '../fixtures/configuration/userConfig.json';

describe('User configuration', () => {
    const colors = {
        black: 'rgb(0, 0, 0)',
        blue: 'rgb(0, 0, 255)',
        grey: 'rgb(128, 128, 128)',
        lightgrey: 'rgb(211, 211, 211)',
        white: 'rgb(255, 255, 255)'
    };

    function mockConfigResponse() {
        cy.interceptWithoutCaching<ClientConfig>('/console/config', clientConfig => {
            clientConfig.app.whiteLabel = userConfig.whiteLabel;
            return clientConfig;
        });
    }

    function verifyLogoUrl(selector: string) {
        cy.log('Verifying logoUrl...');
        cy.location('protocol').then(protocol =>
            cy.get(selector).should('have.css', 'background-image', `url("${protocol}//test.com/logo.png")`)
        );
    }

    before(cy.activate);

    describe('allows to customize Login page', () => {
        before(() => {
            mockConfigResponse();
            cy.visit('/console');
            cy.get('.loginContainer').should('be.visible');
        });

        it('logo', () => {
            verifyLogoUrl('.loginContainer .logo');
        });

        it('colors', () => {
            cy.log('Verifying mainColor...');
            cy.get('.fullScreenSegment').should('have.css', 'background-color', colors.blue);

            cy.get('.loginContainer').within(() => {
                cy.log('Verifying loginPageHeaderColor...');
                cy.get('h2').should('have.css', 'color', colors.lightgrey);
                cy.log('Verifying loginPageTextColor...');
                cy.get('p').should('have.css', 'color', colors.black);
            });
        });

        it('first login hint', () => {
            cy.contains('For the first login').should('not.exist');
        });
    });

    describe('allows to customize page', () => {
        before(() => {
            mockConfigResponse();
            cy.mockLogin();
        });

        it('sidebar', () => {
            cy.log('Verifying headerTextColor...');
            cy.get('.sidebarContainer > div > div > a').should('have.css', 'color', colors.black);

            cy.get('.sidebarContainer').within(() => {
                cy.log('Verifying sidebarColor...');
                cy.get('.sidebar').should('have.css', 'background-color', colors.grey);
                cy.log('Verifying sidebarTextColor...');
                cy.get('.pageMenuItem').should('have.css', 'color', colors.black);
            });
        });

        it('logo', () => {
            verifyLogoUrl('.sidebarContainer .logo');
        });

        it('version details', () => {
            const majorVersion = String(Consts.APP_VERSION)[0];
            cy.log('Verifying showVersionDetails...');
            cy.get('.sidebar > div > a').should('not.contain.text', `v ${majorVersion}`);
            cy.get('a[href="/console/license"]').should('not.exist');
        });
    });
});
