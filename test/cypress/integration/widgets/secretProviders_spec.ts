describe('Tokens widget', () => {
    const widgetId = 'secretProviders';
    const widgetConfiguration = {
        pollingTime: 3,
        pageSize: 0 // NOTE: Setting page size to 0 to list all secret providers and be able to find the one created in test
    };

    const secretProviders = [
        {
            created_at: '2022-12-01T12:12:57.007Z',
            id: 'test',
            visibility: 'tenant',
            name: 'Secret Provider 1',
            type: 'test',
            connection_parameters: null,
            updated_at: null,
            tenant_name: 'default_tenant',
            created_by: 'admin',
            resource_availability: 'tenant',
            private_resource: false
        },
        {
            created_at: '2022-12-01T12:12:57.007Z',
            id: 'test_2',
            visibility: 'tenant',
            name: 'Secret Provider 2',
            type: 'test',
            connection_parameters: null,
            updated_at: null,
            tenant_name: 'default_tenant',
            created_by: 'admin',
            resource_availability: 'tenant',
            private_resource: false
        }
    ];

    before(() => {
        cy.activate('valid_trial_license').usePageMock(widgetId, widgetConfiguration).mockLogin();
        cy.interceptSp('GET', '/secrets-providers*', {
            items: secretProviders,
            metadata: {
                pagination: {
                    total: 1,
                    size: 1,
                    offset: 0
                }
            }
        });
    });

    it('should allow to create secret provider', () => {
        cy.contains('Secret Provider 1').should('be.visible');
        cy.contains('Secret Provider 2').should('be.visible');
    });
});
