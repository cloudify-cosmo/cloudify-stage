describe('Deployment Wizard Buttons widget', () => {
    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .addWidget('deploymentWizardButtons')
    );

    function next() {
        cy.contains('Next').click();
    }

    it('should provide Hello World Wizard', () => {
        cy.deletePlugins().deleteSecrets('gcp_');

        cy.contains('Hello World Wizard').click();
        cy.get('button[name="gcp.yaml"]').click();

        cy.log('Verifying navigation');
        next();
        cy.contains('Back').click();
        next();

        cy.log('Verifying plugins step');
        cy.get('tr[name=cloudify-gcp-plugin] i.green.check.icon');
        cy.contains('Add plugin').click();
        cy.contains('user-plugin-0');
        cy.get('tr[name=user-plugin-0] i.yellow.warning.icon');
        next();
        cy.contains('Please correctly fill in fields for the following plugins: user-plugin-0.');
        cy.get('.minus').click();
        next();

        function setSecretValue(name, value) {
            cy.get(`tr[name=${name}]`).within(() => {
                cy.get('i.yellow.warning.icon');
                cy.get('input').type(value);
            });
        }

        cy.log('Verifying secrets step');
        setSecretValue('gcp_client_x509_cert_url', '1');
        setSecretValue('gcp_client_email', '2');
        setSecretValue('gcp_client_id', '3');
        setSecretValue('gcp_project_id', '4');
        setSecretValue('gcp_private_key_id', '5');
        setSecretValue('gcp_private_key', '6');
        next();
        cy.contains('Provide values for the following secrets: gcp_zone');
        setSecretValue('gcp_zone', '7');
        next();

        cy.log('Verifying inputs step');
        cy.get('tr[name=region] i.yellow.warning.icon');
        cy.get('tr[name=network_name] i.green.check.icon');
        cy.get('tr[name=subnet_name] i.green.check.icon');
        cy.get('tr[name=image] i.green.check.icon');
        cy.get('tr[name=instance_type] i.green.check.icon');
        next();
        cy.contains('Provide values for the following inputs: region');
        cy.get('tr[name=region] input').type('Terra Incognita');
        next();

        cy.log('Verifying confirm step');
        [
            'Upload plugin cloudify-gcp-plugin',
            'Create secret gcp_client_x509_cert_url',
            'Create secret gcp_client_email',
            'Create secret gcp_client_id',
            'Create secret gcp_project_id',
            'Create secret gcp_private_key_id',
            'Create secret gcp_private_key',
            'Create secret gcp_zone',
            'Upload blueprint',
            'deployment from',
            'Execute install workflow on'
        ].forEach((value, index) => cy.get(`div.list div.item:nth-child(${index + 1})`).contains(value));
        cy.contains('button', 'Install').click();

        cy.log('Verifying install step');
        cy.contains('Installation in progress...');
        cy.contains('Installation started!', { timeout: 2 * 60 * 1000 });
        cy.get('i.icon.hand.paper').click();
        cy.get('div.wizardModal div.actions i.cancel.icon').click();
        cy.get('div.small.modal button.primary.button').click();
        cy.get('div.wizardModal').should('not.exist');
    });

    it('should provide Deployment Wizard', () => {
        cy.contains('Deployment Wizard').click();

        cy.log('Verifying blueprints step');
        next();
        cy.contains(
            'Please fill in the following fields with valid values: ' +
                'Blueprint package, Blueprint name, Blueprint YAML file.'
        );
        cy.get('input[name=blueprintFile]').attachFile('blueprints/custom_plugin.zip');
        cy.contains('blueprint.yaml');

        next();
        cy.contains('You can go to the next step.');
        next();
        cy.contains('You can go to the next step.');
        next();

        cy.log('Verifying inputs step');
        cy.get('tr[name=webserver_port] i.green.check.icon');
        cy.get('tr[name=agent_user] i.green.check.icon');
        cy.get('tr[name=instance_type] i.green.check.icon');
        cy.get('tr[name=image_id]').within(() => {
            cy.get('i.yellow.warning.icon');
            cy.get('textarea').type('circle');
        });
        next();

        cy.log('Verifying confirm step');
        ['Upload blueprint', 'deployment from', 'Execute install workflow on'].forEach((value, index) =>
            cy.get(`div.list div.item:nth-child(${index + 1})`).contains(value)
        );
        cy.contains('button', 'Install').click();

        cy.log('Verifying install step');
        cy.contains('Installation in progress...');
        cy.contains('Installation failed. Check error details above.');
        cy.contains('Required plugin cloudify-aws-plugin, version 1.4.3 is not installed on the manager');
        cy.get('div.wizardModal div.actions i.cancel.icon').click();
        cy.get('div.small.modal button.primary.button').click();
        cy.get('div.wizardModal').should('not.exist');
    });
});
