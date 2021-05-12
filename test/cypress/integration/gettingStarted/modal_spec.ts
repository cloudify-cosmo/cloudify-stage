import {
    mockAwsBasicsVMSetupBlueprintUpload,
    mockAwsBlueprintsManager,
    mockAwsVMSetupUsingCloudFormationBlueprintUpload,
    mockAwsVMSetupUsingTerraformBlueprintUpload,
    mockBlueprintUploaded,
    mockEmptyBlueprintsManager,
    mockGcpBasicsSimpleServiceSetupBlueprintUpload,
    mockGcpBasicsVMSetupBlueprintUpload,
    mockKubernetesAwsEksBlueprintUpload,
    mockKubernetesGcpGkeBlueprintUpload
} from './blueprintMocks';
import {
    mockAwsAndGcpPluginsCatalog,
    mockAwsPluginsCatalog,
    mockAwsPluginsManager,
    mockCloudifyAnsiblePluginUpload,
    mockCloudifyAwsPluginUpload,
    mockCloudifyGcpPluginUpload,
    mockCloudifyKubernetesPluginUpload,
    mockCloudifyTerraformPluginUpload,
    mockCloudifyUtilitiesPluginUpload,
    mockEmptyPluginsCatalog,
    mockEmptyPluginsManager
} from './pluginMocks';
import { mockAwsSecretsManager, mockEmptySecretsManager, mockSecretCreation, mockSecretUpdate } from './secretMocks';

const gotoBackStep = () => cy.contains('.modal button', 'Back').click();
const gotoNextStep = () => cy.contains('.modal button', 'Next').click();
const gotoFinishStep = () => cy.contains('.modal button', 'Finish').click();
const closeModal = () => cy.contains('button:not([disabled])', 'Close').click();

describe('Getting started modal', () => {
    it('should provide option to disable popup', () => {
        cy.usePageMock().activate().login(undefined, undefined, true, false).enableGettingStarted();
        cy.reload();
        cy.contains('label', "Don't show next time").click();
        cy.contains('button', 'Close').click();
        cy.reload();
        cy.contains('div', 'This page is empty').click(); // the way to check if modal is not visible
    });
});

