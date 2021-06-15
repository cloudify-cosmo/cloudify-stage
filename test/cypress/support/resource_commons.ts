import _ from 'lodash';

function appendQueryParam(url: string, param: string, value: string) {
    return `${url}${url.indexOf('?') > 0 ? '&' : '?'}${param}=${value}`;
}

function waitUntil(
    resource: string,
    predicate: (response: Cypress.Response) => boolean,
    { search, numberOfRetriesLeft, waitingInterval } = {
        search: '',
        numberOfRetriesLeft: 60,
        waitingInterval: 1000
    }
) {
    if (numberOfRetriesLeft <= 0) {
        throw new Error(`Number of retries exceeded for resource=${resource}, search=${search}.`);
    }

    let url = `/${resource}`;
    if (search) {
        url = appendQueryParam(url, `_search`, search);
    }
    cy.cfyRequest(url, 'GET').then(response => {
        if (predicate(response)) {
            return;
        }
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(waitingInterval);
        waitUntilEmpty(resource, search, numberOfRetriesLeft - 1, waitingInterval);
    });
}

export function waitUntilNotEmpty(resource: string, search: string, numberOfRetriesLeft = 60, waitingInterval = 1000) {
    waitUntil(resource, response => !_.isEmpty(response.body.items), { search, numberOfRetriesLeft, waitingInterval });
}

export function waitUntilEmpty(resource: string, search: string, numberOfRetriesLeft = 60, waitingInterval = 1000) {
    waitUntil(resource, response => _.isEmpty(response.body.items), { search, numberOfRetriesLeft, waitingInterval });
}

export function minutesToMs(minutes: number) {
    return minutes * 60 * 1000;
}
