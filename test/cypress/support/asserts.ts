import { last } from 'lodash';
import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    verifyLocation: (pathname: string, context: Record<string, any>, pageName: string) => {
        cy.location('pathname').should('be.equal', pathname);

        cy.location('search').then(queryString => {
            const urlSearchParams = new URLSearchParams(queryString).get('c') as string;
            expect(last(JSON.parse(urlSearchParams))).to.deep.equal({
                context,
                pageName
            });
        });
    },
    verifyLocationByPageId: (expectedPageId: string) =>
        cy.location('pathname').should('be.equal', `/console/page/${expectedPageId}`)
};

addCommands(commands);
