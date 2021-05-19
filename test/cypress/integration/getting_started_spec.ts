import { escapeRegExp, find } from 'lodash';
import pluginsCatalog from '../fixtures/plugins/catalog.json';

const awsSecrets = ['aws_access_key_id', 'aws_secret_access_key'];
const awsPlugins = ['cloudify-utilities-plugin', 'cloudify-kubernetes-plugin', 'cloudify-aws-plugin'];
const awsBlueprints = ['AWS-Basics-VM-Setup', 'AWS-VM-Setup-using-CloudFormation', 'Kubernetes-AWS-EKS'];

const gcpSecrets = [
    'gcp_client_x509_cert_url',
    'gcp_client_email',
    'gcp_client_id',
    'gcp_project_id',
    'gcp_private_key_id',
    'gcp_private_key',
    'gcp_zone'
];

const goToBackStep = () => cy.contains('button', 'Back').click();
const goToNextStep = () => cy.contains('button', 'Next').click();
const goToFinishStep = () => cy.contains('button', 'Finish').click();
const closeModal = () => cy.contains('button', 'Close').click();

function verifyInstallationSucceeded(blueprints: string[]) {
    cy.contains('.progress .progress', '100%', { timeout: blueprints.length * 2 * 60 * 1000 });
    cy.contains('.progress .label', 'Installation done!');
    cy.get('.ui.red.message').should('not.exist'); // there shouldn't be visible error messages
}

function verifySummaryItem(label: string, action: string) {
    cy.contains('.item', label).within(() => {
        cy.contains('.label', label);
        cy.contains(action);
    });
}

function verifyPluginInstallationSummaryItem(plugin: string) {
    verifySummaryItem(plugin, 'plugin will be installed');
}

function verifyPluginPresenceSummaryItem(plugin: string) {
    verifySummaryItem(plugin, 'plugin is already installed');
}

function verifyPluginNotAvailableSummaryItem(plugin: string) {
    verifySummaryItem(plugin, 'plugin not found in the catalog or on the manager');
}

function verifySecretCreationSummaryItem(secret: string) {
    verifySummaryItem(secret, 'secret will be created');
}

function verifySecretUpdateSummaryItem(secret: string) {
    verifySummaryItem(secret, 'secret will be updated');
}

function verifyBlueprintUploadSummaryItem(blueprint: string) {
    verifySummaryItem(blueprint, 'blueprint will be uploaded');
}

function verifyBlueprintPresenceSummaryItem(blueprint: string) {
    verifySummaryItem(blueprint, 'blueprint is already uploaded');
}

function toAlias(item: string) {
    return `${item}CreateRequest`;
}

function toAliasReferences(items: string[]) {
    return items.map(item => `@${toAlias(item)}`);
}

function setSecretValues(secrets: string[]) {
    secrets.forEach(secret => cy.get(`[name=${secret}]`).type(`${secret}_value`));
}

function interceptSecretsCreation(secrets: string[]) {
    secrets.forEach(secret => cy.interceptSp('PUT', `/secrets/${secret}`).as(toAlias(secret)));
}

function interceptPluginsUpload(plugins: string[]) {
    plugins.forEach(plugin => {
        const catalogEntry = find(pluginsCatalog, { name: plugin })!;
        cy.intercept({
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: {
                title: catalogEntry.title,
                visibility: 'tenant',
                iconUrl: catalogEntry.icon,
                yamlUrl: catalogEntry.link,
                wagonUrl: RegExp(catalogEntry.wagons.map(wagon => escapeRegExp(wagon.url)).join('|'))
            }
        }).as(toAlias(plugin));
    });
}

function interceptBlueprintsUpload(blueprints: string[]) {
    blueprints.forEach(blueprint => cy.interceptSp('PUT', `/blueprints/${blueprint}`).as(toAlias(blueprint)));
}

