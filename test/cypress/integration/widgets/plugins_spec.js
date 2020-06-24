describe('Plugins widget', () => {
    before(() =>
        cy
            .activate('valid_trial_license')
            .deletePlugins()
            .login()
    );

    it('should allow to install new plugin', () => {
        cy.contains('System Resources').click();
        cy.contains('Upload').click();
        cy.get('input[name=wagonUrl]').type(
            'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/3.2.15/cloudify_openstack_plugin-3.2.15-py27-none-linux_x86_64-centos-Core.wgn'
        );
        cy.get('input[name=yamlUrl]').type(
            'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/3.2.15/plugin.yaml'
        );
        cy.get('input[name=title]')
            .click()
            .should('have.value', 'cloudify-openstack-plugin')
            .type('-edited');
        cy.get('.ok').click();
        cy.get('.modal').should('not.exist');

        cy.log('Verify plugin was uploaded');
        cy.contains('cloudify-openstack-plugin-edited');
    });
});
