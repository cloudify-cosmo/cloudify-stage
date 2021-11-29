import React from 'react';

import '../../initAppContext';
import HelpMenu from 'app/components/sidebar/HelpMenu';
import { ThemeContext } from 'styled-components';
import StageUtils from 'app/utils/stageUtils';
import { noop } from 'lodash';
import { mountWithProvider } from '../../utils';

describe('Help', () => {
    it('opens "About" modal', () => {
        mountWithProvider(
            <ThemeContext.Provider value="">
                <HelpMenu onModalOpen={noop} expanded onGroupClick={noop} />
            </ThemeContext.Provider>
        );

        cy.contains('About').click();
        cy.get('.modal').should('be.visible');
    });

    it('calls redirectToPage on "Documentation" link click for released version', () => {
        const redirectToPage = cy.stub(StageUtils.Url, 'redirectToPage');

        mountWithProvider(
            <ThemeContext.Provider value="">
                <HelpMenu onModalOpen={noop} expanded onGroupClick={noop} />
            </ThemeContext.Provider>,
            { manager: { license: {}, version: { version: '5.0.5' } } }
        );

        cy.contains('Documentation')
            .click()
            .then(() => expect(redirectToPage).to.be.calledWithExactly('https://docs.cloudify.co/5.0.5'));
    });

    it('calls redirectToPage on "Documentation" link click for development version', () => {
        const redirectToPage = cy.stub(StageUtils.Url, 'redirectToPage');

        mountWithProvider(
            <ThemeContext.Provider value="">
                <HelpMenu onModalOpen={noop} expanded onGroupClick={noop} />
            </ThemeContext.Provider>,
            { manager: { license: {}, version: { version: '6.3-dev' } } }
        );

        cy.contains('Documentation')
            .click()
            .then(() => expect(redirectToPage).to.be.calledWithExactly('https://docs.cloudify.co/latest'));
    });

    it('calls redirectToPage on "Contact Us" link click', () => {
        const redirectToPage = cy.stub(StageUtils.Url, 'redirectToPage');

        mountWithProvider(
            <ThemeContext.Provider value="">
                <HelpMenu onModalOpen={noop} expanded onGroupClick={noop} />
            </ThemeContext.Provider>
        );

        cy.contains('Contact Us')
            .click()
            .then(() => expect(redirectToPage).to.be.calledWithExactly('https://cloudify.co/contact'));
    });
});
