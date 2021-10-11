import React from 'react';

import '../initAppContext';
import PagesList from 'app/components/sidebar/PagesList';
import Consts from 'app/utils/consts';
import { mountWithProvider } from '../utils';

const pages = [
    {
        type: 'page',
        id: 'topLevelPage',
        name: 'Top Level Page',
        description: '',
        isDrillDown: false,
        layout: []
    },
    {
        type: 'pageGroup',
        id: 'g1',
        name: 'Group 1',
        pages: [
            {
                type: 'page',
                id: 'subPage1',
                name: 'Subpage 1',
                description: '',
                isDrillDown: false,
                layout: []
            },
            {
                type: 'page',
                id: 'subPage2',
                name: 'Subpage 2',
                description: '',
                isDrillDown: false,
                layout: []
            }
        ]
    },
    {
        type: 'pageGroup',
        id: 'g2',
        name: 'Group 2',
        pages: [
            {
                type: 'page',
                id: 'subPage3',
                name: 'Subpage 3',
                description: '',
                isDrillDown: false,
                layout: []
            },
            {
                type: 'page',
                id: 'subPage4',
                name: 'Subpage 4',
                description: '',
                isDrillDown: false,
                layout: []
            }
        ]
    }
];

describe('PagesList', () => {
    it('handles default mode', () => {
        mountWithProvider(<PagesList isEditMode={false} pages={pages} />, { pages });

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
        mountWithProvider(<PagesList isEditMode pages={pages} />, { pages });

        cy.contains('Add Page').should('be.visible');
        cy.get('.icon.edit').should('have.length', pages.length);
        cy.get('.icon.remove').should('have.length', pages.length);
    });
});
