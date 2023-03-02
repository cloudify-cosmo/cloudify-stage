describe('License Management', () => {
    const validTrialLicense = { name: 'valid trial', file: 'valid_trial_license.yaml', header: 'License is valid' };
    const expiredTrialLicense = {
        name: 'expired trial',
        file: 'expired_trial_license.yaml',
        header: 'The trial license has expired'
    };
    const validLicenses = [validTrialLicense, expiredTrialLicense];
    const invalidLicenses = [
        {
            name: 'tampered',
            file: 'tampered_paying_license.yaml',
            error:
                'The license could not be verified. Please upload a valid license. ' +
                'Visit the Cloudify web site at https://cloudify.co/download/#trial to ' +
                'learn more and acquire a free trial license. For other issues, ' +
                'please contact Cloudify support at https://cloudify.co/support.'
        },
        {
            name: 'invalid',
            file: 'invalid_license.yaml',
            error:
                'This license`s structure is invalid - it does not contain' +
                " thefollowing mandatory fields: ['capabilities'," +
                " 'cloudify_version', 'customer_id', 'expiration_date'," +
                " 'license_edition', 'trial']"
        }
    ];

    const verifyMessageHeader = (header: string) => {
        cy.get('.content .header').should('have.text', header);
    };
    const verifyError = (error: string) => {
        cy.get('.form > .message')
            .scrollIntoView()
            .within(() => {
                cy.get('.header').should('be.visible').should('have.text', 'License error');
                cy.get('.list > .content').should('have.text', error);
            });
    };
    const goToEditLicense = () => {
        cy.get('.content > button').as('editLicenseButton');
        cy.get('@editLicenseButton').click();

        cy.get('textarea').as('licenseTextArea');
        cy.get('@licenseTextArea').should('be.visible', true);
    };
    const uploadLicense = (licenseFile: string) => {
        cy.get('textarea').as('licenseTextArea');
        cy.get('.form > button').as('updateButton');

        return cy
            .fixture(`license/${licenseFile}`)
            .then(license => {
                // Mimic copy-paste behavior to speed up the test
                // Ref.: https://github.com/cypress-io/cypress/issues/1123#issuecomment-485329565
                cy.get('@licenseTextArea').clear().invoke('val', license).trigger('input').type(' {backspace}');
                cy.get('@updateButton').click();
            })
            .then(() => {
                cy.get('div.loading').should('not.exist');
            });
    };

    const licenseManagementUrl = '/console/license';

    before(cy.activate);
    beforeEach(() => cy.usePageMock().mockLoginWithoutWaiting());

    describe('is accessible from', () => {
        it('users menu', () => {
            cy.clickSystemMenuItem('admin').clickSystemMenuItem('License Management');

            cy.location('pathname').should('be.equal', licenseManagementUrl);
        });

        it('About modal', () => {
            cy.clickSystemMenuItem('Help').clickSystemMenuItem('About');

            cy.get('.actions > button.yellow').should('have.text', 'License Management');

            cy.get('.actions > button.yellow').click();

            cy.location('pathname').should('be.equal', licenseManagementUrl);
        });
    });

    describe('is providing License Page that', () => {
        beforeEach(() => cy.visit(licenseManagementUrl));

        it('fetches license on page load', () => {
            goToEditLicense();
            uploadLicense(expiredTrialLicense.file).then(() => verifyMessageHeader(expiredTrialLicense.header));

            cy.activate().reload();

            verifyMessageHeader(validTrialLicense.header);
        });

        it('shows active license', () => {
            cy.get('tbody > :nth-child(2) > :nth-child(2)').should('have.text', 'All');
            cy.get('tbody > :nth-child(3) > :nth-child(2)').should('have.text', 'Premium');
            cy.get('tbody > :nth-child(4) > :nth-child(2)').should('have.text', 'Yes');
            cy.get('tbody > :nth-child(5) > :nth-child(2)').should('have.text', 'INT-AutoTests-111111111');
        });

        it('allows going to app', () => {
            cy.get('.right.aligned > button.ui').click();

            cy.location('pathname').should('be.equal', '/console/');
        });
        validLicenses.forEach(license => {
            it(`allows ${license.name} license upload`, () => {
                goToEditLicense();
                uploadLicense(license.file).then(() => verifyMessageHeader(license.header));
            });
        });

        invalidLicenses.forEach(license => {
            it(`handles ${license.name} license error`, () => {
                goToEditLicense();
                uploadLicense(license.file).then(() => verifyError(license.error));
            });
        });

        it('handles inactive license error', () => {
            cy.cfyRequest('/license', 'DELETE');
            cy.contains('Get a license').should('be.visible');
        });
    });
});
