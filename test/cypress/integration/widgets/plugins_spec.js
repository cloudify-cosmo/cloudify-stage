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
            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-diamond-plugin/1.3.6/cloudify_diamond_plugin-1.3.6-py26-none-linux_x86_64-centos-Final.wgn'
        );
        cy.get('input[name=yamlUrl]').type('http://www.getcloudify.org/spec/diamond-plugin/1.3.6/plugin.yaml');
        cy.get('input[name=title]')
            .click()
            .should('have.value', 'cloudify-diamond-plugin')
            .type('-edited');
        cy.get('.ok').click();
        cy.get('.modal').should('not.exist');

        cy.log('Verify plugin was uploaded');
        cy.contains('cloudify-diamond-plugin-edited');
    });
});
