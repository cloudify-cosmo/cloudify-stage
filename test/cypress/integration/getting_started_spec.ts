import { escapeRegExp, find } from 'lodash';
import { PluginDescription } from 'widgets/pluginsCatalog/src/types';
import { minutesToMs } from '../support/resource_commons';

const pluginsCatalogUrl = 'http://repository.cloudifysource.org/cloudify/wagons/v2_plugins.json';
const awsSecrets = ['aws_access_key_id', 'aws_secret_access_key'];
const awsPlugins = ['cloudify-utilities-plugin', 'cloudify-kubernetes-plugin', 'cloudify-aws-plugin'];
const awsBlueprints = ['AWS-Basics-VM-Setup', 'AWS-VM-Setup-using-CloudFormation', 'Kubernetes-AWS-EKS'];
const blueprintsPageUrlSuffix = '/page/blueprints';

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

const waitOptionsForPluginsUpload: Parameters<typeof cy.wait>[1] = { responseTimeout: minutesToMs(5) };

function verifyInstallationSucceeded(blueprints: string[]) {
    cy.contains('.progress .progress', '100%', { timeout: blueprints.length * minutesToMs(2) });
    cy.contains('.progress .label', 'Installation completed! (you can now close this window)');
    cy.get('.ui.red.message').should('not.exist');
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

function verifySecretSkipSummaryItem(secret: string) {
    verifySummaryItem(secret, 'secret will be skipped');
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
    cy.request<PluginDescription[]>(pluginsCatalogUrl).then(response => {
        const pluginsCatalog = response.body;
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
                url: pluginsCatalogUrl
            }
        },
        { body: catalogData }
    );
}

const StaticHeaders = {
    Environments: 'First, please select your environment(s)',
    Summary: 'Finally, please review your selected task list below and click ‘Finish’ to begin installation...'
};

function getExpectedSecretsHeader(environmentName: string) {
    return `${environmentName} Secrets`;
}

function verifyHeader(headerContent: string) {
    cy.contains('.header', headerContent).should('be.visible');
}

