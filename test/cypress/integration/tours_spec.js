import _ from 'lodash';

describe('Tours', () => {
    before(() => cy.activate('valid_trial_license').deleteAllUsersAndTenants());

    beforeEach(() => cy.get('#toursButton').click());

    function resetTemplates() {
        cy.get('.usersMenu')
            .click()
            .contains('Reset Templates')
            .click();
        cy.contains('Yes').click();
        cy.get('#loader');
    }

    function checkTourSteps(tourName, numberOfSteps) {
        cy.contains(tourName).click();
        _.times(numberOfSteps - 1, () => cy.contains('button:not(.loading)', 'Next').click());
        cy.contains('Done');
    }

    describe('for admin user provide', () => {
        before(() => {
            const blueprintName = 'tours_test';
            cy.login()
                .deleteDeployments(blueprintName)
                .deleteBlueprints(blueprintName)
                .uploadBlueprint('blueprints/empty.zip', blueprintName)
                .deployBlueprint(blueprintName, blueprintName);
            resetTemplates();
        });

        it('Cloudify Console Overview tour', () => {
            checkTourSteps('Cloudify Console Overview', 8);
        });

        it('Cloudify Console Dashboard tour', () => {
            checkTourSteps('Cloudify Console Dashboard', 6);
        });

        it('Initial Manager Setup tour', () => {
            checkTourSteps('Initial Manager Setup', 10);
        });

        it('From Blueprint to Execution tour', () => {
            checkTourSteps('From Blueprint to Execution', 8);
        });

        it('Day-two Processes tour', () => {
            checkTourSteps('Day-two Processes', 7);
        });
    });

    describe('for non-admin users provide', () => {
        before(() => {
            const username = 'nonadmin';
            const password = 'password';
            cy.addUser(username, password)
                .addUserToTenant(username, 'default_tenant', 'viewer')
                .login(username, password);
            resetTemplates();
        });

        it('Cloudify Console Overview tour', () => {
            checkTourSteps('Cloudify Console Overview', 8);
        });

        it('Cloudify Console Dashboard tour', () => {
            checkTourSteps('Cloudify Console Dashboard', 6);
        });
    });
});
