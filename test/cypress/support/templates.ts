import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const builtInTemplates = ['main-default', 'main-sys_admin'] as const;

type BuiltInTemplate = typeof builtInTemplates[number];

type Page = {
    custom: boolean;
    id: string;
    name: string;
    updatedAt: string;
    updatedBy: string;
};
type Template = {
    custom: boolean;
    data: {
        roles: string[];
        tenants: string[];
    };
    id: string;
    name: string;
    updatedAt: string;
    updatedBy: string;
};

const commands = {
    getPages: () => cy.stageRequest('/console/templates/pages'),

    getTemplates: () => cy.stageRequest('/console/templates'),

    getBuiltInTemplateIds: () => cy.wrap(builtInTemplates),

    getBuiltInTemplate: (name: BuiltInTemplate) => cy.stageRequest(`/console/appData/templates/${name}.json`),

    removeUserPages: () =>
        cy.getPages().then(response => {
            const pages = response.body;
            pages.forEach((page: Page) => {
                if (page.custom) {
                    cy.stageRequest(`/console/templates/pages/${page.id}`, 'DELETE');
                }
            });
        }),

    removeUserTemplates: () =>
        cy.getTemplates().then(response => {
            const templates = response.body;
            templates.forEach((template: Template) => {
                if (template.custom) {
                    cy.stageRequest(`/console/templates/${template.id}`, 'DELETE');
                }
            });
        })
};

addCommands(commands);
