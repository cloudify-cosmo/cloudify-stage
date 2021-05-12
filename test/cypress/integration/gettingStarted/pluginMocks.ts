import cloudifyAwsPluginItem from '../../fixtures/getting_started/plugins_catalog/cloudify_aws_plugin_item.json';
import cloudifyUtilitiesPluginItem from '../../fixtures/getting_started/plugins_catalog/cloudify_utilities_plugin_item.json';
import cloudifyKubernetesPluginItem from '../../fixtures/getting_started/plugins_catalog/cloudify_kubernetes_plugin_item.json';
import cloudifyTerraformPluginItem from '../../fixtures/getting_started/plugins_catalog/cloudify_terraform_plugin_item.json';
import cloudifyGcpPluginItem from '../../fixtures/getting_started/plugins_catalog/cloudify_gcp_plugin_item.json';
import cloudifyAnsiblePluginItem from '../../fixtures/getting_started/plugins_catalog/cloudify_ansible_plugin_item.json';

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
    mockPluginsCatalog([cloudifyAwsPluginItem, cloudifyUtilitiesPluginItem, cloudifyKubernetesPluginItem]);

export const mockAwsAndGcpPluginsCatalog = () =>
    mockPluginsCatalog([
        cloudifyAwsPluginItem,
        cloudifyUtilitiesPluginItem,
        cloudifyKubernetesPluginItem,
        cloudifyTerraformPluginItem,
        cloudifyGcpPluginItem,
        cloudifyAnsiblePluginItem
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
