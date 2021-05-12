export const mockAwsBlueprintsManager = () =>
    cy.interceptSp(
        'GET',
        '/blueprints?_include=id%2Cdescription%2Cmain_file_name%2Ctenant_name%2Ccreated_at%2Cupdated_at%2Ccreated_by%2Cprivate_resource%2Cvisibility',
        {
            body: {
                metadata: { pagination: { total: 3, size: 50, offset: 0 }, filtered: null },
                items: [
                    {
                        id: 'AWS-VM-Setup-using-CloudFormation',
                        visibility: 'tenant',
                        created_at: '2021-05-07T10:06:31.799Z',
                        main_file_name: 'aws-cloudformation.yaml',
                        updated_at: '2021-05-07T10:07:56.697Z',
                        description: null,
                        tenant_name: 'default_tenant',
                        created_by: 'admin',
                        private_resource: false
                    },
                    {
                        id: 'AWS-Basics-VM-Setup',
                        visibility: 'tenant',
                        created_at: '2021-05-07T10:06:31.792Z',
                        main_file_name: 'aws.yaml',
                        updated_at: '2021-05-07T10:07:54.715Z',
                        description: 'This blueprint creates an AWS infrastructure environment.\n',
                        tenant_name: 'default_tenant',
                        created_by: 'admin',
                        private_resource: false
                    },
                    {
                        id: 'Kubernetes-AWS-EKS',
                        visibility: 'tenant',
                        created_at: '2021-05-07T10:06:31.785Z',
                        main_file_name: 'blueprint.yaml',
                        updated_at: '2021-05-07T10:08:04.632Z',
                        description: null,
                        tenant_name: 'default_tenant',
                        created_by: 'admin',
                        private_resource: false
                    }
                ]
            }
        }
    );

export const mockAwsBasicsVMSetupBlueprintUpload = () =>
    cy.interceptSp(
        'PUT',
        '/blueprints/AWS-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=aws.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
        { body: { id: 'AWS-Basics-VM-Setup', state: 'pending' } }
    );

export const mockAwsVMSetupUsingCloudFormationBlueprintUpload = () =>
    cy.interceptSp(
        'PUT',
        '/blueprints/AWS-VM-Setup-using-CloudFormation?visibility=tenant&async_upload=true&application_file_name=aws-cloudformation.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
        { body: { id: 'AWS-VM-Setup-using-CloudFormation', state: 'pending' } }
    );

export const mockKubernetesAwsEksBlueprintUpload = () =>
    cy.interceptSp(
        'PUT',
        '/blueprints/Kubernetes-AWS-EKS?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-aws-eks.zip',
        { body: { id: 'Kubernetes-AWS-EKS', state: 'pending' } }
    );

export const mockAwsVMSetupUsingTerraformBlueprintUpload = () =>
    cy.interceptSp(
        'PUT',
        '/blueprints/AWS-VM-Setup-using-Terraform?visibility=tenant&async_upload=true&application_file_name=aws-terraform.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
        { body: { id: '', state: 'pending' } }
    );

export const mockGcpBasicsVMSetupBlueprintUpload = () =>
    cy.interceptSp(
        'PUT',
        '/blueprints/GCP-Basics-VM-Setup?visibility=tenant&async_upload=true&application_file_name=gcp.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fvirtual-machine.zip',
        { body: { id: '', state: 'pending' } }
    );

export const mockGcpBasicsSimpleServiceSetupBlueprintUpload = () =>
    cy.interceptSp(
        'PUT',
        '/blueprints/GCP-Basics-Simple-Service-Setup?visibility=tenant&async_upload=true&application_file_name=gcp.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fhello-world-example.zip',
        { body: { id: '', state: 'pending' } }
    );

export const mockKubernetesGcpGkeBlueprintUpload = () =>
    cy.interceptSp(
        'PUT',
        '/blueprints/Kubernetes-GCP-GKE?visibility=tenant&async_upload=true&application_file_name=blueprint.yaml&blueprint_archive_url=https%3A%2F%2Fgithub.com%2Fcloudify-community%2Fblueprint-examples%2Freleases%2Fdownload%2Flatest%2Fkubernetes-gcp-gke.zip',
        { body: { id: '', state: 'pending' } }
    );

export const mockEmptyBlueprintsManager = () =>
    cy.interceptSp(
        'GET',
        '/blueprints?_include=id%2Cdescription%2Cmain_file_name%2Ctenant_name%2Ccreated_at%2Cupdated_at%2Ccreated_by%2Cprivate_resource%2Cvisibility',
        {
            body: {
                metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null },
                items: []
            }
        }
    );

export const mockBlueprintUploaded = (blueprintName: string) =>
    cy.interceptSp('GET', `/blueprints/${blueprintName}`, {
        body: { id: blueprintName, state: 'uploaded' }
    });