describe('Mocked getting started modal', () => {
    before(() => {
        cy.usePageMock().activate().login(undefined, undefined, true, false);
    });

    beforeEach(() => cy.mockEnabledGettingStarted().reload());

    it('should install selected technology', () => {
        // mocks listing

        mockAwsPluginsCatalog();
        mockEmptyPluginsManager();
        mockEmptySecretsManager();
        mockEmptyBlueprintsManager();

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

        cy.contains('.modal button', 'AWS').click();
        gotoNextStep();

        cy.contains('.modal .header', 'AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoNextStep();

        cy.contains('.modal .header', 'Summary');
        cy.contains('.modal', /cloudify-utilities-plugin.*plugin will be installed/);
        cy.contains('.modal', /cloudify-kubernetes-plugin.*plugin will be installed/);
        cy.contains('.modal', /cloudify-aws-plugin.*plugin will be installed/);
        cy.contains('.modal', /aws_access_key_id.*secret will be created/);
        cy.contains('.modal', /aws_secret_access_key.*secret will be created/);
        cy.contains('.modal', /AWS-Basics-VM-Setup.*blueprint will be uploaded/);
        cy.contains('.modal', /AWS-VM-Setup-using-CloudFormation.*blueprint will be uploaded/);
        cy.contains('.modal', /Kubernetes-AWS-EKS.*blueprint will be uploaded/);
        gotoFinishStep();

        cy.contains('.modal .progress .progress', '100%');
        cy.contains('.modal .progress .label', 'Installation done!');
        cy.get('.modal .ui.red.message', { timeout: 0 }).should('not.exist'); // there shouldn't be visible error messages
        closeModal();
    });

    it('should omit uploaded plugins and blueprints updating existing secrets', () => {
        // mocks listing

        mockAwsPluginsCatalog();
        mockAwsPluginsManager();
        mockAwsSecretsManager();
        mockAwsBlueprintsManager();

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

        cy.contains('.modal button', 'AWS').click();
        gotoNextStep();

        cy.contains('.modal .header', 'AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoNextStep();

        cy.contains('.modal .header', 'Summary');
        cy.contains('.modal', /cloudify-utilities-plugin.*plugin is already installed/);
        cy.contains('.modal', /cloudify-kubernetes-plugin.*plugin is already installed/);
        cy.contains('.modal', /cloudify-aws-plugin.*plugin is already installed/);
        cy.contains('.modal', /aws_access_key_id.*secret will be updated/);
        cy.contains('.modal', /aws_secret_access_key.*secret will be updated/);
        cy.contains('.modal', /AWS-Basics-VM-Setup.*blueprint is already uploaded/);
        cy.contains('.modal', /AWS-VM-Setup-using-CloudFormation.*blueprint is already uploaded/);
        cy.contains('.modal', /Kubernetes-AWS-EKS.*blueprint is already uploaded/);
        gotoFinishStep();

        cy.contains('.modal .progress .progress', '100%');
        cy.contains('.modal .progress .label', 'Installation done!');
        cy.get('.modal .ui.red.message', { timeout: 0 }).should('not.exist'); // there shouldn't be visible error messages
        closeModal();
    });

    it('should group common plugins and secrets', () => {
        // mocks listing

        mockAwsAndGcpPluginsCatalog();
        mockEmptyPluginsManager();
        mockEmptySecretsManager();
        mockEmptyBlueprintsManager();

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

        cy.contains('.modal button', 'AWS').click();
        cy.contains('.modal button', 'GCP').click();
        cy.contains('.modal button', 'Terraform on AWS').click();
        gotoNextStep();

        cy.contains('.modal .header', 'AWS + Terraform on AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoNextStep();

        cy.contains('.modal .header', 'GCP Secrets');
        cy.get('.modal [name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
        cy.get('.modal [name="gpc_client_email"]').type('some_gpc_client_email');
        cy.get('.modal [name="gpc_client_id"]').type('some_gpc_client_id');
        cy.get('.modal [name="gpc_project_id"]').type('some_gpc_project_id');
        cy.get('.modal [name="gpc_private_key_id"]').type('some_gpc_private_key_id');
        cy.get('.modal [name="gpc_private_key"]').type('some_gpc_private_key');
        cy.get('.modal [name="gpc_zone"]').type('some_gpc_zone');
        gotoNextStep();

        cy.contains('.modal .header', 'Summary');

        cy.contains('.modal', /cloudify-aws-plugin.*plugin will be installed/);
        cy.contains('.modal', /cloudify-utilities-plugin.*plugin will be installed/);
        cy.contains('.modal', /cloudify-kubernetes-plugin.*plugin will be installed/);
        cy.contains('.modal', /cloudify-terraform-plugin.*plugin will be installed/);
        cy.contains('.modal', /cloudify-gcp-plugin.*plugin will be installed/);
        cy.contains('.modal', /cloudify-ansible-plugin.*plugin will be installed/);

        cy.contains('.modal', /gpc_client_x509_cert_url.*secret will be created/);
        cy.contains('.modal', /gpc_client_email.*secret will be created/);
        cy.contains('.modal', /gpc_client_id.*secret will be created/);
        cy.contains('.modal', /gpc_project_id.*secret will be created/);
        cy.contains('.modal', /gpc_private_key_id.*secret will be created/);
        cy.contains('.modal', /gpc_private_key.*secret will be created/);
        cy.contains('.modal', /gpc_zone.*secret will be created/);
        cy.contains('.modal', /aws_access_key_id.*secret will be created/);
        cy.contains('.modal', /aws_secret_access_key.*secret will be created/);

        cy.contains('.modal', /AWS-Basics-VM-Setup.*blueprint will be uploaded/);
        cy.contains('.modal', /AWS-VM-Setup-using-CloudFormation.*blueprint will be uploaded/);
        cy.contains('.modal', /Kubernetes-AWS-EKS.*blueprint will be uploaded/);
        cy.contains('.modal', /AWS-VM-Setup-using-Terraform.*blueprint will be uploaded/);
        cy.contains('.modal', /GCP-Basics-VM-Setup.*blueprint will be uploaded/);
        cy.contains('.modal', /GCP-Basics-Simple-Service-Setup.*blueprint will be uploaded/);
        cy.contains('.modal', /Kubernetes-GCP-GKE.*blueprint will be uploaded/);

        gotoFinishStep();

        cy.contains('.modal .progress .progress', '100%');
        cy.contains('.modal .progress .label', 'Installation done!');
        cy.get('.modal .ui.red.message', { timeout: 0 }).should('not.exist'); // there shouldn't be visible error messages
        closeModal();
    });

    it('requires all secrets to go to next step', () => {
        // mocks listing

        mockEmptyPluginsCatalog();
        mockEmptyPluginsManager();
        mockEmptySecretsManager();
        mockEmptyBlueprintsManager();

        const checkErrorMessage = () => {
            gotoNextStep();
            cy.contains('.modal .message', 'All secret values need to be specified');
        };

        cy.contains('.modal button', 'AWS').click();
        cy.contains('.modal button', 'GCP').click();
        gotoNextStep();

        cy.contains('.modal .header', 'AWS Secrets');
        checkErrorMessage();
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        checkErrorMessage();
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoNextStep();

        cy.contains('.modal .header', 'GCP Secrets');
        checkErrorMessage();
        cy.get('.modal [name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
        checkErrorMessage();
        cy.get('.modal [name="gpc_client_email"]').type('some_gpc_client_email');
        checkErrorMessage();
        cy.get('.modal [name="gpc_client_id"]').type('some_gpc_client_id');
        checkErrorMessage();
        cy.get('.modal [name="gpc_project_id"]').type('some_gpc_project_id');
        checkErrorMessage();
        cy.get('.modal [name="gpc_private_key_id"]').type('some_gpc_private_key_id');
        checkErrorMessage();
        cy.get('.modal [name="gpc_private_key"]').type('some_gpc_private_key');
        checkErrorMessage();
        cy.get('.modal [name="gpc_zone"]').type('some_gpc_zone');
        gotoNextStep();

        cy.contains('.modal .header', 'Summary');
    });

    it('should display information about not available plugins', () => {
        // mocks listing

        mockEmptyPluginsCatalog();
        mockEmptyPluginsManager();
        mockEmptySecretsManager();
        mockEmptyBlueprintsManager();

        cy.contains('.modal button', 'AWS').click();
        gotoNextStep();

        cy.contains('.modal .header', 'AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoNextStep();

        cy.contains('.modal .header', 'Summary');
        cy.contains('.modal', /cloudify-aws-plugin.*plugin is not found in catalog and manager/);
        cy.contains('.modal', /cloudify-utilities-plugin.*plugin is not found in catalog and manager/);
        cy.contains('.modal', /cloudify-kubernetes-plugin.*plugin is not found in catalog and manager/);
    });

    it('should keep button and field states for navigating beetwen steps', () => {
        mockEmptyPluginsCatalog();

        // cy.reload();

        cy.contains('.modal button', 'AWS').click();
        cy.contains('.modal button.active', 'AWS');
        gotoNextStep();

        cy.contains('.modal .header', 'AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').type('some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').type('some_aws_secret_access_key');
        gotoBackStep();

        cy.contains('.modal .header', 'Getting Started');
        cy.contains('.modal button', 'GCP').click();
        cy.contains('.modal button.active', 'AWS');
        cy.contains('.modal button.active', 'GCP');
        gotoNextStep();

        cy.contains('.modal .header', 'AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').should('have.value', 'some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').should('have.value', 'some_aws_secret_access_key');
        gotoNextStep();

        cy.contains('.modal .header', 'GCP Secrets');
        cy.get('.modal [name="gpc_client_x509_cert_url"]').type('some_gpc_client_x509_cert_url');
        cy.get('.modal [name="gpc_client_email"]').type('some_gpc_client_email');
        cy.get('.modal [name="gpc_client_id"]').type('some_gpc_client_id');
        cy.get('.modal [name="gpc_project_id"]').type('some_gpc_project_id');
        cy.get('.modal [name="gpc_private_key_id"]').type('some_gpc_private_key_id');
        cy.get('.modal [name="gpc_private_key"]').type('some_gpc_private_key');
        cy.get('.modal [name="gpc_zone"]').type('some_gpc_zone');
        gotoBackStep();

        cy.contains('.modal .header', 'AWS Secrets');
        cy.get('.modal [name="aws_access_key_id"]').should('have.value', 'some_aws_access_key_id');
        cy.get('.modal [name="aws_secret_access_key"]').should('have.value', 'some_aws_secret_access_key');
        gotoNextStep();

        cy.contains('.modal .header', 'GCP Secrets');
        cy.get('.modal [name="gpc_client_x509_cert_url"]').should('have.value', 'some_gpc_client_x509_cert_url');
        cy.get('.modal [name="gpc_client_email"]').should('have.value', 'some_gpc_client_email');
        cy.get('.modal [name="gpc_client_id"]').should('have.value', 'some_gpc_client_id');
        cy.get('.modal [name="gpc_project_id"]').should('have.value', 'some_gpc_project_id');
        cy.get('.modal [name="gpc_private_key_id"]').should('have.value', 'some_gpc_private_key_id');
        cy.get('.modal [name="gpc_private_key"]').should('have.value', 'some_gpc_private_key');
        cy.get('.modal [name="gpc_zone"]').should('have.value', 'some_gpc_zone');
    });
});
