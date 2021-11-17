import React from 'react';

import '../../initAppContext';
import Help from 'app/components/sidebar/Help';
import { ThemeContext } from 'styled-components';
import StageUtils from 'app/utils/stageUtils';
import { mountWithProvider } from '../../utils';

describe('Help', () => {
    it('opens "About" modal', () => {
        mountWithProvider(
            <ThemeContext.Provider value="">
                <Help />
            </ThemeContext.Provider>
        );

        cy.contains('Help').click();
        cy.contains('About').click();
        cy.get('.modal').should('be.visible');
    });

    it('calls redirectToPage on "Documentation" link click for released version', () => {
        const redirectToPage = cy.stub(StageUtils.Url, 'redirectToPage');

        mountWithProvider(
            <ThemeContext.Provider value="">
                <Help />
            </ThemeContext.Provider>,
            { manager: { version: { version: '5.0.5' } } }
        );

        cy.contains('Help').click();
        cy.contains('Documentation')
            .click()
            .then(() => expect(redirectToPage).to.be.calledWithExactly('https://docs.cloudify.co/5.0.5'));
    });

    it('calls redirectToPage on "Documentation" link click for development version', () => {
        const redirectToPage = cy.stub(StageUtils.Url, 'redirectToPage');

        mountWithProvider(
            <ThemeContext.Provider value="">
                <Help />
            </ThemeContext.Provider>,
            { manager: { version: { version: '6.3-dev' } } }
        );

        cy.contains('Help').click();
        cy.contains('Documentation')
            .click()
            .then(() => expect(redirectToPage).to.be.calledWithExactly('https://docs.cloudify.co/latest'));
    });
    it('calls redirectToPage on "Contact Us" link click', () => {
        const redirectToPage = cy.stub(StageUtils.Url, 'redirectToPage');

        mountWithProvider(
            <ThemeContext.Provider value="">
                <Help />
            </ThemeContext.Provider>
        );

        cy.contains('Help').click();
        cy.contains('Contact Us')
            .click()
            .then(() => expect(redirectToPage).to.be.calledWithExactly('https://cloudify.co/contact'));
    });
});
