import {
    mockAwsBasicsVMSetupBlueprintUpload,
    mockAwsBlueprintsInManager,
    mockAwsVMSetupUsingCloudFormationBlueprintUpload,
    mockAwsVMSetupUsingTerraformBlueprintUpload,
    mockBlueprintUploaded,
    mockEmptyBlueprintsInManager,
    mockGcpBasicsSimpleServiceSetupBlueprintUpload,
    mockGcpBasicsVMSetupBlueprintUpload,
    mockKubernetesAwsEksBlueprintUpload,
    mockKubernetesGcpGkeBlueprintUpload
} from './blueprintMocks';
import {
    mockAwsAndGcpPluginsInCatalog,
    mockAwsPluginsInCatalog,
    mockAwsPluginsInManager,
    mockCloudifyAnsiblePluginUpload,
    mockCloudifyAwsPluginUpload,
    mockCloudifyGcpPluginUpload,
    mockCloudifyKubernetesPluginUpload,
    mockCloudifyTerraformPluginUpload,
    mockCloudifyUtilitiesPluginUpload,
    mockEmptyPluginsInCatalog,
    mockEmptyPluginsInManager
} from './pluginMocks';
import {
    mockAwsSecretsInManager,
    mockEmptySecretsInManager,
    mockSecretCreation,
    mockSecretUpdate
} from './secretMocks';

const gotoBackStep = () => cy.contains('button', 'Back').click();
const gotoNextStep = () => cy.contains('button', 'Next').click();
const gotoFinishStep = () => cy.contains('button', 'Finish').click();
const closeModal = () => cy.contains('button', 'Close').click();

const verifyIfInstallationSucceed = () => {
    cy.contains('.progress .progress', '100%');
    cy.contains('.progress .label', 'Installation done!');
    cy.get('.ui.red.message', { timeout: 0 }).should('not.exist'); // there shouldn't be visible error messages
};

