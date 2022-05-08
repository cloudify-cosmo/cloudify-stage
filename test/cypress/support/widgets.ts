import type { GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { addCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    getWidgets: () => cy.stageRequest('/console/widgets/list'),

    removeCustomWidgets: () =>
        cy.getWidgets().then(response => {
            response.body.forEach((widget: Stage.Types.WidgetDefinition) => {
                if (widget.isCustom) {
                    cy.stageRequest(`/console/widgets/${widget.id}`, 'DELETE');
                }
            });
        }),

    interceptWidgetScript: (widgetId: string, scriptSource: string) =>
        cy.intercept(`/console/appData/widgets/${widgetId}/widget.js`, {
            body: scriptSource,
            headers: { 'Content-Type': 'application/javascript' }
        })
};

addCommands(commands);
