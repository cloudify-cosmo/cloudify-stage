import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const builtInTemplates = ['main-default', 'main-sys_admin'] as const;

type BuiltInTemplate = typeof builtInTemplates[number];

type TemplateResource = {
    custom: boolean;
    id: string;
};

const commands = {
    getPages: () => cy.stageRequest('/console/templates/pages'),

    getPageGroups: () => cy.stageRequest('/console/templates/page-groups'),

    getTemplates: () => cy.stageRequest('/console/templates'),

    getBuiltInTemplateIds: () => cy.wrap(builtInTemplates),

    getBuiltInTemplate: (name: BuiltInTemplate) => cy.stageRequest(`/console/appData/templates/${name}.json`),

    removeUserPages: () =>
        cy.getPages().then(response => {
            const pages = response.body;
            pages.forEach((page: TemplateResource) => {
                if (page.custom) {
                    cy.stageRequest(`/console/templates/pages/${page.id}`, 'DELETE');
                }
            });
        }),

    removeUserTemplates: () =>
        cy.getTemplates().then(response => {
            const templates = response.body;
            templates.forEach((template: TemplateResource) => {
                if (template.custom) {
                    cy.stageRequest(`/console/templates/${template.id}`, 'DELETE');
                }
            });
        }),

    removeUserPageGroups: () =>
        cy.getPageGroups().then(response => {
            const pageGroups = response.body;
            pageGroups.forEach((pageGroup: TemplateResource) => {
                if (pageGroup.custom) {
                    cy.stageRequest(`/console/templates/page-groups/${pageGroup.id}`, 'DELETE');
                }
            });
        }),

    goToTemplateManagement: () =>
        cy
            .usePageMock([], {}, { stubTemplatesResponse: false })
            .mockLoginWithoutWaiting({ visitPage: '/console/template_management' })
            .waitUntilAppLoaded()
};

addCommands(commands);
