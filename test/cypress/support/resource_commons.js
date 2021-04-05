import _ from 'lodash';

function appendQueryParam(url, param, value) {
    return `${url}${url.indexOf('?') > 0 ? '&' : '?'}${param}=${value}`;
}

// eslint-disable-next-line import/prefer-default-export
export function waitUntilEmpty(resource, search, numberOfRetriesLeft = 60, waitingInterval = 1000) {
    if (numberOfRetriesLeft <= 0) {
        throw new Error(`Number of retries exceeded for resource=${resource}, search=${search}.`);
    }

    let url = `/${resource}`;
    if (search) url = appendQueryParam(url, `_search`, search);
    cy.cfyRequest(url, 'GET').then(response => {
        if (_.isEmpty(response.body.items)) {
            return;
        }
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(waitingInterval);
        waitUntilEmpty(resource, search, numberOfRetriesLeft - 1, waitingInterval);
    });
}
