import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

export interface Site {
    name: string;
    location?: string;
    visibility?: string;
}

const commands = {
    createSite: (site: Site) => {
        const data: Site = { name: site.name };
        if (site.location) {
            data.location = site.location;
        }
        if (site.visibility) {
            data.visibility = site.visibility;
        }

        return cy.cfyRequest(`/sites/${site.name}`, 'PUT', null, data);
    },

    createSites: (sites: Site[]) => sites.forEach(cy.createSite),

    deleteSite: (siteName: string, { ignoreFailure = false }: { ignoreFailure?: boolean } = {}) =>
        cy.cfyRequest(`/sites/${siteName}`, 'DELETE', null, null, { failOnStatusCode: !ignoreFailure }),

    deleteSites: (search = '') =>
        cy.cfyRequest(`/sites?_search=${search}`, 'GET').then(response => {
            const sites = response.body.items;
            sites.forEach((site: any) => cy.deleteSite(site.name));
        })
};

addCommands(commands);
