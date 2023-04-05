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
    typeLabelKey: (key: string) => cy.get('div[name=labelKey] > input').clear({ force: true }).type(key),
    typeLabelValue: (value: string) => cy.get('div[name=labelValue] > input').clear({ force: true }).type(value),
    fillLabelInputs: (key: string, value: string) => {
        cy.get('.selection').eq(0).click();
        cy.interceptSp('GET', { path: `/labels/deployments/${key}?_search=${value}` }).as('fetchLabel');

        cy.typeLabelKey(key);
        cy.typeLabelValue(value);
    },
    addLabel: (key: string, value: string) => {
        cy.fillLabelInputs(key, value);
        cy.get('[aria-label=Add]').click();

        cy.wait('@fetchLabel');
        cy.contains('a.label', `${key}: ${value}`).should('exist');
    }
};

addCommands(commands);
