describe('Tokens widget', () => {
    const widgetId = 'tokens';
    const widgetSelector = `.${widgetId}Widget`;
    const widgetConfiguration = {
        pollingTime: 3
    };

    const mockUserRole = (role: string) => {
        cy.intercept('GET', '/console/auth/user', {
            username: 'admin',
            role,
            groupSystemRoles: {},
            tenantsRoles: {
                default_tenant: {
                    'tenant-role': 'user',
                    roles: ['user']
                }
            }
        });
    };

    before(() => cy.activate('valid_trial_license').usePageMock(widgetId, widgetConfiguration).mockLogin());

    it('should allow to create and remove token', () => {
        const tokenDescription = 'tokens-widget-test';
        const createTokenRequest = 'createToken';
        const deleteTokenRequest = 'deleteToken';
        cy.interceptSp('POST', '/tokens').as(createTokenRequest);
        cy.interceptSp('DELETE', '/tokens/*').as(deleteTokenRequest);

        cy.get(widgetSelector).within(() => {
            cy.clickButton('Create');
        });

        cy.contains('Create token')
            .parent()
            .within(() => {
                cy.get('input[name="description"]').type(tokenDescription);
                cy.clickButton('Create');
                cy.clickButton('Close');
            });

        cy.wait(`@${createTokenRequest}`);

        cy.contains(tokenDescription)
            .parent()
            .closest('tr')
            .within(() => {
                cy.get('[title="Delete token"]').click();
            });

        cy.contains('Are you sure you want to delete')
            .parent()
            .within(() => {
                cy.clickButton('Yes');
                cy.wait(`@${deleteTokenRequest}`);
            });
    });

    it('should reveal and hide token value after its creation', () => {
        const tokenAsterixMask = '*'.repeat(8);

        cy.get(widgetSelector).within(() => {
            cy.clickButton('Create');
        });

        cy.contains('Create token')
            .parent()
            .within(() => {
                cy.clickButton('Create');
                cy.get('.message.success').within(() => {
                    cy.contains(tokenAsterixMask).should('be.visible');

                    cy.get('.eye.icon').parent().click();
                    cy.contains(tokenAsterixMask).should('not.exist');

                    cy.get('.eye.icon').parent().click();
                    cy.contains(tokenAsterixMask).should('be.visible');
                });
            });
    });

    it('should hide Username column when the user role is different than "sys_admin"', () => {
        mockUserRole('manager');
        cy.mockLogin();
        cy.contains('Username').should('not.exist');
    });

    it('should not show expired tokens by default', () => {
        const expiredToken = {
            id: 'Yaf4oOgF5j',
            username: 'admin',
            value: 'ctok-Yaf4oOgF5j-********',
            role: 'sys_admin',
            expiration_date: '2022-02-10T16:15:00.000Z',
            last_used: '2022-02-10T11:27:04.544Z',
            description: 'Mocked token'
        };
        cy.interceptSp('GET', '/tokens*', {
            items: [expiredToken]
        });

        cy.contains(expiredToken.value).should('not.exist');

        cy.editWidgetConfiguration(widgetId, () => {
            cy.get('input[name=showExpiredTokens]').parent().click();
        });

        cy.contains(expiredToken.value).should('exist');
    });
});
