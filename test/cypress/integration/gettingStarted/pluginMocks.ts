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

export const mockEmptyPluginsManager = () =>
    cy.interceptSp('GET', '/plugins?_include=distribution,package_name,package_version,visibility', {
        body: { metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] }
    });

export const mockAwsPluginsManager = () =>
    cy.interceptSp('GET', '/plugins?_include=distribution,package_name,package_version,visibility', {
        body: {
            metadata: { pagination: { total: 3, size: 1000, offset: 0 }, filtered: null },
            items: [
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
            ]
        }
    });

export const mockCloudifyAwsPluginUpload = () =>
    cy.intercept(
        {
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: {
                visibility: 'tenant',
                title: 'AWS',
                iconUrl: 'https://cloudify.co/wp-content/uploads/2019/08/aws-1.png',
                yamlUrl: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/plugin.yaml',
                wagonUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/2.8.0/cloudify_aws_plugin-2.8.0-centos-Core-py27.py36-none-linux_x86_64.wgn'
            }
        },
        { body: { id: '471ba867-5188-4ecc-b4f9-0a30883ef9f6' } }
    );

export const mockCloudifyUtilitiesPluginUpload = () =>
    cy.intercept(
        {
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: {
                visibility: 'tenant',
                title: 'Utilities',
                iconUrl: 'https://cloudify.co/wp-content/uploads/2019/08/pluginlogo.png',
                yamlUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/plugin.yaml',
                wagonUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-utilities-plugin/1.24.4/cloudify_utilities_plugin-1.24.4-centos-Core-py27.py36-none-linux_x86_64.wgn'
            }
        },
        { body: { id: '7be1e257-1f8f-48f6-9b6b-5447a3432018' } }
    );

export const mockCloudifyKubernetesPluginUpload = () =>
    cy.intercept(
        {
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: {
                visibility: 'tenant',
                title: 'Kubernetes',
                iconUrl: 'https://cloudify.co/wp-content/uploads/2020/07/kube-icon.png',
                yamlUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/plugin.yaml',
                wagonUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-kubernetes-plugin/2.12.1/cloudify_kubernetes_plugin-2.12.1-centos-Core-py36-none-linux_x86_64.wgn'
            }
        },
        { body: { id: 'b3ae9933-32f3-4440-b121-5b3a44588442' } }
    );

export const mockCloudifyTerraformPluginUpload = () =>
    cy.intercept(
        {
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: {
                visibility: 'tenant',
                title: 'Terraform',
                iconUrl: 'https://cloudify.co/wp-content/uploads/2020/07/terraform-icon.png',
                yamlUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/plugin.yaml',
                wagonUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.16.0/cloudify_terraform_plugin-0.16.0-centos-Core-py27.py36-none-linux_x86_64.wgn'
            }
        },
        { body: { id: '44d6e242-35d1-4e44-850f-6b2a922fd220' } }
    );

export const mockCloudifyGcpPluginUpload = () =>
    cy.intercept(
        {
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: {
                visibility: 'tenant',
                title: 'GCP',
                iconUrl: 'https://cloudify.co/wp-content/uploads/2019/08/gcplogo.png',
                yamlUrl: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/plugin.yaml',
                wagonUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-gcp-plugin/1.7.0/cloudify_gcp_plugin-1.7.0-centos-Core-py36-none-linux_x86_64.wgn'
            }
        },
        { body: { id: 'b96b35be-77e4-4ff6-b66b-b342f11565fb' } }
    );

export const mockCloudifyAnsiblePluginUpload = () =>
    cy.intercept(
        {
            method: 'POST',
            pathname: '/console/plugins/upload',
            query: {
                visibility: 'tenant',
                title: 'Ansible',
                iconUrl: 'https://cloudify.co/wp-content/uploads/2020/07/ansible-icon.png',
                yamlUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/plugin.yaml',
                wagonUrl:
                    'http://repository.cloudifysource.org/cloudify/wagons/cloudify-ansible-plugin/2.10.1/cloudify_ansible_plugin-2.10.1-centos-Core-py27.py36-none-linux_x86_64.wgn'
            }
        },
        { body: { id: '07790312-9e3b-4072-84a6-5898a2e8d9b0' } }
    );
