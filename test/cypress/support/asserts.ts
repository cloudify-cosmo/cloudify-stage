import path from 'path';
import { last } from 'lodash';
import mime from 'mime-types';
import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';

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
        cy.location('pathname').should('be.equal', `/console/page/${expectedPageId}`),
    verifyDownloadedFile: (fileName: string, mimeType: string) => {
        const downloadsFolder = Cypress.config('downloadsFolder');
        const downloadedFilePath = path.join(downloadsFolder, fileName);

        cy.readFile(downloadedFilePath).should('exist');
        expect(mime.lookup(downloadedFilePath)).to.be.equal(mimeType);
    }
};

addCommands(commands);
