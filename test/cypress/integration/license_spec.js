describe('License Management', () => {

    const validTrialLicense = {name: 'valid trial', file: 'valid_trial_license.yaml', header: 'License is valid'};
    const expiredTrialLicense = {name: 'expired trial', file: 'expired_trial_license.yaml', header: 'The trial license has expired'};
    const validLicenses = [ validTrialLicense, expiredTrialLicense ];
    const invalidLicenses = [
        {
            name: 'tampered', file: 'tampered_paying_license.yaml',
            error: 'The license could not be verified. Please upload a valid license. ' +
                'Visit the Cloudify web site at https://cloudify.co/download/#trial to ' +
                'learn more and acquire a free trial license. For other issues, ' +
                'please contact Cloudify support at https://cloudify.co/support.'
        },
        {
            name: 'invalid', file: 'invalid_license.yaml',
            error: 'This license`s structure is invalid - it does not contain' +
                ' thefollowing mandatory fields: [\'capabilities\',' +
                ' \'cloudify_version\', \'customer_id\', \'expiration_date\',' +
                ' \'license_edition\', \'trial\']'
        }
    ];

    const verifyMessageHeader = (header) => {
        cy.get('.content > .header')
            .should('have.text', header);
    };
    const verifyError = (error) => {
        cy.get('.form > .message')
            .scrollIntoView()
            .within(() => {
            cy.get('.header')
                .should('be.visible')
                .should('have.text', 'License error');
            cy.get('.list > .content')
                .should('have.text', error);
        })
    };
    const goToEditLicense = () => {
        cy.get('.content > button').as('editLicenseButton');
        cy.get('@editLicenseButton')
            .click();

        cy.get('textarea').as('licenseTextArea');
        cy.get('@licenseTextArea')
            .should('be.visible', true);
    };
    const uploadLicense = (licenseFile) => {
        cy.get('textarea').as('licenseTextArea');
        cy.get('.form > button').as('updateButton');

        return cy.fixture(`license/${licenseFile}`)
            .then(license => {
                cy.get('@licenseTextArea')
                    .type(license);
                cy.get('@updateButton')
                    .click();
            }).then(() => {
                cy.get('div.loading')
                    .should('be.not.visible', true);
            });
    };

    before(() => {
        cy.activate()
            .login();
    });

    beforeEach(function () {
        cy.restoreState();
    });

    it('is accessible from users menu', () => {
        cy.visit('/console')
            .waitUntilLoaded();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('License Management').click();

        cy.location('pathname')
            .should('be.equal', '/console/license');
    });

    it('is accessible from About modal', () => {
        cy.visit('/console')
            .waitUntilLoaded();

        cy.get('.helpMenu').click();
        cy.get('.helpMenu').contains('About').click();

        cy.get('.actions > button.yellow')
            .should('have.text', 'License Management')

        cy.get('.actions > button.yellow').click();

        cy.location('pathname')
            .should('be.equal', '/console/license');
    });

    it('fetches license on page load', () => {
        cy.visit('/console/license').waitUntilLoaded();

        goToEditLicense();
        uploadLicense(expiredTrialLicense.file)
            .then(() => verifyMessageHeader(expiredTrialLicense.header));

        // Update license using REST call
        cy.activate()
            .reload()
            .waitUntilLoaded();

        verifyMessageHeader(validTrialLicense.header);
    });

    it('shows active license', () => {
        cy.visit('/console/license');

        cy.get('tbody > :nth-child(2) > :nth-child(2)')
            .should('have.text', 'All');
        cy.get('tbody > :nth-child(3) > :nth-child(2)')
            .should('have.text', 'Premium');
        cy.get('tbody > :nth-child(4) > :nth-child(2)')
            .should('have.text', 'Yes');
        cy.get('tbody > :nth-child(5) > :nth-child(2)')
            .should('have.text', 'INT-AutoTests-111111111');
    });

    it('allows going to app', () => {
        cy.get('.right.aligned > button.ui')
            .click();

        cy.location('pathname')
            .should('be.equal', '/console/');
    });

    for(let license of validLicenses) {
        it(`allows ${license.name} license upload`, () => {
            cy.visit('/console/license');
            goToEditLicense();
            uploadLicense(license.file)
                .then(() => verifyMessageHeader(license.header));
        });
    }

    for(let license of invalidLicenses) {
        it(`handles ${license.name} license error`, () => {
            cy.visit('/console/license');

            goToEditLicense();
            uploadLicense(license.file)
                .then(() => verifyError(license.error));
        });
    }
});