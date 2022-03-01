import React from 'react';

import '../../initAppContext';
import TenantSelection from 'app/components/sidebar/TenantSelection';
import { mountWithProvider } from '../../utils';

const mockTenantsResponse = (tenants: any[], withDelay = false) => {
    const defaultDelay = 250;

    cy.intercept(
        {
            pathname: '/console/sp/tenants',
            query: { _include: 'name', _get_all_results: 'true' }
        },
        {
            body: {
                items: tenants
            },
            delay: withDelay ? defaultDelay : 0
        }
    );
};

describe('TenantSelection', () => {
    it('renders loader when fetching tenants', () => {
        mountWithProvider(<TenantSelection />, { manager: { tenants: { items: [] } } });
        mockTenantsResponse([], true);

        cy.contains('No Tenants').click();
        cy.get('div.loader').should('be.visible');
    });

    it('renders empty tenants list', () => {
        mountWithProvider(<TenantSelection />, { manager: { tenants: { items: [] } } });

        cy.get('div.loader').should('not.exist');
        cy.get('div.dropdown').should('have.length', 1);
        cy.contains('div.dropdown', 'No Tenants').should('be.visible');
        cy.get('div.dropdown .menu .item').should('not.exist');
    });

    it('renders tenants list with no tenant selected', () => {
        mountWithProvider(<TenantSelection />, {
            manager: { tenants: { items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }] } }
        });

        cy.get('div.loader').should('not.exist');
        cy.get('div.dropdown').should('have.length', 1);
        cy.contains('div.dropdown', 'aaa').should('be.visible');
        cy.get('div.dropdown .menu .item').should('have.length', 3);
        cy.contains('div.dropdown .menu .item.selected', 'aaa');
    });

    it('renders tenants list with selected tenant', () => {
        mountWithProvider(<TenantSelection />, {
            manager: { tenants: { selected: 'bbb', items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }] } }
        });

        cy.get('div.loader').should('not.exist');
        cy.get('div.dropdown').should('have.length', 1);
        cy.contains('div.dropdown', 'bbb').should('be.visible');
        cy.get('div.dropdown .menu .item').should('have.length', 3);
        cy.contains('div.dropdown .menu .item.selected', 'bbb');
    });

    it('renders tenants list when selected tenant is not on the list', () => {
        mountWithProvider(<TenantSelection />, {
            manager: { tenants: { selected: 'abc', items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }] } }
        });

        cy.get('div.loader').should('not.exist');
        cy.get('div.dropdown').should('have.length', 1);
        cy.contains('div.dropdown', 'abc').should('be.visible');
        cy.get('div.dropdown .menu .item').should('have.length', 3);
        cy.get('div.dropdown .menu .item.selected').should('not.exist');
    });

    it('changes active tenant on dropdown item click', () => {
        const { store } = mountWithProvider(<TenantSelection />, {
            manager: { tenants: { selected: 'abc', items: [] } }
        });

        mockTenantsResponse([{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }]);

        cy.contains('abc').click();
        cy.contains('aaa').click();
        cy.wrap(store).invoke('getState').its('manager.tenants.selected').should('be.equal', 'aaa');
    });
});
