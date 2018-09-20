/**
 * Created by jakub.niezgoda on 19/09/2018.
 */

module.exports = {
    'Hello World Wizard - success': function (client) {
        let deploymentWizard = client.page.deploymentWizard();

        client.login()
            .moveToEditMode()
            .addPage()
            .addWidget('deploymentWizardButtons')
            .moveOutOfEditMode();

        deploymentWizard
            .openHelloWorldWizard();

        // Infrastracture step
        deploymentWizard.section.infrastructureStep
            .selectYaml('gcp.yaml');

        // Check if navigation is working
        deploymentWizard
            .goToNextStep('pluginsStep')
            .goToPreviousStep('infrastructureStep')
            .goToNextStep('pluginsStep');

        // Plugins step
        deploymentWizard.section.pluginsStep
            .checkIfPluginPresent('cloudify-gcp-plugin', false)
            .addUserPlugin('invalidUrl', 'invalidUrl')
            .checkIfPluginPresent('user-plugin-0', true);
        deploymentWizard
            .goToNextStep('pluginsStep')
            .checkIfErrorPresent('Please correctly fill in fields for the following plugins: user-plugin-0.');
        deploymentWizard.section.pluginsStep
            .removeUserPlugin('user-plugin-0');
        deploymentWizard
            .goToNextStep('secretsStep');

        // Secrets step
        deploymentWizard.section.secretsStep
            .checkIfSecretPresent('gcp_client_x509_cert_url', true)
            .setSecretValue('gcp_client_x509_cert_url', '1')
            .checkIfSecretPresent('gcp_client_email', true)
            .setSecretValue('gcp_client_email', '2')
            .checkIfSecretPresent('gcp_client_id', true)
            .setSecretValue('gcp_client_id', '3')
            .checkIfSecretPresent('gcp_project_id', true)
            .setSecretValue('gcp_project_id', '4')
            .checkIfSecretPresent('gcp_private_key_id', true)
            .setSecretValue('gcp_private_key_id', '5')
            .checkIfSecretPresent('gcp_private_key', true)
            .setSecretValue('gcp_private_key', '6')
            .checkIfSecretPresent('gcp_zone', true);
        deploymentWizard
            .goToNextStep('secretsStep')
            .checkIfErrorPresent('Provide values for the following secrets: gcp_zone');
        deploymentWizard.section.secretsStep
            .setSecretValue('gcp_zone', '7');
        deploymentWizard
            .goToNextStep('inputsStep');

        // Inputs step
        deploymentWizard.section.inputsStep
            .checkIfInputPresent('region', true)
            .checkIfInputPresent('network_name', false)
            .checkIfInputPresent('subnet_name', false)
            .checkIfInputPresent('image', false)
            .checkIfInputPresent('instance_type', false);
        deploymentWizard
            .goToNextStep('inputsStep')
            .checkIfErrorPresent('Provide values for the following inputs: region');
        deploymentWizard.section.inputsStep
            .setInputValue('region', 'Terra Incognita');
        deploymentWizard
            .goToNextStep('confirmStep');

        // Confirmation step
        deploymentWizard.section.confirmStep
            .checkIfTaskPresent(1, 'Upload plugin cloudify-gcp-plugin')
            .checkIfTaskPresent(2, 'Create secret gcp_client_x509_cert_url')
            .checkIfTaskPresent(3, 'Create secret gcp_client_email')
            .checkIfTaskPresent(4, 'Create secret gcp_client_id')
            .checkIfTaskPresent(5, 'Create secret gcp_project_id')
            .checkIfTaskPresent(6, 'Create secret gcp_private_key_id')
            .checkIfTaskPresent(7, 'Create secret gcp_private_key')
            .checkIfTaskPresent(8, 'Create secret gcp_zone')
            .checkIfTaskPresent(9, 'Upload blueprint')
            .checkIfTaskPresent(10, 'deployment from')
            .checkIfTaskPresent(11, 'Execute install workflow on');
        deploymentWizard
            .clickInstall();

        // Install step
        deploymentWizard.section.installStep
            .checkIfInstallInProgress()
            .checkIfInstallStarted()
            .cancelRedirection();

        deploymentWizard
            .closeWizard();

        client.removeLastPage()
            .end();
    },

    'Deployment Wizard - failure': function(client) {
        let deploymentWizard = client.page.deploymentWizard();
        const blueprintPackage = client.page.resources().props.fileByName('blueprint.zip', client.globals);

        client.login()
            .moveToEditMode()
            .addPage()
            .addWidget('deploymentWizardButtons');

        deploymentWizard
            .openDeploymentWizard();

        // Blueprint step
        const expectedBlueprintErrorMessage
            = 'Please fill in the following fields with valid values: ' +
              'Blueprint package, Blueprint name, Blueprint YAML file.';
        deploymentWizard
            .goToNextStep('blueprintStep')
            .checkIfErrorPresent(expectedBlueprintErrorMessage);
        deploymentWizard.section.blueprintStep
            .setBlueprintPackage(blueprintPackage)
            .setBlueprintYamlFile('ec2-blueprint.yaml');
        deploymentWizard
            .goToNextStep('pluginsStep');

        // Plugins step
        deploymentWizard
            .goToNextStep('secretsStep');

        // Secrets step
        deploymentWizard
            .goToNextStep('inputsStep');

        // Inputs step
        deploymentWizard.section.inputsStep
            .checkIfInputPresent('webserver_port', false)
            .checkIfInputPresent('agent_user', false)
            .checkIfInputPresent('image_id', true)
            .setInputValue('image_id', 'circle')
            .checkIfInputPresent('instance_type', false);
        deploymentWizard
            .goToNextStep('confirmStep');

        // Confirmation step
        deploymentWizard.section.confirmStep
            .checkIfTaskPresent(1, 'Upload blueprint')
            .checkIfTaskPresent(2, 'deployment from')
            .checkIfTaskPresent(3, 'Execute install workflow on');
        deploymentWizard
            .clickInstall();

        // Install step
        const expectedInstallErrorMessage
            = 'Required plugin cloudify-aws-plugin, version 1.4.3 is not installed on the manager';
        deploymentWizard.section.installStep
            .checkIfInstallInProgress()
            .checkIfInstallFailed();
        deploymentWizard
            .checkIfErrorPresent(expectedInstallErrorMessage)
            .closeWizard();

        client.removeLastPage()
            .end();
    }
};