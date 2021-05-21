import _ from 'lodash';

describe('Tours', () => {
    before(() => cy.activate('valid_trial_license').deleteAllUsersAndTenants());

    beforeEach(() => cy.get('#toursButton').click());

    function checkTourSteps(tourName, numberOfSteps) {
        cy.contains(tourName).click();
        _.times(numberOfSteps - 1, () => cy.contains('button:not(.loading)', 'Next').click());
        cy.contains('Done');
    }

    describe('for admin user provide', () => {
        before(() => {
            const blueprintName = 'tours_test';
            cy.mockLogin()
                .deleteDeployments(blueprintName)
                .deleteBlueprints(blueprintName)
                .uploadBlueprint('blueprints/empty.zip', blueprintName)
                .deployBlueprint(blueprintName, blueprintName);
        });

        it('Cloudify Console Overview tour', () => {
            checkTourSteps('Cloudify Console Overview', 8);
        });

        it('Cloudify Console Dashboard tour', () => {
            checkTourSteps('Cloudify Console Dashboard', 6);
        });
    });

    describe('for non-admin users provide', () => {
        before(() => {
            const username = 'nonadmin';
            const password = 'password';
            cy.addUser(username, password)
                .addUserToTenant(username, 'default_tenant', 'viewer')
                .mockLogin(username, password);
        });

        it('Cloudify Console Overview tour', () => {
            checkTourSteps('Cloudify Console Overview', 8);
        });

        it('Cloudify Console Dashboard tour', () => {
            checkTourSteps('Cloudify Console Dashboard', 6);
        });
    });
});
