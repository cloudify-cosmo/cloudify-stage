export const mockBlueprintsManager = (items: any[]) =>
    cy.interceptSp(
        'GET',
        /^\/blueprints\?.*\b_include=(\bid\b|\bdescription\b|\bmain_file_name\b|\btenant_name\b|\bcreated_at\b|\bupdated_at\b|\bcreated_by\b|\bprivate_resource\b|\bvisibility\b|,)+/,
        {
            body: {
                metadata: { pagination: { total: items.length, size: 1000, offset: 0 }, filtered: null },
                items
            }
        }
    );

export const mockAwsBlueprintsManager = () =>
    mockBlueprintsManager([
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
    ]);

export const mockEmptyBlueprintsManager = () => mockBlueprintsManager([]);

export const mockBlueprintUpload = (
    blueprintName: string,
    applicationFileName: string,
    blueprintArchiveUrl: string
) => {
    const pathname = `/blueprints/${blueprintName}`;
    const query =
        `visibility=tenant&` +
        `async_upload=true&` +
        `application_file_name=${encodeURIComponent(applicationFileName)}&` +
        `blueprint_archive_url=${encodeURIComponent(blueprintArchiveUrl)}`;
    return cy.interceptSp('PUT', `${pathname}?${query}`, { body: { id: blueprintName, state: 'pending' } });
};

export const mockAwsBasicsVMSetupBlueprintUpload = () =>
    mockBlueprintUpload(
        'AWS-Basics-VM-Setup',
        'aws.yaml',
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip'
    );

export const mockAwsVMSetupUsingCloudFormationBlueprintUpload = () =>
    mockBlueprintUpload(
        'AWS-VM-Setup-using-CloudFormation',
        'aws-cloudformation.yaml',
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip'
    );

export const mockKubernetesAwsEksBlueprintUpload = () =>
    mockBlueprintUpload(
        'Kubernetes-AWS-EKS',
        'blueprint.yaml',
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-aws-eks.zip'
    );

export const mockAwsVMSetupUsingTerraformBlueprintUpload = () =>
    mockBlueprintUpload(
        'AWS-VM-Setup-using-Terraform',
        'aws-terraform.yaml',
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip'
    );

export const mockGcpBasicsVMSetupBlueprintUpload = () =>
    mockBlueprintUpload(
        'GCP-Basics-VM-Setup',
        'gcp.yaml',
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip'
    );

export const mockGcpBasicsSimpleServiceSetupBlueprintUpload = () =>
    mockBlueprintUpload(
        'GCP-Basics-Simple-Service-Setup',
        'gcp.yaml',
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip'
    );

export const mockKubernetesGcpGkeBlueprintUpload = () =>
    mockBlueprintUpload(
        'Kubernetes-GCP-GKE',
        'blueprint.yaml',
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-gcp-gke.zip'
    );

export const mockBlueprintUploaded = (blueprintName: string) =>
    cy.interceptSp('GET', `/blueprints/${blueprintName}`, {
        body: { id: blueprintName, state: 'uploaded' }
    });
