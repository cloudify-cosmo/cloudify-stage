const schema = [
    {
        name: 'aws',
        logo: 'https://path/to/logo.svg',
        label: 'AWS',
        plugins: ['', ''],
        secrets: [
            {
                name: 'aws_access_key_id',
                label: 'aws_access_key_id',
                type: 'text'
            },
            {
                name: 'aws_secret_access_key',
                label: 'aws_secret_access_key',
                type: 'password'
            }
        ]
    },
    {
        name: 'terraform_on_aws',
        logo: 'https://path/to/logo.svg',
        label: 'Terraform on AWS',
        plugins: ['', ''],
        secrets: [
            {
                name: 'aws_access_key_id',
                label: 'aws_access_key_id',
                type: 'text'
            },
            {
                name: 'aws_secret_access_key',
                label: 'aws_secret_access_key',
                type: 'password'
            }
        ]
    },
    {
        name: 'ansible_on_aws',
        logo: 'https://path/to/logo.svg',
        label: 'Ansible on AWS',
        plugins: ['', ''],
        secrets: [
            {
                name: 'aws_access_key_id',
                label: 'aws_access_key_id',
                type: 'text'
            },
            {
                name: 'aws_secret_access_key',
                label: 'aws_secret_access_key',
                type: 'password'
            }
        ]
    },
    {
        name: 'azure',
        logo: 'https://path/to/logo.svg',
        label: 'Azure',
        plugins: ['', ''],
        secrets: [
            {
                name: 'azure_subscription_id',
                label: 'azure_subscription_id',
                type: 'text'
            },
            {
                name: 'azure_tenant_id',
                label: 'azure_tenant_id',
                type: 'text'
            },
            {
                name: 'azure_client_id',
                label: 'azure_client_id',
                type: 'text'
            },
            {
                name: 'azure_client_secret',
                label: 'azure_client_secret',
                type: 'password'
            }
        ]
    },
    {
        name: 'gpc',
        logo: 'https://path/to/logo.svg',
        label: 'GCP',
        plugins: ['', ''],
        secrets: [
            // "TODO": from https://alexmolev646772.invisionapp.com/console/Tech-Getting-Started-cklf31m3w03fc013o0agh3mf1/cklf31n0t01j90139cctpeypa/play
            {
                name: '',
                label: '',
                type: 'text'
            }
        ]
    },
    {
        name: 'openstack_v2',
        logo: 'https://path/to/logo.svg',
        label: 'OpenStackV2',
        plugins: ['', ''],
        secrets: [
            {
                name: 'openstack_username',
                label: 'openstack_username',
                type: 'text'
            },
            {
                name: 'openstack_password',
                label: 'openstack_password',
                type: 'password'
            },
            {
                name: 'openstack_auth_url',
                label: 'openstack_auth_url',
                type: 'text'
            },
            {
                name: 'openstack_project_name',
                label: 'openstack_project_name',
                type: 'text'
            },
            {
                name: 'openstack_region',
                label: 'openstack_region',
                type: 'text'
            }
        ]
    },
    {
        name: 'openstack_v3',
        logo: 'https://path/to/logo.svg',
        label: 'OpenStackV3',
        plugins: ['', ''],
        secrets: [
            {
                name: 'openstack_username',
                label: 'openstack_username',
                type: 'text'
            },
            {
                name: 'openstack_password',
                label: 'openstack_password',
                type: 'password'
            },
            {
                name: 'openstack_auth_url',
                label: 'openstack_auth_url',
                type: 'text'
            },
            {
                name: 'openstack_project_name',
                label: 'openstack_project_name',
                type: 'text'
            },
            {
                name: 'openstack_tenant_name',
                label: 'openstack_tenant_name',
                type: 'text'
            }
        ]
    },
    {
        name: 'vcloud',
        logo: 'https://path/to/logo.svg',
        label: 'VCloud',
        plugins: ['', ''],
        secrets: [
            {
                name: 'vcloud_user',
                label: 'vcloud_user',
                type: 'text'
            },
            {
                name: 'vcloud_password',
                label: 'vcloud_password',
                type: 'password'
            },
            {
                name: 'vcloud_org',
                label: 'vcloud_org',
                type: 'text'
            },
            {
                name: 'vcloud_uri',
                label: 'vcloud_uri',
                type: 'text'
            },
            {
                name: 'vcloud_vdc',
                label: 'vcloud_vdc',
                type: 'text'
            },
            {
                name: 'vcloud_gateway',
                label: 'vcloud_gateway',
                type: 'text'
            }
        ]
    },
    {
        name: 'vsphere',
        logo: 'https://path/to/logo.svg',
        label: 'VSphere',
        plugins: ['', ''],
        secrets: [
            {
                name: 'vsphere_username',
                label: 'vsphere_username',
                type: 'text'
            },
            {
                name: 'vsphere_password',
                label: 'vsphere_password',
                type: 'password'
            },
            {
                name: 'vsphere_host',
                label: 'vsphere_host',
                type: 'text'
            },
            {
                name: 'vsphere_datacenter_nameas',
                label: 'vsphere_datacenter_nameas',
                type: 'text'
            },
            {
                name: 'vsphere_resource_pool_name',
                label: 'vsphere_resource_pool_name',
                type: 'text'
            },
            {
                name: 'vsphere_auto_placement',
                label: 'vsphere_auto_placement',
                type: 'text'
            }
        ]
    }
];

export default schema;
