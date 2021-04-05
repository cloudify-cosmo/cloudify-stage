import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const uploadPluginTimeout = 2 * 60 * 1000;

const commands = {
    installPlugin: (wagonUrl: string, yamlUrl: string) =>
        cy.stageRequest(`/console/plugins/upload?visibility=tenant&wagonUrl=${wagonUrl}&yamlUrl=${yamlUrl}`, 'POST', {
            failOnStatusCode: false,
            timeout: uploadPluginTimeout
        }),
    uploadPluginFromCatalog: (pluginName: string) => {
        // eslint-disable-next-line security/detect-non-literal-regexp
        cy.intercept('POST', new RegExp(`console/plugins/upload.*title=${pluginName}`)).as('pluginUpload');

        cy.log(`Upload ${pluginName} plugin`);
        cy.visitPage('Plugins Catalog');
        cy.get('.pluginsCatalogWidget').within(() => {
            cy.contains('tr', pluginName).find('button').click();
        });
        cy.get('.modal').within(() => {
            cy.get('button.ok').click();
        });
        cy.wait('@pluginUpload', { responseTimeout: uploadPluginTimeout });
        cy.get('.modal').should('not.exist');
        cy.get('.pluginsCatalogWidget .message').should('have.text', `${pluginName} successfully uploaded`);
        cy.visitPage('Test Page');
    },
    deletePlugins: () => {
        cy.cfyRequest('/plugins').then(response =>
            response.body.items.forEach(({ id }: { id: string }) =>
                cy.cfyRequest(`/plugins/${id}`, 'DELETE', null, { force: true })
            )
        );
    }
};

addCommands(commands);
