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
            .and('have.attr', 'href', `${Consts.CONTEXT_PATH}/page/topLevelPage`);

        cy.contains('Group 1').should('be.visible');
        cy.contains('Subpage 1').should('not.exist');
        cy.contains('Subpage 2').should('not.exist');
        cy.contains('Group 2').should('be.visible');
        cy.contains('Subpage 3').should('not.exist');
        cy.contains('Subpage 4').should('not.exist');

        cy.contains('Group 1').click();
        cy.contains('Subpage 1').should('be.visible').and('have.attr', 'href', `/console/page/subPage1`);
        cy.contains('Subpage 2').should('be.visible').and('have.attr', 'href', `/console/page/subPage2`);

        cy.contains('Group 2').click();
        cy.contains('Subpage 1').should('be.visible').and('have.attr', 'href', `/console/page/subPage1`);
        cy.contains('Subpage 2').should('be.visible').and('have.attr', 'href', `/console/page/subPage2`);
        cy.contains('Subpage 3').should('be.visible').and('have.attr', 'href', `/console/page/subPage3`);
        cy.contains('Subpage 4').should('be.visible').and('have.attr', 'href', `/console/page/subPage4`);

        cy.contains('Group 1').click();
        cy.contains('Subpage 1').should('not.exist');
        cy.contains('Subpage 2').should('not.exist');

        cy.contains('Top Level Page').click();
        cy.location('pathname').should('be.equal', '/page/topLevelPage');
    });

    it('handles edit mode', () => {
        cy.fixture('pages/pages_with_groups').then(pages => {
            mountWithProvider(<PagesList isEditMode pageId={pages[0].id} />, { pages });

            cy.contains('Add Page').should('be.visible');
            cy.get('.icon.edit').should('have.length', pages.length);
            cy.get('.icon.remove').should('have.length', pages.length);
        });
    });
});
