import _ from 'lodash';
// TODO: check the following line
// import UrlUtils from 'app/utils/shared/UrlUtils';
import type { GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { addCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

// TODO: check here:
function appendQueryParam(url: string, param: string, value: string) {
    const prefix = url.includes('?') ? '&' : '?';
    return `${url}${prefix}${param}=${encodeURIComponent(value)}`;
}

export type WaitUntilOptions = {
    search?: string;
    numberOfRetriesLeft?: number;
    waitingInterval?: number;
    useAdminAuthorization?: boolean;
};

export function minutesToMs(minutes: number) {
    return secondsToMs(minutes * 60);
}

export function secondsToMs(seconds: number) {
    return seconds * 1000;
}

const commands = {
    waitUntil: (
        resource: string,
        predicate: (response: Cypress.Response<any>) => boolean,
        {
            search = '',
            numberOfRetriesLeft = 60,
            waitingInterval = 1000,
            useAdminAuthorization = false
        }: WaitUntilOptions = {}
    ) => {
        if (numberOfRetriesLeft <= 0) {
            throw new Error(`Number of retries exceeded for resource=${resource}, search=${search}.`);
        }

        let url = `/${resource}`;
        if (search) {
            //TODO: check the following lines:
            url = appendQueryParam(url, `_search`, search);
            // url = UrlUtils.appendQueryParam(url, { _search: search });
        }
        cy.cfyRequest(url, 'GET', null, null, { useAdminAuthorization }).then(response => {
            if (predicate(response)) {
                return;
            }
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(waitingInterval);
            cy.waitUntil(resource, predicate, {
                search,
                numberOfRetriesLeft: numberOfRetriesLeft - 1,
                waitingInterval
            });
        });
    },
    waitUntilNotEmpty: (resource: string, options?: WaitUntilOptions) => {
        cy.waitUntil(resource, response => !_.isEmpty(response.body.items), options);
    },
    waitUntilEmpty: (resource: string, options?: WaitUntilOptions) => {
        cy.waitUntil(resource, response => _.isEmpty(response.body.items), options);
    }
};

addCommands(commands);
