import { find, last } from 'lodash';
import type { PluginCatalogEntry } from 'backend/routes/Plugins.types';

const latestDslVersion = 'cloudify_dsl_1_5';
export function getYamlUrl(plugin: Pick<PluginCatalogEntry, 'yaml_urls'>) {
    const latestDslYamlUrl = find(plugin.yaml_urls, { dsl_version: latestDslVersion })?.url;
    const fallbackYamlUrl = last(plugin.yaml_urls)!.url;

    return latestDslYamlUrl || fallbackYamlUrl;
}

const fallbackDistributionPrefix = 'manylinux';
export function getWagon(plugin: Pick<PluginCatalogEntry, 'wagon_urls'>, currentDistribution: string) {
    return (
        find(plugin.wagon_urls, wagon => wagon.release.toLowerCase() === currentDistribution) ??
        find(plugin.wagon_urls, wagon => wagon.release.toLowerCase().startsWith(fallbackDistributionPrefix))
    );
}

export default {
    getWagon,
    getYamlUrl
};
