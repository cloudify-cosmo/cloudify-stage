import React from 'react';

import '../../initAppContext';
import { noop } from 'lodash';
import UserMenu from 'app/components/widgetsPage/sidebar/UserMenu';
import StageUtils from 'app/utils/stageUtils';
import Consts from 'app/utils/consts';
import Auth from 'app/utils/auth';
import { emptyState } from 'app/reducers/managerReducer';
import type { ManagerData } from 'app/reducers/managerReducer';
import { mountWithProvider } from '../../utils';

describe('UserMenu', () => {
    function getManagerData(overrides?: Partial<ManagerData>): ManagerData {
        return {
            ...emptyState,
            auth: { ...emptyState.auth, username: 'admin' },
            license: { data: null },
            tenants: { items: [] },
            ...overrides
        };
    }

    it('renders all options', () => {
        cy.stub(StageUtils, 'isUserAuthorized', () => true);

        mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData({ license: { data: null, isRequired: true } }),
            config: { mode: Consts.MODE_MAIN }
        });

        cy.contains('Edit Mode').should('be.visible');
        cy.contains('Template Management').should('be.visible');
        cy.contains('Reset Templates').should('be.visible');
        cy.contains('License Management').should('be.visible');
        cy.contains('Change Password').should('be.visible');
        cy.contains('Logout').should('be.visible');
    });

    it('renders limited set of options', () => {
        mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData(),
            config: { mode: Consts.MODE_CUSTOMER }
        });

        cy.contains('Edit Mode').should('not.exist');
        cy.contains('Template Management').should('not.exist');
        cy.contains('Reset Templates').should('be.visible');
        cy.contains('License Management').should('not.exist');
        cy.contains('Change Password').should('be.visible');
        cy.contains('Logout').should('be.visible');
    });

    it('handles edit mode', () => {
        cy.stub(StageUtils, 'isUserAuthorized', () => true);

        const { store } = mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData(),
            config: { mode: Consts.MODE_MAIN }
        });

        cy.contains('Edit Mode').click();
        cy.wrap(store).invoke('getState').its('config.isEditMode').should('be.true');
    });

    it('handles template management', () => {
        cy.stub(StageUtils, 'isUserAuthorized', () => true);

        const { history } = mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData(),
            config: { mode: Consts.MODE_MAIN }
        });

        const push = cy.stub(history, 'push');

        cy.contains('Template Management')
            .click()
            .then(() => expect(push).to.be.calledWithExactly('/template_management'));
    });

    it('handles template reset', () => {
        mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData(),
            config: { mode: Consts.MODE_CUSTOMER }
        });

        cy.contains('Reset Templates').click();
        cy.get('.modal').should('be.visible');
    });

    it('handles license management', () => {
        cy.stub(StageUtils, 'isUserAuthorized', () => true);

        const { history } = mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData({ license: { data: null, isRequired: true } }),
            config: { mode: Consts.MODE_MAIN }
        });

        const push = cy.stub(history, 'push');

        cy.contains('License Management')
            .click()
            .then(() => expect(push).to.be.calledWithExactly('/license'));
    });

    it('handles password change', () => {
        mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData(),
            config: { mode: Consts.MODE_CUSTOMER }
        });

        cy.contains('Change Password').click();
        cy.get('.modal').should('be.visible');
    });

    it('handles logout', () => {
        const logout = cy.stub(Auth, 'logout');

        mountWithProvider(<UserMenu onModalOpen={noop} expanded onGroupClick={noop} />, {
            manager: getManagerData(),
            config: { mode: Consts.MODE_CUSTOMER }
        });

        cy.contains('Logout')
            .click()
            .then(() => expect(logout).to.be.called);
    });
});
