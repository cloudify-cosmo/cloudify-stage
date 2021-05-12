const createCloudifyAwsPluginItem = () => ({
    description: 'A Cloudify Plugin that provisions resources in AWS',
    releases: 'https://github.com/cloudify-cosmo/cloudify-aws-plugin/releases',
    title: 'AWS',
    version: '2.8.0',
    link: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/plugin.yaml',
    wagons: [
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Centos Core'
        },
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Redhat Maipo'
        }
    ],
    icon: 'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
    name: 'cloudify-aws-plugin'
});

const createCloudifyUtilitiesPluginItem = () => ({
    description: 'Various extension utilities, including REST API',
    releases: 'https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases',
    title: 'Utilities',
    version: '1.24.4',
    link: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/plugin.yaml',
    wagons: [
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Centos Core'
        },
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Redhat Maipo'
        }
    ],
    icon: 'https://cloudify.co/wp-content/uploads/2019/08/pluginlogo.png',
    name: 'cloudify-utilities-plugin'
});

const createCloudifyKubernetesPluginItem = () => ({
    description: 'Cloudify plugin for packaging Kubernetes microservices in Cloudify blueprints',
    releases: 'https://github.com/cloudify-cosmo/cloudify-kubernetes-plugin/releases',
    title: 'Kubernetes',
    version: '2.12.1',
    link: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/plugin.yaml',
    wagons: [
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn.md5',
            name: 'Centos Core'
        },
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-redhat-Maipo-py36-none-linux_x86_64.wgn.md5',
            name: 'Redhat Maipo'
        }
    ],
    icon: 'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
    name: 'cloudify-kubernetes-plugin'
});

const createCloudifyTerraformPluginItem = () => ({
    description: 'Deploy and manage Cloud resources with Terraform.',
    releases: 'https://github.com/cloudify-cosmo/cloudify-terraform-plugin/releases',
    title: 'Terraform',
    version: '0.16.0',
    link: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/plugin.yaml',
    wagons: [
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-centos-Core-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Centos Core'
        },
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Redhat Maipo'
        }
    ],
    icon: 'https://cloudify.co/wp-content/uploads/2020/07/terraform-icon.png',
    name: 'cloudify-terraform-plugin'
});

const createCloudifyGcpPluginItem = () => ({
    description: 'A Cloudify Plugin that provisions resources in Google Cloud Platform',
    releases: 'https://github.com/cloudify-cosmo/cloudify-gcp-plugin/releases',
    title: 'GCP',
    version: '1.7.0',
    link: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/plugin.yaml',
    wagons: [
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-centos-Core-py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-centos-Core-py36-none-linux_x86_64.wgn.md5',
            name: 'Centos Core'
        },
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-redhat-Maipo-py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-redhat-Maipo-py36-none-linux_x86_64.wgn.md5',
            name: 'Redhat Maipo'
        }
    ],
    icon: 'https://cloudify.co/wp-content/uploads/2019/08/gcplogo.png',
    name: 'cloudify-gcp-plugin'
});

const createCloudifyAnsiblePluginItem = () => ({
    description: 'The Ansible plugin can be used to run Ansible Playbooks',
    releases: 'https://github.com/cloudify-cosmo/cloudify-ansible-plugin/releases',
    title: 'Ansible',
    version: '2.10.1',
    link: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/plugin.yaml',
    wagons: [
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-centos-Core-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-centos-Core-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Centos Core'
        },
        {
            url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-redhat-Maipo-py27.py36-none-linux_x86_64.wgn',
            md5url:
                'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-redhat-Maipo-py27.py36-none-linux_x86_64.wgn.md5',
            name: 'Redhat Maipo'
        }
    ],
    icon: 'https://cloudify.co/wp-content/uploads/2020/07/ansible-icon.png',
    name: 'cloudify-ansible-plugin'
});

export const mockPluginsCatalog = (body: any[]) =>
    cy.intercept(
        {
            method: 'GET',
            pathname: '/console/external/content',
            query: {
                url: 'http://repository.cloudifysource.org/cloudify/wagons/plugins.json'
            }
        },
        { body }
    );

export const mockEmptyPluginsCatalog = () => mockPluginsCatalog([]);

export const mockAwsPluginsCatalog = () =>
    mockPluginsCatalog([
        createCloudifyAwsPluginItem(),
        createCloudifyUtilitiesPluginItem(),
        createCloudifyKubernetesPluginItem()
    ]);

export const mockAwsAndGcpPluginsCatalog = () =>
    mockPluginsCatalog([
        createCloudifyAwsPluginItem(),
        createCloudifyUtilitiesPluginItem(),
        createCloudifyKubernetesPluginItem(),
        createCloudifyTerraformPluginItem(),
        createCloudifyGcpPluginItem(),
        createCloudifyAnsiblePluginItem()
    ]);

export const mockPluginsManager = (items: any[]) =>
    cy.interceptSp(
        'GET',
        /^\/plugins\?.*\b_include=(\bdistribution\b|\bpackage_name\b|\bpackage_version\b|\bvisibility\b|,)+/,
        { body: { metadata: { pagination: { total: items.length, size: 1000, offset: 0 }, filtered: null }, items } }
    );

export const mockEmptyPluginsManager = () => mockPluginsManager([]);

export const mockAwsPluginsManager = () =>
    mockPluginsManager([
        {
            visibility: 'tenant',
            distribution: 'centos',
            package_name: 'cloudify-kubernetes-plugin',
            package_version: '2.12.1'
        },
        {
            visibility: 'tenant',
            distribution: 'centos',
            package_name: 'cloudify-utilities-plugin',
            package_version: '1.24.4'
        },
        {
            visibility: 'tenant',
            distribution: 'centos',
            package_name: 'cloudify-aws-plugin',
            package_version: '2.8.0'
        }
    ]);

export const mockPluginUpload = (pluginTitle: string, iconUrl: string, yamlUrl: string, wagonUrl: string) =>
    cy.intercept(
        {
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: { visibility: 'tenant', title: pluginTitle, iconUrl, yamlUrl, wagonUrl }
        },
        { body: {} }
    );

export const mockCloudifyAwsPluginUpload = () =>
    mockPluginUpload(
        'AWS',
        'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/plugin.yaml',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn'
    );

export const mockCloudifyUtilitiesPluginUpload = () =>
    mockPluginUpload(
        'Utilities',
        'https://cloudify.co/wp-content/uploads/2019/08/pluginlogo.png',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/plugin.yaml',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn'
    );

export const mockCloudifyKubernetesPluginUpload = () =>
    mockPluginUpload(
        'Kubernetes',
        'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/plugin.yaml',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn'
    );

export const mockCloudifyTerraformPluginUpload = () =>
    mockPluginUpload(
        'Terraform',
        'https://cloudify.co/wp-content/uploads/2020/07/terraform-icon.png',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/plugin.yaml',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-centos-Core-py27.py36-none-linux_x86_64.wgn'
    );

export const mockCloudifyGcpPluginUpload = () =>
    mockPluginUpload(
        'GCP',
        'https://cloudify.co/wp-content/uploads/2019/08/gcplogo.png',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/plugin.yaml',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-centos-Core-py36-none-linux_x86_64.wgn'
    );

export const mockCloudifyAnsiblePluginUpload = () =>
    mockPluginUpload(
        'Ansible',
        'https://cloudify.co/wp-content/uploads/2020/07/ansible-icon.png',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/plugin.yaml',
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-centos-Core-py27.py36-none-linux_x86_64.wgn'
    );
