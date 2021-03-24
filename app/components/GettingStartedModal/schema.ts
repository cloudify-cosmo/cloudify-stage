import type { GettingStartedSchema } from './model';

const schema: GettingStartedSchema = [
    {
        name: 'aws',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
        label: 'AWS',
        plugins: [{ name: 'cloudify-aws-plugin' }],
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
        ]
    },
    {
        name: 'gpc',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/gcplogo.png',
        label: 'GCP',
        plugins: [{ name: 'cloudify-gcp-plugin' }],
        secrets: [
            {
                name: 'gpc_client_x509_cert_url',
                label: 'GCP Client_x509 Certificate URL',
                type: 'text'
            },
            {
                name: 'gpc_client_email',
                label: 'GCP Client E-mail',
                type: 'text'
            },
            {
                name: 'gpc_client_id',
                label: 'GCP Client ID',
                type: 'text'
            },
            {
                name: 'gpc_project_id',
                label: 'GCP Project ID',
                type: 'password'
            },
            {
                name: 'gpc_private_key_id',
                label: 'GCP Private Key ID',
                type: 'password'
            },
            {
                name: 'gpc_private_key',
                label: 'GCP Private Key',
                type: 'password'
            },
            {
                name: 'gpc_zone',
                label: 'GCP Zone',
                type: 'password'
            }
        ]
    },
    {
        name: 'openstack_v3',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/oslogo.png',
        label: 'OpenStackV3',
        plugins: [{ name: 'cloudify-openstack-plugin', version: '^3\\.' }],
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
        ]
    },
    {
        name: 'azure',
        logo: 'https://cloudify.co/wp-content/uploads/2019/08/azurelogo.png',
        label: 'Azure',
        plugins: [{ name: 'cloudify-azure-plugin' }],
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
        ]
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
        ]
    },
    {
        name: 'terraform_on_aws',
        logo: 'https://cloudify.co/wp-content/uploads/2020/07/terraform-icon.png',
        label: 'Terraform on AWS',
        plugins: [{ name: 'cloudify-terraform-plugin' }, { name: 'cloudify-aws-plugin' }],
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
        ]
    },
    {
        name: 'ansible_on_aws',
        logo: 'https://cloudify.co/wp-content/uploads/2020/07/ansible-icon.png',
        label: 'Ansible on AWS',
        plugins: [{ name: 'cloudify-ansible-plugin' }, { name: 'cloudify-aws-plugin' }],
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
        ]
    }
];

export default schema;
