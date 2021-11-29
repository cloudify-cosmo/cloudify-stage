import React from 'react';

import '../../initAppContext';
import Consts from 'app/utils/consts';
import SideBar from 'app/components/sidebar/SideBar';
import { ThemeContext } from 'styled-components';
import { mountWithProvider } from '../../utils';

describe('SideBar', () => {
    it('automatically collapses item groups', () => {
        const username = 'test_user';

        cy.fixture('pages/pages_with_groups').then(pages => {
            mountWithProvider(
                <ThemeContext.Provider value="">
                    <SideBar pageId={''} />
                </ThemeContext.Provider>,
                {
                    pages,
                    manager: { username, tenants: { items: [] }, version: {}, license: {} },
                    config: { mode: Consts.MODE_CUSTOMER }
                }
            );
        });

        cy.clickPageMenuItem('Group 1');
        cy.contains('Subpage 1').should('be.visible');
        cy.contains('Subpage 2').should('be.visible');

        cy.clickPageMenuItem('Group 2');
        cy.contains('Subpage 1').should('not.exist');
        cy.contains('Subpage 2').should('not.exist');
        cy.contains('Subpage 3').should('be.visible');
        cy.contains('Subpage 4').should('be.visible');

        cy.clickSystemMenuItem('Help');
        cy.contains('Subpage 3').should('not.exist');
        cy.contains('Subpage 4').should('not.exist');
        cy.contains('Documentation').should('be.visible');
        cy.contains('Contact Us').should('be.visible');
        cy.contains('About').should('be.visible');

        cy.clickSystemMenuItem(username);
        cy.contains('Documentation').should('not.exist');
        cy.contains('Contact Us').should('not.exist');
        cy.contains('About').should('not.exist');
        cy.contains('Reset Templates').should('be.visible');
        cy.contains('Change Password').should('be.visible');
        cy.contains('Logout').should('be.visible');

        cy.clickPageMenuItem('Group 1');
        cy.contains('Reset Templates').should('not.exist');
        cy.contains('Change Password').should('not.exist');
        cy.contains('Logout').should('not.exist');
        cy.contains('Subpage 1').should('be.visible');
        cy.contains('Subpage 2').should('be.visible');
    });
});
