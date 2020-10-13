describe('Plugins widget', () => {
    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .contains('System Resources')
            .click()
    );

    beforeEach(() => {
        cy.deletePlugins();

        cy.contains('Upload').click();
        cy.get('input[name=wagonUrl]').type(
            'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/3.2.15/cloudify_openstack_plugin-3.2.15-py27-none-linux_x86_64-centos-Core.wgn'
        );
        cy.get('input[name=yamlUrl]').type(
            'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/3.2.15/plugin.yaml'
        );
        cy.get('input[name=title]')
            .click()
            .should('have.value', 'cloudify-openstack-plugin');
    });

    it('should allow to install new plugin with custom name', () => {
        cy.get('input[name=title]').type('{backspace}{backspace}-edited');
        cy.get('.ok').click();
        cy.get('.modal').should('not.exist');

        cy.log('Verify plugin was uploaded');
        cy.get('.pluginsTable tbody tr').should('have.length', 1);
        cy.contains('cloudify-openstack-plug-edited');
    });

    it('should allow to install and manage new plugin', () => {
        cy.get('.ok').click();
        cy.get('.modal').should('not.exist');

        cy.log('Verify plugin was uploaded');
        cy.get('.pluginsTable tbody tr').should('have.length', 1);
        cy.contains('cloudify-openstack-plugin');

        cy.log('Check ID popup works');
        cy.get('.pluginsTable')
            .contains('ID')
            .trigger('mouseover');
        cy.contains('Copy ID');
        cy.get('.pluginsTable')
            .contains('ID')
            .trigger('mouseout');
        cy.contains('Copy ID').should('not.exist');

        cy.log('Set visibility to global');
        cy.get('.pluginsTable .user').click();
        cy.contains('Global').click();
        cy.contains('Yes').click();
        cy.get('.pluginsTable .globe');

        cy.log('Delete the plugin');
        cy.get('.pluginsTable .trash').click();
        cy.contains('Yes').click();
        cy.contains('There are no Plugins available');
    });
});
