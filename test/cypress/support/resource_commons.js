import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function waitUntilEmpty(resource, search, numberOfRetriesLeft = 60, waitingInterval = 1000) {
    if (numberOfRetriesLeft <= 0) {
        throw new Error(`Number of retries exceeded for resource=${resource}, search=${search}.`);
    }

    cy.cfyRequest(`/${resource}?_search=${search}`, 'GET').then(response => {
        if (_.isEmpty(response.body.items)) {
            return;
        }
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(waitingInterval);
        waitUntilEmpty(resource, search, numberOfRetriesLeft - 1, waitingInterval);
    });
}
