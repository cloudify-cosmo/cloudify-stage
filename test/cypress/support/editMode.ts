import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    enterEditMode: () => {
        cy.get('.usersMenu').click().contains('Edit Mode').click();
    },
    exitEditMode: () => {
        cy.get('.editModeSidebar').contains('Exit').click();
    },
    addWidget: (widgetId: string) => {
        cy.enterEditMode();

        cy.contains('Add Widget').click();
        cy.get(`*[data-id=${widgetId}]`).click();
        cy.contains('Add selected widgets').click();

        cy.exitEditMode();
    },
    addPage: (pageName: string) => {
        cy.enterEditMode();

        cy.contains('Add Page').click();
        cy.get('.breadcrumb').within(() => {
            cy.get('.pageTitle').click();
            cy.get('.pageTitle.input input').clear().type(pageName);
        });
        cy.contains('Add Widgets').click();

        cy.exitEditMode();
    },
    editWidgetConfiguration: (widgetId: string, fnWithinEditWidgetModal: () => void, save = true) => {
        cy.enterEditMode();

        cy.get(`.${widgetId}Widget .widgetEditButtons .editWidgetIcon`).click({ force: true });
        cy.get('.editWidgetModal').within(() => {
            fnWithinEditWidgetModal();
            cy.get(`button${save ? '.ok' : '.cancel'}`).click();
        });

        cy.exitEditMode();
    },
    setBooleanConfigurationField: (widgetId: string, fieldName: string, isSet: boolean) =>
        cy.editWidgetConfiguration(widgetId, () => {
            cy.contains('.field', fieldName)
                .find('div.checkbox')
                .as('toggle')
                .then($div => {
                    if ((isSet && !$div.hasClass('checked')) || (!isSet && $div.hasClass('checked')))
                        cy.get('@toggle').click();
                });
        }),
    setStringConfigurationField: (widgetId: string, fieldName: string, value: string) =>
        cy.editWidgetConfiguration(widgetId, () => {
            cy.contains('.field', fieldName).find('input').clear().type(value);
        }),
    setSearchableDropdownConfigurationField: (widgetId: string, fieldName: string, value: string) =>
        cy.editWidgetConfiguration(widgetId, () => {
            cy.setSearchableDropdownValue(fieldName, value);
        })
};

addCommands(commands);