describe('Getting started modal', () => {
    before(() => cy.usePageMock().activate());

    it('should provide option to disable popup', () => {
        let showGettingStarted = true;

        cy.interceptSp('GET', `/users/admin`, res => {
            res.reply({ show_getting_started: showGettingStarted });
        }).as('getAdminUser');
        cy.interceptSp('POST', `/users/admin`, res => {
            showGettingStarted = res.body.show_getting_started;
            res.reply({ show_getting_started: showGettingStarted });
        });

        cy.mockLogin();

        cy.get('.modal').within(() => {
            cy.contains('label', "Don't show next time").click();
            closeModal();
        });
        cy.reload();

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait('@getAdminUser').wait(5000).get('.modal').should('not.exist'); // the way to check if modal is not visible
    });

    describe('when is enabled', () => {
        before(() => cy.mockLogin(undefined, undefined, false));
        beforeEach(() => cy.reload());

        it('should install selected technology', () => {
            // mocks listing

            mockAwsPluginsInCatalog();
            mockEmptyPluginsInManager();
            mockEmptySecretsInManager();
            mockEmptyBlueprintsInManager();

            // mocks plugins uploading

            mockCloudifyAwsPluginUpload();
            mockCloudifyUtilitiesPluginUpload();
            mockCloudifyKubernetesPluginUpload();

            // mocks secrets creating

            mockSecretCreation('aws_access_key_id');
            mockSecretCreation('aws_secret_access_key');

            // mocks blueprints uploading

            mockAwsBasicsVMSetupBlueprintUpload();
            mockAwsVMSetupUsingCloudFormationBlueprintUpload();
            mockKubernetesAwsEksBlueprintUpload();

            // mocks blueprints status

            mockBlueprintUploaded('AWS-Basics-VM-Setup');
            mockBlueprintUploaded('AWS-VM-Setup-using-CloudFormation');
            mockBlueprintUploaded('Kubernetes-AWS-EKS');

            cy.get('.modal').within(() => {
                cy.contains('button', 'AWS').click();
                gotoNextStep();

                cy.contains('.header', 'AWS Secrets');
                cy.get('[name="aws_access_key_id"]').type('some_aws_access_key_id');
                cy.get('[name="aws_secret_access_key"]').type('some_aws_secret_access_key');
                gotoNextStep();

                cy.contains('.header', 'Summary');
                cy.contains(/cloudify-utilities-plugin.*plugin will be installed/);
                cy.contains(/cloudify-kubernetes-plugin.*plugin will be installed/);
                cy.contains(/cloudify-aws-plugin.*plugin will be installed/);
                cy.contains(/aws_access_key_id.*secret will be created/);
                cy.contains(/aws_secret_access_key.*secret will be created/);
                cy.contains(/AWS-Basics-VM-Setup.*blueprint will be uploaded/);
                cy.contains(/AWS-VM-Setup-using-CloudFormation.*blueprint will be uploaded/);
                cy.contains(/Kubernetes-AWS-EKS.*blueprint will be uploaded/);
                gotoFinishStep();

                verifyIfInstallationSucceed();
                closeModal();
            });
        });

        it('should omit uploaded plugins and blueprints updating existing secrets', () => {
            // mocks listing

            mockAwsPluginsInCatalog();
            mockAwsPluginsInManager();
            mockAwsSecretsInManager();
            mockAwsBlueprintsInManager();

            // mocks plugins uploading

            const mockForbiddenPluginUpload = (
                pluginTitle: string,
                iconUrl: string,
                yamlUrl: string,
                wagonUrl: string
            ) =>
                cy.intercept(
                    {
                        method: 'POST',
                        pathname: '/console/plugins/upload',
                        query: { visibility: 'tenant', title: pluginTitle, iconUrl, yamlUrl, wagonUrl }
                    },
                    () => {
                        throw new Error('This case should not occur.');
                    }
                );

            mockForbiddenPluginUpload(
                'AWS',
                'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/plugin.yaml',
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn'
            );

            mockForbiddenPluginUpload(
                'Utilities',
                'https://cloudify.co/wp-content/uploads/2019/08/pluginlogo.png',
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/plugin.yaml',
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn'
            );

            mockForbiddenPluginUpload(
                'Kubernetes',
                'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/plugin.yaml',
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn'
            );

            // mocks secrets creating

            mockSecretUpdate('aws_access_key_id');
            mockSecretUpdate('aws_secret_access_key');

            // mocks blueprints uploading

            const mockForbiddenBlueprintUpload = (
                blueprintName: string,
                applicationFileName: string,
                blueprintArchiveUrl: string
            ) =>
                cy.intercept(
                    {
                        method: 'PUT',
                        pathname: `/blueprints/${blueprintName}?async_upload=true`, // async_upload must be directly in the path
                        query: {
                            visibility: 'tenant',
                            application_file_name: applicationFileName,
                            blueprint_archive_url: blueprintArchiveUrl
                        }
                    },
                    () => {
                        throw new Error('This case should not occur.');
                    }
                );

            mockForbiddenBlueprintUpload(
                'AWS-Basics-VM-Setup',
                'aws.yaml',
                'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip'
            );

            mockForbiddenBlueprintUpload(
                'AWS-VM-Setup-using-CloudFormation',
                'aws-cloudformation.yaml',
                'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip'
            );

            mockForbiddenBlueprintUpload(
                'Kubernetes-AWS-EKS',
                'blueprint.yaml',
                'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-aws-eks.zip'
            );

            // mocks blueprints status

            const mockForbiddenSecretGetting = (secretName: string) =>
                cy.interceptSp('GET', `/blueprints/${secretName}`, () => {
                    throw new Error('This case should not occur.');
                });

            mockForbiddenSecretGetting('AWS-Basics-VM-Setup');
            mockForbiddenSecretGetting('AWS-VM-Setup-using-CloudFormation');
            mockForbiddenSecretGetting('Kubernetes-AWS-EKS');

            cy.get('.modal').within(() => {
                cy.contains('button', 'AWS').click();
                gotoNextStep();

                cy.contains('.header', 'AWS Secrets');
                cy.get('[name="aws_access_key_id"]').type('some_aws_access_key_id');
                cy.get('[name="aws_secret_access_key"]').type('some_aws_secret_access_key');
                gotoNextStep();

                cy.contains('.header', 'Summary');
                cy.contains(/cloudify-utilities-plugin.*plugin is already installed/);
                cy.contains(/cloudify-kubernetes-plugin.*plugin is already installed/);
                cy.contains(/cloudify-aws-plugin.*plugin is already installed/);
                cy.contains(/aws_access_key_id.*secret will be updated/);
                cy.contains(/aws_secret_access_key.*secret will be updated/);
                cy.contains(/AWS-Basics-VM-Setup.*blueprint is already uploaded/);
                cy.contains(/AWS-VM-Setup-using-CloudFormation.*blueprint is already uploaded/);
                cy.contains(/Kubernetes-AWS-EKS.*blueprint is already uploaded/);
                gotoFinishStep();

                verifyIfInstallationSucceed();
                closeModal();
            });
        });

        it('should group common plugins and secrets', () => {
            // mocks listing

            mockAwsAndGcpPluginsInCatalog();
            mockEmptyPluginsInManager();
            mockEmptySecretsInManager();
            mockEmptyBlueprintsInManager();

            // mocks plugins uploading

            mockCloudifyAwsPluginUpload();
            mockCloudifyUtilitiesPluginUpload();
            mockCloudifyKubernetesPluginUpload();
            mockCloudifyTerraformPluginUpload();
            mockCloudifyGcpPluginUpload();
            mockCloudifyAnsiblePluginUpload();

            // mocks secrets creating

            mockSecretCreation('aws_access_key_id');
            mockSecretCreation('aws_secret_access_key');
            mockSecretCreation('gpc_client_x509_cert_url');
            mockSecretCreation('gpc_client_email');
            mockSecretCreation('gpc_client_id');
            mockSecretCreation('gpc_project_id');
            mockSecretCreation('gpc_private_key_id');
            mockSecretCreation('gpc_private_key');
            mockSecretCreation('gpc_zone');

            // mocks blueprints uploading

            mockAwsBasicsVMSetupBlueprintUpload();
            mockAwsVMSetupUsingCloudFormationBlueprintUpload();
            mockKubernetesAwsEksBlueprintUpload();
            mockAwsVMSetupUsingTerraformBlueprintUpload();
            mockGcpBasicsVMSetupBlueprintUpload();
            mockGcpBasicsSimpleServiceSetupBlueprintUpload();
            mockKubernetesGcpGkeBlueprintUpload();

            // mocks blueprints status

            mockBlueprintUploaded('AWS-Basics-VM-Setup');
            mockBlueprintUploaded('AWS-VM-Setup-using-CloudFormation');
            mockBlueprintUploaded('Kubernetes-AWS-EKS');
            mockBlueprintUploaded('AWS-VM-Setup-using-Terraform');
            mockBlueprintUploaded('GCP-Basics-VM-Setup');
            mockBlueprintUploaded('GCP-Basics-Simple-Service-Setup');
            mockBlueprintUploaded('Kubernetes-GCP-GKE');

            cy.get('.modal').within(() => {
                cy.contains('button', 'AWS').click();
                cy.contains('button', 'GCP').click();
                cy.contains('button', 'Terraform on AWS').click();
                gotoNextStep();

                cy.contains('.header', 'AWS + Terraform on AWS Secrets');
                cy.get('[name="aws_access_key_id"]').type('some_aws_access_key_id');
                cy.get('[name="aws_secret_access_key"]').type('some_aws_secret_access_key');
                gotoNextStep();

                cy.contains('.header', 'GCP Secrets');
                cy.get('[name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
                cy.get('[name="gpc_client_email"]').type('some_gpc_client_email');
                cy.get('[name="gpc_client_id"]').type('some_gpc_client_id');
                cy.get('[name="gpc_project_id"]').type('some_gpc_project_id');
                cy.get('[name="gpc_private_key_id"]').type('some_gpc_private_key_id');
                cy.get('[name="gpc_private_key"]').type('some_gpc_private_key');
                cy.get('[name="gpc_zone"]').type('some_gpc_zone');
                gotoNextStep();

                cy.contains('.header', 'Summary');

                cy.contains(/cloudify-aws-plugin.*plugin will be installed/);
                cy.contains(/cloudify-utilities-plugin.*plugin will be installed/);
                cy.contains(/cloudify-kubernetes-plugin.*plugin will be installed/);
                cy.contains(/cloudify-terraform-plugin.*plugin will be installed/);
                cy.contains(/cloudify-gcp-plugin.*plugin will be installed/);
                cy.contains(/cloudify-ansible-plugin.*plugin will be installed/);

                cy.contains(/gpc_client_x509_cert_url.*secret will be created/);
                cy.contains(/gpc_client_email.*secret will be created/);
                cy.contains(/gpc_client_id.*secret will be created/);
                cy.contains(/gpc_project_id.*secret will be created/);
                cy.contains(/gpc_private_key_id.*secret will be created/);
                cy.contains(/gpc_private_key.*secret will be created/);
                cy.contains(/gpc_zone.*secret will be created/);
                cy.contains(/aws_access_key_id.*secret will be created/);
                cy.contains(/aws_secret_access_key.*secret will be created/);

                cy.contains(/AWS-Basics-VM-Setup.*blueprint will be uploaded/);
                cy.contains(/AWS-VM-Setup-using-CloudFormation.*blueprint will be uploaded/);
                cy.contains(/Kubernetes-AWS-EKS.*blueprint will be uploaded/);
                cy.contains(/AWS-VM-Setup-using-Terraform.*blueprint will be uploaded/);
                cy.contains(/GCP-Basics-VM-Setup.*blueprint will be uploaded/);
                cy.contains(/GCP-Basics-Simple-Service-Setup.*blueprint will be uploaded/);
                cy.contains(/Kubernetes-GCP-GKE.*blueprint will be uploaded/);

                gotoFinishStep();

                verifyIfInstallationSucceed();
                closeModal();
            });
        });

        it('requires all secrets to go to next step', () => {
            // mocks listing

            mockEmptyPluginsInCatalog();
            mockEmptyPluginsInManager();
            mockEmptySecretsInManager();
            mockEmptyBlueprintsInManager();

            const checkErrorMessage = () => {
                gotoNextStep();
                cy.contains('.message', 'All secret values need to be specified');
            };

            cy.get('.modal').within(() => {
                cy.contains('button', 'AWS').click();
                cy.contains('button', 'GCP').click();
                gotoNextStep();

                cy.contains('.header', 'AWS Secrets');
                checkErrorMessage();
                cy.get('[name="aws_access_key_id"]').type('some_aws_access_key_id');
                checkErrorMessage();
                cy.get('[name="aws_secret_access_key"]').type('some_aws_secret_access_key');
                gotoNextStep();

                cy.contains('.header', 'GCP Secrets');
                checkErrorMessage();
                cy.get('[name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
                checkErrorMessage();
                cy.get('[name="gpc_client_email"]').type('some_gpc_client_email');
                checkErrorMessage();
                cy.get('[name="gpc_client_id"]').type('some_gpc_client_id');
                checkErrorMessage();
                cy.get('[name="gpc_project_id"]').type('some_gpc_project_id');
                checkErrorMessage();
                cy.get('[name="gpc_private_key_id"]').type('some_gpc_private_key_id');
                checkErrorMessage();
                cy.get('[name="gpc_private_key"]').type('some_gpc_private_key');
                checkErrorMessage();
                cy.get('[name="gpc_zone"]').type('some_gpc_zone');
                gotoNextStep();

                cy.contains('.header', 'Summary');
            });
        });

        it('should display information about not available plugins', () => {
            // mocks listing

            mockEmptyPluginsInCatalog();
            mockEmptyPluginsInManager();
            mockEmptySecretsInManager();
            mockEmptyBlueprintsInManager();

            cy.get('.modal').within(() => {
                cy.contains('button', 'AWS').click();
                gotoNextStep();

                cy.contains('.header', 'AWS Secrets');
                cy.get('[name="aws_access_key_id"]').type('some_aws_access_key_id');
                cy.get('[name="aws_secret_access_key"]').type('some_aws_secret_access_key');
                gotoNextStep();

                cy.contains('.header', 'Summary');
                cy.contains(/cloudify-aws-plugin.*plugin not found in the catalog or on the manager/);
                cy.contains(/cloudify-utilities-plugin.*plugin not found in the catalog or on the manager/);
                cy.contains(/cloudify-kubernetes-plugin.*plugin not found in the catalog or on the manager/);
            });
        });

        it('should keep button and field states for navigating beetwen steps', () => {
            mockEmptyPluginsInCatalog();

            cy.get('.modal').within(() => {
                cy.contains('button', 'AWS').click();
                cy.contains('button.active', 'AWS');
                gotoNextStep();

                cy.contains('.header', 'AWS Secrets');
                cy.get('[name="aws_access_key_id"]').type('some_aws_access_key_id');
                cy.get('[name="aws_secret_access_key"]').type('some_aws_secret_access_key');
                gotoBackStep();

                cy.contains('.header', 'Getting Started');
                cy.contains('button', 'GCP').click();
                cy.contains('button.active', 'AWS');
                cy.contains('button.active', 'GCP');
                gotoNextStep();

                cy.contains('.header', 'AWS Secrets');
                cy.get('[name="aws_access_key_id"]').should('have.value', 'some_aws_access_key_id');
                cy.get('[name="aws_secret_access_key"]').should('have.value', 'some_aws_secret_access_key');
                gotoNextStep();

                cy.contains('.header', 'GCP Secrets');
                cy.get('[name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
                cy.get('[name="gpc_client_email"]').type('some_gpc_client_email');
                cy.get('[name="gpc_client_id"]').type('some_gpc_client_id');
                cy.get('[name="gpc_project_id"]').type('some_gpc_project_id');
                cy.get('[name="gpc_private_key_id"]').type('some_gpc_private_key_id');
                cy.get('[name="gpc_private_key"]').type('some_gpc_private_key');
                cy.get('[name="gpc_zone"]').type('some_gpc_zone');
                gotoBackStep();

                cy.contains('.header', 'AWS Secrets');
                cy.get('[name="aws_access_key_id"]').should('have.value', 'some_aws_access_key_id');
                cy.get('[name="aws_secret_access_key"]').should('have.value', 'some_aws_secret_access_key');
                gotoNextStep();

                cy.contains('.header', 'GCP Secrets');
                cy.get('[name="gpc_client_x509_cert_url"]').should('have.value', 'some_gpc_client_x509_cert_url');
                cy.get('[name="gpc_client_email"]').should('have.value', 'some_gpc_client_email');
                cy.get('[name="gpc_client_id"]').should('have.value', 'some_gpc_client_id');
                cy.get('[name="gpc_project_id"]').should('have.value', 'some_gpc_project_id');
                cy.get('[name="gpc_private_key_id"]').should('have.value', 'some_gpc_private_key_id');
                cy.get('[name="gpc_private_key"]').should('have.value', 'some_gpc_private_key');
                cy.get('[name="gpc_zone"]').should('have.value', 'some_gpc_zone');
            });
        });
    });
});
