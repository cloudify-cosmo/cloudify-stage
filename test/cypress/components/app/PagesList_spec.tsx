import React from 'react';

import '../initAppContext';
import PagesList from 'app/components/sidebar/PagesList';
import Consts from 'app/utils/consts';
import { mountWithProvider } from '../utils';

describe('PagesList', () => {
    it('handles default mode', () => {
        cy.fixture('pages/pages_with_groups').then(pages =>
            mountWithProvider(<PagesList pageId={pages[0].id} />, { pages })
        );

        cy.contains('Top Level Page')
            .should('be.visible')
            .and('have.attr', 'href', `${Consts.CONTEXT_PATH}/page/topLevelPage`)
            .find('.rocket');

        cy.contains('Group 1').should('be.visible').find('.group');
        cy.contains('Subpage 1').should('not.exist');
        cy.contains('Subpage 2').should('not.exist');
        cy.contains('Group 2').should('be.visible').find('i').should('have.length', 1);
        cy.contains('Subpage 3').should('not.exist');
        cy.contains('Subpage 4').should('not.exist');

        cy.contains('Group 1').click();
        cy.contains('Subpage 1').should('be.visible').and('have.attr', 'href', `/console/page/subPage1`).find('.user');
        cy.contains('Subpage 2')
            .should('be.visible')
            .and('have.attr', 'href', `/console/page/subPage2`)
            .find('i')
            .should('not.exist');

        cy.contains('Group 2').click();
        cy.contains('Subpage 1').should('be.visible').and('have.attr', 'href', `/console/page/subPage1`).find('.user');
        cy.contains('Subpage 2')
            .should('be.visible')
            .and('have.attr', 'href', `/console/page/subPage2`)
            .find('i')
            .should('not.exist');
        cy.contains('Subpage 3')
            .should('be.visible')
            .and('have.attr', 'href', `/console/page/subPage3`)
            .find('i')
            .should('not.exist');
        cy.contains('Subpage 4')
            .should('be.visible')
            .and('have.attr', 'href', `/console/page/subPage4`)
            .find('i')
            .should('not.exist');

        cy.contains('Group 1').click();
        cy.contains('Subpage 1').should('not.exist');
        cy.contains('Subpage 2').should('not.exist');

        cy.contains('Top Level Page').click();
        cy.location('pathname').should('be.equal', '/page/topLevelPage');
    });

    it('handles edit mode', () => {
        cy.fixture('pages/pages_with_groups').then(pages => {
            mountWithProvider(
                <div style={{ marginLeft: 30 }}>
                    <PagesList isEditMode pageId={pages[0].id} />
                </div>,
                { pages }
            );

            cy.contains('Add Page').should('be.visible');
            cy.get('.icon.edit').should('have.length', pages.length);
            cy.get('.icon.remove').should('have.length', pages.length);

            cy.contains('Add Page Group').click();
            cy.contains('.item', 'Page_Group_0').find('.edit').click({ force: true });
            cy.get('input').type('2{enter}');
            cy.contains('.item', 'Page_Group_0').find('.expand').click();
            cy.get('.popup').within(() => {
                cy.get('input').type('blind{enter}');
                cy.contains('Save').click();
            });
            cy.contains('.item', 'Page_Group_02').within(() => {
                cy.get('.blind').should('be.visible');
                cy.get('.remove').click({ force: true });
            });
            cy.contains('Page_Group_02').should('not.exist');

            cy.contains('Group 1').click();
            cy.contains('.item', 'Subpage 1').find('.edit').click({ force: true });
            cy.get('input').type('2{enter}');
            cy.contains('.item', 'Subpage 1').find('.user').click();
            cy.get('.popup').within(() => {
                cy.get('input').type('blind{enter}');
                cy.contains('Save').click();
            });
            cy.contains('.item', 'Subpage 12').within(() => {
                cy.get('.blind').should('be.visible');
                cy.get('.remove').click({ force: true });
            });
            cy.contains('Subpage 12').should('not.exist');
        });
    });
});
