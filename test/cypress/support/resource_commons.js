import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function waitUntilEmpty(resource, search, maxNumberOfRetries = 10) {
    cy.cfyRequest(`/${resource}?_search=${search}`, 'GET').then(response => {
        if (_.isEmpty(response.body.items)) {
            return;
        }
        waitUntilEmpty(resource, search, maxNumberOfRetries - 1);
    });
}
