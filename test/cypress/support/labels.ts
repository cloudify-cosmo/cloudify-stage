import type { GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { addCommands } from 'cloudify-ui-common/cypress/support';
import type { LabelInputType } from '../../../widgets/common/src/labels/types';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    typeLabelKey: (key: string) => cy.get('div[name=labelKey] > input').clear().type(key),
    typeLabelValue: (value: string) => cy.get('div[name=labelValue] > input').clear().type(value),
    addLabel: (key: string, value: string) => {
        cy.get('.selection').eq(0).click();
        cy.interceptSp('GET', { path: `/labels/deployments/${key}?_search=${value}` }).as('fetchLabel');

        cy.typeLabelKey(key);
        cy.typeLabelValue(value);
        cy.get('.add').click();

        cy.wait('@fetchLabel');
        cy.contains('a.label', `${key} ${value}`).should('exist');
    },
    typeLabelInput: (inputType: LabelInputType, text: string) => {
        if (inputType === 'key') {
            cy.typeLabelKey(text);
        } else {
            cy.typeLabelKey('a');
            cy.typeLabelValue(text);
        }
    }
};

addCommands(commands);
