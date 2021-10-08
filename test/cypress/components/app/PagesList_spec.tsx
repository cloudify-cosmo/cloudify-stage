import React from 'react';
import { mount } from '@cypress/react';
import { noop } from 'lodash';

import '../initAppContext';
import PagesList from 'app/components/PagesList';

describe('PagesList', () => {
    it('handles page groups', () => {
        mount(
            <PagesList
                onPageSelected={noop}
                onItemRemoved={noop}
                onPageReorder={noop}
                isEditMode={false}
                pages={[
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
                ]}
            />
        );

        cy.contains('Top Level Page').should('be.visible');
        cy.contains('Group 1').should('be.visible');
        cy.contains('Subpage 1').should('not.exist');
        cy.contains('Subpage 2').should('not.exist');
        cy.contains('Group 2').should('be.visible');
        cy.contains('Subpage 3').should('not.exist');
        cy.contains('Subpage 4').should('not.exist');

        cy.contains('Group 1').click();
        cy.contains('Subpage 1').should('be.visible');
        cy.contains('Subpage 2').should('be.visible');

        cy.contains('Group 2').click();
        cy.contains('Subpage 1').should('be.visible');
        cy.contains('Subpage 2').should('be.visible');
        cy.contains('Subpage 3').should('be.visible');
        cy.contains('Subpage 4').should('be.visible');

        cy.contains('Group 1').click();
        cy.contains('Subpage 1').should('not.exist');
        cy.contains('Subpage 2').should('not.exist');
    });
});