describe('Getting started modal', () => {
    before(() => cy.activate());

    // NOTE: Most of the tests are wrapped inside another describe, so that we wouldn't have to resign from using the usePageMock. Because of that we can be granted performance boost, which is making test scenarios faster by approximately 5s.
    describe('', () => {
        before(() => cy.usePageMock().mockLogin('admin', 'admin', false));
        beforeEach(() => cy.visit(`/console?cloudSetup=true`));

        it('should install selected environment', () => {
            cy.deletePlugins().deleteSecrets('aws_').deleteBlueprints('AWS-', true);

            cy.get('.modal').within(() => {
                goToNextStep();
                cy.contains('button', 'AWS').click();
                goToNextStep();

                verifyHeader(getExpectedSecretsHeader('AWS'));
                setSecretValues(awsSecrets);
                goToNextStep();

                verifyHeader(StaticHeaders.Summary);
                awsPlugins.forEach(verifyPluginInstallationSummaryItem);
                awsSecrets.forEach(verifySecretCreationSummaryItem);
                awsBlueprints.forEach(verifyBlueprintUploadSummaryItem);

                interceptSecretsCreation(awsSecrets);
                interceptPluginsUpload(awsPlugins);
                interceptBlueprintsUpload(awsBlueprints);

                goToFinishStep();

                cy.wait(toAliasReferences(awsSecrets));
                cy.wait(toAliasReferences(awsPlugins), waitOptionsForPluginsUpload);
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
                goToNextStep();
                cy.contains('button', 'AWS').click();
                goToNextStep();

                verifyHeader(getExpectedSecretsHeader('AWS'));
                setSecretValues(awsSecrets);
                goToNextStep();

                verifyHeader(StaticHeaders.Summary);
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

        it('should group common plugins', () => {
            cy.deletePlugins().deleteSecrets('aws_').deleteBlueprints('AWS-', true);

            cy.get('.modal').within(() => {
                goToNextStep();

                cy.contains('button', 'AWS').click();
                goToNextStep();

                verifyHeader(getExpectedSecretsHeader('AWS'));
                setSecretValues(awsSecrets);
                goToNextStep();

                verifyHeader(StaticHeaders.Summary);
                awsPlugins.forEach(verifyPluginInstallationSummaryItem);
                awsSecrets.forEach(verifySecretCreationSummaryItem);
                awsBlueprints.forEach(verifyBlueprintUploadSummaryItem);

                interceptSecretsCreation(awsSecrets);
                interceptPluginsUpload(awsPlugins);
                interceptBlueprintsUpload(awsBlueprints);

                goToFinishStep();

                cy.wait(toAliasReferences(awsPlugins), waitOptionsForPluginsUpload);
                cy.wait(toAliasReferences(awsSecrets));
                cy.wait(toAliasReferences(awsBlueprints));

                verifyInstallationSucceeded(awsBlueprints);
                closeModal();
            });
        });

        it('should display information about not available plugins', () => {
            mockPluginsCatalog([]);
            cy.deletePlugins();

            cy.get('.modal').within(() => {
                goToNextStep();
                cy.contains('button', 'AWS').click();
                goToNextStep();

                verifyHeader(getExpectedSecretsHeader('AWS'));
                setSecretValues(awsSecrets);
                goToNextStep();

                verifyHeader(StaticHeaders.Summary);
                awsPlugins.forEach(verifyPluginNotAvailableSummaryItem);
            });
        });

        it('should allow only one environment to be selected at a time', () => {
            goToNextStep();
            cy.contains('button', 'AWS').click();
            cy.contains('button.active', 'AWS');

            cy.contains('button', 'GCP').click();
            cy.contains('button.active', 'AWS').should('not.exist');
            cy.contains('button.active', 'GCP');
        });

        it('should allow to click "Next" button when an environment is being selected', () => {
            goToNextStep();
            cy.contains('button', 'Next').should('to.be.disabled');

            cy.contains('button', 'AWS').click();
            cy.contains('button', 'Next').should('not.to.be.disabled');

            cy.contains('button', 'AWS').click();
            cy.contains('button', 'Next').should('to.be.disabled');
        });

        it('should keep button and field states when navigating between steps', () => {
            cy.get('.modal').within(() => {
                goToNextStep();
                cy.contains('button', 'AWS').click();
                cy.contains('button.active', 'AWS');
                goToNextStep();

                verifyHeader(getExpectedSecretsHeader('AWS'));
                setSecretValues(awsSecrets);
                goToBackStep();

                verifyHeader(StaticHeaders.Environments);
                cy.contains('button.active', 'AWS');
                cy.contains('button', 'GCP').click();
                cy.contains('button.active', 'GCP');
                goToNextStep();

                verifyHeader(getExpectedSecretsHeader('GCP'));
                setSecretValues(gcpSecrets);
                goToBackStep();

                cy.contains('button', 'AWS').click();
                goToNextStep();
                verifyHeader(getExpectedSecretsHeader('AWS'));
                awsSecrets.forEach(secret => cy.get(`[name=${secret}]`).should('have.value', `${secret}_value`));
                goToBackStep();

                cy.contains('button', 'GCP').click();
                goToNextStep();
                verifyHeader(getExpectedSecretsHeader('GCP'));
                gcpSecrets.forEach(secret => cy.get(`[name=${secret}]`).should('have.value', `${secret}_value`));
            });
        });

        it('should allow to not provide every environment secret', () => {
            const secretToSkip = awsSecrets[0];

            goToNextStep();
            cy.contains('button', 'AWS').click();
            cy.contains('button', 'Next').click();
            setSecretValues(awsSecrets.filter(awsSecret => awsSecret !== secretToSkip));

            cy.contains('button', 'Next').click();
            verifySecretSkipSummaryItem(secretToSkip);
        });

        it('should show different content depending on cloudSetup parameter presence', () => {
            // cloudSetup parameter present (see beforeEach)
            goToNextStep();
            cy.get('.ui.checkbox').should('not.exist');
            // NOTE: actual content is verified by test cases that go through steps

            // cloudSetup parameter missing
            cy.enableGettingStarted().visit('/console');
            goToNextStep();
            cy.log('Verify modal content');
            cy.get('.modal .content button').should('have.length', 3);
            cy.contains('.modal .content button', 'Terraform').should('be.visible');
            cy.contains('.modal .content button', 'Kubernetes').should('be.visible');
            cy.contains('.modal .content button', 'Multi Cloud').should('be.visible');

            cy.log('Verify "don\'t show next time" checkbox presence and behavior');

            cy.get('.ui.checkbox:not(.checked)').should('exist');

            cy.interceptSp('POST', `/users/admin`).as('disableRequest');

            cy.contains('label', "Don't show next time").click();
            closeModal();

            cy.contains('button', 'Yes').click();

            cy.wait('@disableRequest').its('request.body.show_getting_started').should('be.false');
        });
    });

    it('should redirect to the blueprints page upon closing the modal', () => {
        cy.enableGettingStarted().mockLogin('admin', 'admin', false);

        cy.get('.modal').within(() => {
            goToNextStep();
            cy.contains('button', 'Close').click();
        });

        cy.get('.modal').within(() => {
            cy.contains('div.content', 'Are you sure you want to cancel the setup process?').should('be.visible');
            cy.contains('button', 'Yes').click();
        });

        cy.url().should('include', blueprintsPageUrlSuffix);
    });
});