function mockPluginsCatalog(catalogData: any[]) {
    cy.intercept(
        {
            method: 'GET',
            pathname: '/console/external/content',
            query: {
                url: 'http://repository.cloudifysource.org/cloudify/wagons/plugins.json'
            }
        },
        { body: catalogData }
    );
}

describe('Getting started modal', () => {
    before(() => cy.activate());

    beforeEach(() => cy.enableGettingStarted().usePageMock().mockLogin('admin', 'admin', false));

    it('should provide option to disable it', () => {
        cy.interceptSp('POST', `/users/admin`).as('disableRequest');

        cy.get('.modal').within(() => {
            cy.contains('label', "Don't show next time").click();
            closeModal();
        });

        cy.wait('@disableRequest').its('request.body.show_getting_started').should('be.false');
    });

    it('should install selected technology', () => {
        mockPluginsCatalog(pluginsCatalog);
        cy.deletePlugins().deleteSecrets('aws_').deleteBlueprints('AWS-', true);

        cy.get('.modal').within(() => {
            cy.contains('button', 'AWS').click();
            goToNextStep();

            cy.contains('.header', 'AWS Secrets');
            setSecretValues(awsSecrets);
            goToNextStep();

            cy.contains('.header', 'Summary');
            awsPlugins.forEach(verifyPluginInstallationSummaryItem);
            awsSecrets.forEach(verifySecretCreationSummaryItem);
            awsBlueprints.forEach(verifyBlueprintUploadSummaryItem);

            interceptSecretsCreation(awsSecrets);
            interceptPluginsUpload(awsPlugins);
            interceptBlueprintsUpload(awsBlueprints);

            goToFinishStep();

            cy.wait(toAliasReferences(awsSecrets));
            cy.wait(toAliasReferences(awsPlugins), { responseTimeout: awsPlugins.length * 2 * 60 * 1000 });
            cy.wait(toAliasReferences(awsBlueprints));

            verifyInstallationSucceeded(awsBlueprints);
            closeModal();
        });
    });

    it('should omit uploaded plugins and blueprints updating existing secrets', () => {
        awsSecrets.forEach(secretKey => cy.createSecret(secretKey, 'dummy'));
        cy.interceptSp('GET', '/plugins', {
            body: {
                metadata: { pagination: { total: awsPlugins.length, size: 1000, offset: 0 }, filtered: null },
                items: awsPlugins.map(plugin => ({ package_name: plugin }))
            }
        });
        cy.interceptSp('GET', '/blueprints', {
            body: {
                metadata: { pagination: { total: awsBlueprints.length, size: 1000, offset: 0 }, filtered: null },
                items: awsBlueprints.map(id => ({ id }))
            }
        });

        cy.get('.modal').within(() => {
            cy.contains('button', 'AWS').click();
            goToNextStep();

            cy.contains('.header', 'AWS Secrets');
            setSecretValues(awsSecrets);
            goToNextStep();

            cy.contains('.header', 'Summary');
            awsPlugins.forEach(verifyPluginPresenceSummaryItem);
            awsSecrets.forEach(verifySecretUpdateSummaryItem);
            awsBlueprints.forEach(verifyBlueprintPresenceSummaryItem);

            awsSecrets.forEach(secret => cy.interceptSp('PATCH', `/secrets/${secret}`).as(toAlias(secret)));

            goToFinishStep();

            cy.wait(toAliasReferences(awsSecrets));

            verifyInstallationSucceeded(awsBlueprints);
            closeModal();
        });
    });

    it('should group common plugins and secrets', () => {
        mockPluginsCatalog(pluginsCatalog);
        cy.deletePlugins()
            .deleteSecrets('aws_')
            .deleteSecrets('gcp_')
            .deleteBlueprints('AWS-', true)
            .deleteBlueprints('GCP-', true);

        const plugins = [...awsPlugins, 'cloudify-terraform-plugin', 'cloudify-gcp-plugin', 'cloudify-ansible-plugin'];
        const blueprints = [
            ...awsBlueprints,
            'AWS-VM-Setup-using-Terraform',
            'GCP-Basics-VM-Setup',
            'GCP-Basics-Simple-Service-Setup',
            'Kubernetes-GCP-GKE'
        ];

        cy.get('.modal').within(() => {
            cy.contains('button', 'AWS').click();
            cy.contains('button', 'GCP').click();
            cy.contains('button', 'Terraform on AWS').click();
            goToNextStep();

            cy.contains('.header', 'AWS + Terraform on AWS Secrets');
            setSecretValues(awsSecrets);
            goToNextStep();

            cy.contains('.header', 'GCP Secrets');
            setSecretValues(gcpSecrets);
            goToNextStep();

            cy.contains('.header', 'Summary');
            plugins.forEach(verifyPluginInstallationSummaryItem);
            awsSecrets.forEach(verifySecretCreationSummaryItem);
            gcpSecrets.forEach(verifySecretCreationSummaryItem);
            blueprints.forEach(verifyBlueprintUploadSummaryItem);

            interceptSecretsCreation(awsSecrets);
            interceptSecretsCreation(gcpSecrets);
            interceptPluginsUpload(plugins);
            interceptBlueprintsUpload(blueprints);

            goToFinishStep();

            cy.wait(toAliasReferences(plugins));
            cy.wait(toAliasReferences(awsSecrets));
            cy.wait(toAliasReferences(gcpSecrets));
            cy.wait(toAliasReferences(blueprints));

            verifyInstallationSucceeded(blueprints);
            closeModal();
        });
    });

    it('requires all secrets to go to next step', () => {
        function verifySecretsRequired(secrets: string[]) {
            secrets.forEach(secret => {
                goToNextStep();
                cy.contains('.message', 'All secret values need to be specified');
                cy.get(`[name=${secret}]`).type(`${secret}_value`);
            });
        }

        cy.get('.modal').within(() => {
            cy.contains('button', 'AWS').click();
            cy.contains('button', 'GCP').click();
            goToNextStep();

            cy.contains('.header', 'AWS Secrets');
            verifySecretsRequired(awsSecrets);
            goToNextStep();

            cy.contains('.header', 'GCP Secrets');
            verifySecretsRequired(gcpSecrets);
            goToNextStep();

            cy.contains('.header', 'Summary');
        });
    });

    it('should display information about not available plugins', () => {
        mockPluginsCatalog([]);
        cy.deletePlugins();

        cy.get('.modal').within(() => {
            cy.contains('button', 'AWS').click();
            goToNextStep();

            cy.contains('.header', 'AWS Secrets');
            setSecretValues(awsSecrets);
            goToNextStep();

            cy.contains('.header', 'Summary');
            awsPlugins.forEach(verifyPluginNotAvailableSummaryItem);
        });
    });

    it('should keep button and field states when navigating beetwen steps', () => {
        cy.get('.modal').within(() => {
            cy.contains('button', 'AWS').click();
            cy.contains('button.active', 'AWS');
            goToNextStep();

            cy.contains('.header', 'AWS Secrets');
            setSecretValues(awsSecrets);
            goToBackStep();

            cy.contains('.header', 'Getting Started');
            cy.contains('button', 'GCP').click();
            cy.contains('button.active', 'AWS');
            cy.contains('button.active', 'GCP');
            goToNextStep();

            cy.contains('.header', 'AWS Secrets');
            awsSecrets.forEach(secret => cy.get(`[name=${secret}]`).should('have.value', `${secret}_value`));
            goToNextStep();

            cy.contains('.header', 'GCP Secrets');
            setSecretValues(gcpSecrets);
            goToBackStep();

            cy.contains('.header', 'AWS Secrets');
            awsSecrets.forEach(secret => cy.get(`[name=${secret}]`).should('have.value', `${secret}_value`));
            goToNextStep();

            cy.contains('.header', 'GCP Secrets');
            gcpSecrets.forEach(secret => cy.get(`[name=${secret}]`).should('have.value', `${secret}_value`));
        });
    });
});
