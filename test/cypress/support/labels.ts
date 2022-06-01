import type { LabelInputType } from '../../../widgets/common/src/labels/types';

const getDropdownSelect = () => cy.get('.selection').eq(0);

export function typeLabelKey(key: string) {
    cy.get('div[name=labelKey] > input').clear().type(key);
}
export function typeLabelValue(value: string) {
    cy.get('div[name=labelValue] > input').clear().type(value);
}
export function addLabel(key: string, value: string) {
    getDropdownSelect().click();
    cy.interceptSp('GET', { path: `/labels/deployments/${key}?_search=${value}` }).as('fetchLabel');

    typeLabelKey(key);
    typeLabelValue(value);
    cy.get('.add').click();

    cy.wait('@fetchLabel');
    cy.contains('a.label', `${key} ${value}`).should('exist');
}
export function typeLabelInput(inputType: LabelInputType, text: string) {
    if (inputType === 'key') {
        typeLabelKey(text);
    } else {
        typeLabelKey('a');
        typeLabelValue(text);
    }
}
