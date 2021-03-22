import type { GettingStartedSchema } from './model';

const schema: GettingStartedSchema = [
    {
        name: 'aws',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
        label: 'AWS',
        plugins: [
            { name: 'cloudify-aws-plugin' },
            { name: 'cloudify-utilities-plugin' },
            { name: 'cloudify-kubernetes-plugin' }
        ],
        secrets: [
            {
                name: 'aws_access_key_id',
                label: 'AWS Access Key ID',
                type: 'text'
            },
            {
                name: 'aws_secret_access_key',
                label: 'AWS Secret Access Key',
                type: 'password'
            }
        ],
        blueprints: [
            {
                id: 'AWS-VM-Setup',
                name: 'AWS-Basics-VM-Setup',
                description: 'Basic examples - AWS infrastructure provisioning',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/virtual-machine/README.md',
                mainBlueprint: 'aws.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/aws.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-05-21T14:25:37Z'
            },
            {
                id: 'AWS-VM-Setup-CloudFormation',
                name: 'AWS-VM-Setup-using-CloudFormation',
                description: 'Orchestrate via other tools - Setup a VM in AWS using CloudFormation',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/virtual-machine/README.md',
                mainBlueprint: 'aws-cloudformation.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/cloudformation.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-07-21T14:25:37Z'
            },
            {
                // requires: cloudify-kubernetes-plugin
                id: 'Kubernetes-AWS-EKS',
                name: 'Kubernetes-AWS-EKS',
                description: 'Kubernetes: Setup a Kubernetes cluster in AWS leveraging EKS',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-aws-eks.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/kubernetes/README.md',
                mainBlueprint: 'blueprint.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/k8s.png',
                createdAt: '2019-10-19T12:44:56Z',
                updatedAt: '2020-07-16T17:26:16Z'
            }
        ]
    },
    {
        name: 'gpc',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/gcplogo.png',
        label: 'GCP',
        plugins: [
            { name: 'cloudify-gcp-plugin' },
            { name: 'cloudify-utilities-plugin' },
            { name: 'cloudify-ansible-plugin' },
            { name: 'cloudify-kubernetes-plugin' }
        ],
        secrets: [
            {
                name: 'gpc_client_x509_cert_url',
                label: 'gpc_client_x509_cert_url',
                type: 'text'
            },
            {
                name: 'gpc_client_email',
                label: 'gpc_client_email',
                type: 'text'
            },
            {
                name: 'gpc_client_id',
                label: 'gpc_client_id',
                type: 'text'
            },
            {
                name: 'gpc_project_id',
                label: 'gpc_project_id',
                type: 'password'
            },
            {
                name: 'gpc_private_key_id',
                label: 'gpc_private_key_id',
                type: 'password'
            },
            {
                name: 'gpc_private_key',
                label: 'gpc_private_key',
                type: 'password'
            },
            {
                name: 'gpc_zone',
                label: 'gpc_zone',
                type: 'password'
            }
        ],
        blueprints: [
            {
                id: 'GCP-VM-Setup',
                name: 'GCP-Basics-VM-Setup',
                description: 'Basic examples - GCP infrastructure provisioning',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/virtual-machine/README.md',
                mainBlueprint: 'gcp.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/gcplogo.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-05-21T14:25:37Z'
            },
            {
                // requires: cloudify-ansible-plugin
                id: 'GCP-Simple-Services-Setup',
                name: 'GCP-Basics-Simple-Service-Setup',
                description: 'Service examples: GCP simple service setup',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/hello-world-example',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/hello-world-example/README.md',
                mainBlueprint: 'gcp.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/gcplogo.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-07-21T14:25:37Z'
            },
            {
                // requires cloudify-kubernetes-plugin
                id: 'Kubernetes-GCP-GKE',
                name: 'Kubernetes-GCP-GKE',
                description: 'Kubernetes: Setup a Kubernetes cluster in GCP leveraging GKE',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-gcp-gke.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/kubernetes/README.md',
                mainBlueprint: 'blueprint.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/k8s.png',
                createdAt: '2019-10-19T12:44:56Z',
                updatedAt: '2020-07-16T17:26:16Z'
            }
        ]
    },
    // temporarily not used
    // {
    //     name: 'openstack_v2',
    //     logo: 'https://cloudify.co/wp-content/uploads/2019/08/oslogo.png',
    //     label: 'OpenStackV2',
    //     plugins: [{ name: 'cloudify-openstack-plugin', version: '^2\\.' }],
    //     secrets: [
    //         {
    //             name: 'openstack_username',
    //             label: 'OpenStack Username',
    //             type: 'text'
    //         },
    //         {
    //             name: 'openstack_password',
    //             label: 'Openstack Password',
    //             type: 'password'
    //         },
    //         {
    //             name: 'openstack_auth_url',
    //             label: 'OpenStack Auth Url',
    //             type: 'text'
    //         },
    //         {
    //             name: 'openstack_project_name',
    //             label: 'OpenStack Project Name',
    //             type: 'text'
    //         },
    //         {
    //             name: 'openstack_region',
    //             label: 'Openstack Region',
    //             type: 'text'
    //         }
    //     ],
    //     blueprints: []
    // },
    {
        name: 'openstack_v3',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/oslogo.png',
        label: 'OpenStackV3',
        plugins: [
            { name: 'cloudify-openstack-plugin', version: '^3\\.' },
            { name: 'cloudify-utilities-plugin' },
            { name: 'cloudify-ansible-plugin' }
        ],
        secrets: [
            {
                name: 'openstack_username',
                label: 'Openstack Username',
                type: 'text'
            },
            {
                name: 'openstack_password',
                label: 'Openstack Password',
                type: 'password'
            },
            {
                name: 'openstack_auth_url',
                label: 'Openstack Auth Url',
                type: 'text'
            },
            {
                name: 'openstack_project_name',
                label: 'Openstack Project Name',
                type: 'text'
            },
            {
                name: 'openstack_tenant_name',
                label: 'Openstack Tenant Name',
                type: 'text'
            }
        ],
        blueprints: [
            {
                id: 'OpenStack-VM-Setup',
                name: 'OpenStack-Basics-VM-Setup',
                description: 'Basic examples - OpenStack infrastructure provisioning',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/virtual-machine/README.md',
                mainBlueprint: 'openstack.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/oslogo.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-05-21T14:25:37Z'
            },
            {
                // requires cloudify-ansible-plugin
                id: 'OpenStack-Simple-Services-Setup',
                name: 'OpenStack-Basics-Simple-Service-Setup',
                description: 'Service examples: OpenStack simple service setup',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/hello-world-example',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/hello-world-example/README.md',
                mainBlueprint: 'openstack.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/oslogo.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-07-21T14:25:37Z'
            }
        ]
    },
    {
        name: 'azure',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/azurelogo.png',
        label: 'Azure',
        plugins: [
            { name: 'cloudify-azure-plugin' },
            { name: 'cloudify-utilities-plugin' },
            { name: 'cloudify-ansible-plugin' },
            { name: 'cloudify-kubernetes-plugin' }
        ],
        secrets: [
            {
                name: 'azure_subscription_id',
                label: 'Azure Subscription ID',
                type: 'text'
            },
            {
                name: 'azure_tenant_id',
                label: 'Azure Tenant ID',
                type: 'text'
            },
            {
                name: 'azure_client_id',
                label: 'Azure Client ID',
                type: 'text'
            },
            {
                name: 'azure_client_secret',
                label: 'Azure Client Secret',
                type: 'password'
            }
        ],
        blueprints: [
            {
                id: 'Azure-VM-Setup',
                name: 'Azure-Basics-VM-Setup',
                description: 'Basic examples - Azure infrastructure provisioning',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/virtual-machine/README.md',
                mainBlueprint: 'azure.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/azurelogo.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-05-21T14:25:37Z'
            },
            {
                // requires cloudify-ansible-plugin
                id: 'Azure-Simple-Services-Setup',
                name: 'Azure-Basics-Simple-Service-Setup',
                description: 'Service examples: Azure simple service setup',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/hello-world-example',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/hello-world-example/README.md',
                mainBlueprint: 'azure.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/azurelogo.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-07-21T14:25:37Z'
            },
            {
                // requires cloudify-utilities-plugin'
                id: 'Azure-VM-Setup-ARM',
                name: 'Azure-VM-Setup-using-ARM',
                description: 'Orchestrate via other tools - Setup a VM in Azure using Azure ARM',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/virtual-machine/README.md',
                mainBlueprint: 'azure-arm.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/arm.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-07-21T14:25:37Z'
            },
            {
                // requires cloudify-kubernetes-plugin
                id: 'Kubernetes-Azure-AKS',
                name: 'Kubernetes-Azure-AKS',
                description: 'Kubernetes: Setup a Kubernetes cluster in Azure leveraging AKS',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-azure-aks.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/kubernetes/README.md',
                mainBlueprint: 'blueprint.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/k8s.png',
                createdAt: '2019-10-19T12:44:56Z',
                updatedAt: '2020-07-16T17:26:16Z'
            }
        ]
    },
    {
        name: 'vcloud',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/vsphere.png',
        label: 'vCloud',
        plugins: [{ name: 'cloudify-vcloud-plugin' }],
        secrets: [
            {
                name: 'vcloud_user',
                label: 'vCloud User',
                type: 'text'
            },
            {
                name: 'vcloud_password',
                label: 'vCloud Password',
                type: 'password'
            },
            {
                name: 'vcloud_org',
                label: 'vCloud Organization',
                type: 'text'
            },
            {
                name: 'vcloud_uri',
                label: 'vCloud URI',
                type: 'text'
            },
            {
                name: 'vcloud_vdc',
                label: 'vCloud Virtual Data Center (vDC)',
                type: 'text'
            },
            {
                name: 'vcloud_gateway',
                label: 'vCloud Gateway',
                type: 'text'
            }
        ],
        blueprints: []
    },
    {
        name: 'vsphere',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/vsphere.png',
        label: 'vSphere',
        plugins: [{ name: 'cloudify-vsphere-plugin' }],
        secrets: [
            {
                name: 'vsphere_username',
                label: 'vSphere Username',
                type: 'text'
            },
            {
                name: 'vsphere_password',
                label: 'vSphere Password',
                type: 'password'
            },
            {
                name: 'vsphere_host',
                label: 'vSphere Host',
                type: 'text'
            },
            {
                name: 'vsphere_datacenter_nameas',
                label: 'vSphere Datacenter Nameas',
                type: 'text'
            },
            {
                name: 'vsphere_resource_pool_name',
                label: 'vSphere Resource Pool Name',
                type: 'text'
            },
            {
                name: 'vsphere_auto_placement',
                label: 'vSphere Auto Placement',
                type: 'text'
            }
        ],
        blueprints: []
    },
    {
        name: 'terraform_on_aws',
        logo: 'https://cloudify.co/wp-content/uploads/2020/07/terraform-icon.png',
        label: 'Terraform on AWS',
        plugins: [
            { name: 'cloudify-terraform-plugin' },
            { name: 'cloudify-aws-plugin' },
            { name: 'cloudify-utilities-plugin' }
        ],
        secrets: [
            {
                name: 'aws_access_key_id',
                label: 'AWS Access Key ID',
                type: 'text'
            },
            {
                name: 'aws_secret_access_key',
                label: 'AWS Secret Access Key',
                type: 'password'
            }
        ],
        blueprints: [
            {
                id: 'AWS-VM-Setup-Terraform',
                name: 'AWS-VM-Setup-using-Terraform',
                description: 'Orchestrate via other tools - Setup a VM in AWS using Terraform',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/virtual-machine/README.md',
                mainBlueprint: 'aws-terraform.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/TF.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-07-21T14:25:37Z'
            }
        ]
    },
    {
        name: 'ansible_on_aws',
        logo: 'https://cloudify.co/wp-content/uploads/2020/07/ansible-icon.png',
        label: 'Ansible on AWS',
        plugins: [
            { name: 'cloudify-ansible-plugin' },
            { name: 'cloudify-aws-plugin' },
            { name: 'cloudify-utilities-plugin' }
        ],
        secrets: [
            {
                name: 'aws_access_key_id',
                label: 'AWS Access Key ID',
                type: 'text'
            },
            {
                name: 'aws_secret_access_key',
                label: 'AWS Secret Access Key',
                type: 'password'
            }
        ],
        blueprints: [
            // moved from AWS
            {
                id: 'AWS-Simple-Services-Setup',
                name: 'AWS-Basics-Simple-Service-Setup',
                description: 'Service examples: AWS simple service setup',
                htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/hello-world-example',
                zipUrl:
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip',
                readmeUrl:
                    'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/hello-world-example/README.md',
                mainBlueprint: 'aws.yaml',
                imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/aws.png',
                createdAt: '2019-05-11T19:32:13Z',
                updatedAt: '2020-07-21T14:25:37Z'
            }
        ]
    }
    // in future will be enabled (requires blueprints)
    // {
    //     name: 'kubernetes',
    //     logo: 'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
    //     label: 'Kubernetes',
    //     plugins: [{ name: 'cloudify-kubernetes-plugin' }],
    //     secrets: [],
    //     blueprints: [
    //         {
    //             id: 'Kubernetes-Kubespray',
    //             name: 'kubernetes-Kubespray',
    //             description:
    //                 'Kubernetes: Setup a Kubernetes cluster in AWS, Azure, GCP or OpenStack using the Ansible Kubespray playbook.',
    //             htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes',
    //             zipUrl:
    //                 'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-kubespray.zip',
    //             readmeUrl:
    //                 'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/kubernetes/README.md',
    //             imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/k8s.png',
    //             createdAt: '2019-10-19T12:44:56Z',
    //             updatedAt: '2020-07-16T17:26:16Z'
    //         },
    //         {
    //             id: 'kubernetes-plugin-example',
    //             name: 'kubernetes-plugin-example',
    //             description: 'Deploy Sample Kubernetes Application',
    //             htmlUrl: 'https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes',
    //             zipUrl:
    //                 'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-plugin-examples-file-resource.zip',
    //             readmeUrl:
    //                 'https://raw.githubusercontent.com/cloudify-community/blueprint-examples/master/kubernetes/README.md',
    //             imageUrl: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/images/k8s.png',
    //             createdAt: '2019-10-19T12:44:56Z',
    //             updatedAt: '2020-05-16T17:26:16Z'
    //         }
    //     ]
    // }
];

export default schema;
