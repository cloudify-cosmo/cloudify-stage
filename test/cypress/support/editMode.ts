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
    enterEditMode: () => {
        const editModeLabel = 'Edit Mode';
        cy.get('.sidebar').then(sidebar => {
            if (!sidebar.find(`:contains("${editModeLabel}")`).length) {
                cy.clickSystemMenuItem('admin');
            }
            cy.clickSystemMenuItem(editModeLabel);
        });
    },
    exitEditMode: () => cy.get('.editModeSidebar').contains('Exit').click(),
    addWidgets: (...widgetIds: string[]) => {
        cy.contains('Add Widget').click();
        cy.waitUntilWidgetsDataLoaded(20);
        widgetIds.forEach(widgetId => cy.get(`[data-id=${widgetId}]`).click());
        cy.contains('Add selected widgets').click();
    },
    addPage: (pageName: string, widgetId?: string) => {
        cy.enterEditMode();

        cy.contains('Add Page').click();
        cy.contains('This page is empty');
        cy.get('.breadcrumb').within(() => {
            cy.get('.pageTitle').click();
            cy.get('.pageTitle.input input').clear().type(pageName);
        });
        cy.contains('Add Widgets').click();
        if (widgetId) cy.addWidgets(widgetId);

        return cy.exitEditMode();
    },
    editWidgetConfiguration: (widgetId: string, fnWithinEditWidgetModal: () => void, save = true) => {
        cy.enterEditMode();

        cy.get(`.${widgetId}Widget .widgetEditButtons .editWidgetIcon`).click({ force: true });
        cy.get('.editWidgetModal').within(() => {
            fnWithinEditWidgetModal();
            cy.get(`button${save ? '.ok' : '.cancel'}`).click();
        });

        return cy.exitEditMode();
    },
    setBooleanConfigurationField: (widgetId: string, fieldName: string, isSet: boolean) =>
        cy.editWidgetConfiguration(widgetId, () =>
            cy
                .getField(fieldName)
                .find('div.checkbox')
                .as('toggle')
                .then($div => {
                    if ((isSet && !$div.hasClass('checked')) || (!isSet && $div.hasClass('checked')))
                        cy.get('@toggle').click();
                })
        ),
    setNumericConfigurationField: (widgetId: string, fieldName: string, value: number) =>
        cy.editWidgetConfiguration(widgetId, () =>
            // NOTE: after clearing the input, 0 is automatically inserted. {home}{del} removes the leading 0
            cy.getField(fieldName).find('input').clear().type(`${value}{home}{del}`)
        ),
    setStringConfigurationField: (widgetId: string, fieldName: string, value: string) =>
        cy.editWidgetConfiguration(widgetId, () => cy.getField(fieldName).find('input').clear().type(value)),
    setSearchableDropdownConfigurationField: (widgetId: string, fieldName: string, value: string) =>
        cy.editWidgetConfiguration(widgetId, () => cy.setSearchableDropdownValue(fieldName, value)),
    setMultipleDropdownConfigurationField: (widgetId: string, fieldName: string, values: string[]) =>
        cy.editWidgetConfiguration(widgetId, () => cy.setMultipleDropdownValues(fieldName, values))
};

addCommands(commands);
