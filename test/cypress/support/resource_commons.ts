import _ from 'lodash';

function appendQueryParam(url: string, param: string, value: string) {
    return `${url}${url.indexOf('?') > 0 ? '&' : '?'}${param}=${value}`;
}

type WaitUntilOptions = {
    search?: string;
    numberOfRetriesLeft?: number;
    waitingInterval?: number;
};
function waitUntil(
    resource: string,
    predicate: (response: Cypress.Response) => boolean,
    { search = '', numberOfRetriesLeft = 60, waitingInterval = 1000 }: WaitUntilOptions = {}
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
        waitUntil(resource, predicate, { search, numberOfRetriesLeft: numberOfRetriesLeft - 1, waitingInterval });
    });
}

export function waitUntilNotEmpty(resource: string, options?: WaitUntilOptions) {
    waitUntil(resource, response => !_.isEmpty(response.body.items), options);
}

export function waitUntilEmpty(resource: string, options?: WaitUntilOptions) {
    waitUntil(resource, response => _.isEmpty(response.body.items), options);
}

export function minutesToMs(minutes: number) {
    return secondsToMs(minutes * 60);
}

export function secondsToMs(seconds: number) {
    return seconds * 1000;
}
