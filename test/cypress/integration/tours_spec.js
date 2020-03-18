import _ from 'lodash';

describe('Tours', () => {
    before(() => {
        cy.activate('valid_spire_license')
            .deleteAllUsersAndTenants()
            .login();
        cy.get('.usersMenu')
            .click()
            .contains('Reset Templates')
            .click();
        cy.contains('Yes').click();
        cy.get('#loader');
    });

    beforeEach(function() {
        cy.get('#toursButton').click();
    });

    function checkTourSteps(tourName, numberOfSteps) {
        cy.contains(tourName).click();
        _.times(numberOfSteps - 1, () => cy.contains('button:not(.loading)', 'Next').click());
        cy.contains('Done');
    }

    it('Cloudify Console Overview', () => {
        checkTourSteps('Cloudify Console Overview', 8);
    });

    it('Cloudify Console Dashboard', () => {
        checkTourSteps('Cloudify Console Dashboard', 6);
    });

    it('Initial Manager Setup', () => {
        checkTourSteps('Initial Manager Setup', 10);
    });

    it('From Blueprint to Execution', () => {
        checkTourSteps('From Blueprint to Execution', 8);
    });

    it('Day-two Processes', () => {
        checkTourSteps('Day-two Processes', 7);
    });
});
