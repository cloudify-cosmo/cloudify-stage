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

describe('Getting started modal', () => {
    it('should provide option to disable popup', () => {
        let showGettingStarted = true;
        cy.usePageMock()
            .activate()
            .interceptSp('GET', `/users/admin`, res => {
                res.reply({ show_getting_started: showGettingStarted });
            })
            .interceptSp('POST', `/users/admin`, res => {
                showGettingStarted = res.body.show_getting_started;
                res.reply({ show_getting_started: showGettingStarted });
            })
            .mockLogin();
        cy.get('.modal').within(() => {
            cy.contains('label', "Don't show next time").click();
            closeModal();
        });
        cy.reload();
        cy.get('.modal').should('not.exist'); // the way to check if modal is not visible
    });
});

describe('Mocked getting started modal', () => {
    before(() => {
        cy.usePageMock().activate();
    });

    beforeEach(() => cy.mockLogin(undefined, undefined, false).reload());

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

            cy.contains('.progress .progress', '100%');
            cy.contains('.progress .label', 'Installation done!');
            cy.get('.ui.red.message', { timeout: 0 }).should('not.exist'); // there shouldn't be visible error messages
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

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=AWS&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Faws-1.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-aws-plugin%2F2.8.0%2Fcloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Utilities&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2019%2F08%2Fpluginlogo.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-utilities-plugin%2F1.24.4%2Fcloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.intercept(
            'POST',
            '/console/plugins/upload?visibility=tenant&title=Kubernetes&iconUrl=https%3A%2F%2Fcloudify.co%2Fwp-content%2Fuploads%2F2020%2F07%2Fkube-icon.png&yamlUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fplugin.yaml&wagonUrl=http%3A%2F%2Frepository.cloudifysource.org%2Fcloudify%2Fwagons%2Fcloudify-kubernetes-plugin%2F2.12.1%2Fcloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        // mocks secrets creating

        mockSecretUpdate('aws_access_key_id');
        mockSecretUpdate('aws_secret_access_key');

        // mocks blueprints uploading

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=aws.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/AWS-VM-Setup-using-CloudFormation?visibility=tenant&async_upload=true&application_file_name=aws-cloudformation.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        cy.interceptSp(
            'PUT',
            '/blueprints/Kubernetes-AWS-EKS?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-aws-eks.zip',
            () => {
                throw new Error('This case should not occur.');
            }
        );

        // mocks blueprints status

        cy.interceptSp('GET', '/blueprints/AWS-Basics-VM-Setup', () => {
            throw new Error('This case should not occur.');
        });

        cy.interceptSp('GET', '/blueprints/AWS-VM-Setup-using-CloudFormation', () => {
            throw new Error('This case should not occur.');
        });

        cy.interceptSp('GET', '/blueprints/Kubernetes-AWS-EKS', () => {
            throw new Error('This case should not occur.');
        });

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

            cy.contains('.progress .progress', '100%');
            cy.contains('.progress .label', 'Installation done!');
            cy.get('.ui.red.message', { timeout: 0 }).should('not.exist'); // there shouldn't be visible error messages
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

            cy.contains('.progress .progress', '100%');
            cy.contains('.progress .label', 'Installation done!');
            cy.get('.ui.red.message', { timeout: 0 }).should('not.exist'); // there shouldn't be visible error messages
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
