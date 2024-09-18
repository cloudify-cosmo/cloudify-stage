import { find } from 'lodash';
import type { PluginCatalogEntry } from 'backend/routes/Plugins.types';

export function getYamlUrls(plugin: Pick<PluginCatalogEntry, 'yaml_urls'>) {
    return plugin.yaml_urls.map(item => item.url);
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
    getYamlUrls
};
