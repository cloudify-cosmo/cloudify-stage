import { getWagon, getYamlUrls } from 'utils/shared/PluginUtils';
import type { PluginWagonUrl, PluginYamlUrl } from 'backend/routes/Plugins.types';

describe('(Utils) PluginUtils', () => {
    describe('getWagon', () => {
        const manylinuxWagon: PluginWagonUrl = {
            release: 'manylinux',
            arch: 'x86_64',
            url: 'https://github.com/cloudify-cosmo/cloudify-azure-plugin/releases/download/3.8.6/cloudify_azure_plugin-3.8.6-manylinux-py311-none-linux_x86_64.wgn',
            file_size: 49484085
        };
        const centosWagon: PluginWagonUrl = {
            release: 'Centos Core',
            arch: 'x86_64',
            url: 'https://github.com/cloudify-cosmo/cloudify-azure-plugin/releases/download/3.8.6/cloudify_azure_plugin-3.8.6-centos-Core-py36-none-linux_x86_64.wgn',
            file_size: 49317355
        };
        const wagonUrls: PluginWagonUrl[] = [manylinuxWagon, centosWagon];

        it('should return exact match if found', () => {
            expect(getWagon({ wagon_urls: wagonUrls }, 'centos core')).toEqual(centosWagon);
            expect(getWagon({ wagon_urls: wagonUrls }, 'manylinux')).toEqual(manylinuxWagon);
        });

        it('should return fallback match if available', () => {
            expect(getWagon({ wagon_urls: wagonUrls }, 'debian')).toEqual(manylinuxWagon);
        });

        it('should return undefined if no match found', () => {
            expect(getWagon({ wagon_urls: [] }, 'manylinux')).toEqual(undefined);
        });
    });

    describe('getYamlUrls', () => {
        const dsl14Yaml: PluginYamlUrl = {
            dsl_version: 'cloudify_dsl_1_4',
            url: 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/3.3.6/plugin_1_4.yaml'
        };
        const dsl15Yaml: PluginYamlUrl = {
            dsl_version: 'cloudify_dsl_1_5',
            url: 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/3.3.6/plugin_1_5.yaml'
        };
        const futureDslYaml: PluginYamlUrl = {
            dsl_version: 'cloudify_dsl_future',
            url: 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases/download/3.3.6/plugin_future.yaml'
        };

        it('should return YAML URLs', () => {
            const yamlUrls = [dsl14Yaml.url, dsl15Yaml.url, futureDslYaml.url];
            expect(getYamlUrls({ yaml_urls: [dsl14Yaml, dsl15Yaml, futureDslYaml] })).toEqual(yamlUrls);
        });
    });
});
