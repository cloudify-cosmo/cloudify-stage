import Consts from 'app/utils/consts';
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
        cy.intercept('/console/config', req => {
            req.on('response', res => {
                const responseBody = res.body;
                responseBody.app.whiteLabel = userConfig.whiteLabel;
                res.send(responseBody);
            });
        });
    }

    before(cy.activate);

    describe('allows to customize Login page', () => {
        before(() => {
            mockConfigResponse();
            cy.intercept('GET', '/console/auth/first-login', { body: true });
            cy.visit('/console/login');
            cy.get('.loginContainer').should('be.visible');
        });

        it('logo', () => {
            cy.log('Verifying logoUrl...');
            cy.get('.loginContainer .logo').should('have.css', 'background-image', `url("http://test.com/logo.png")`);
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
            cy.log('Verifying logoUrl...');
            cy.get('.sidebarContainer .logo').should('have.css', 'background-image', `url("http://test.com/logo.png")`);
        });

        it('version details', () => {
            const majorVersion = String(Consts.APP_VERSION)[0];
            cy.log('Verifying showVersionDetails...');
            cy.get('.sidebar > div > a').should('not.contain.text', `v ${majorVersion}`);
            cy.get('a[href="/console/license"]').should('not.exist');
        });
    });
});
