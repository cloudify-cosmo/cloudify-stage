import { find, last } from 'lodash';
import type { PluginCatalogEntry } from 'backend/routes/Plugins.types';

export function getYamlUrl(plugin: Pick<PluginCatalogEntry, 'yaml_urls'>) {
    const latestDslVersion = 'cloudify_dsl_1_4';
    const latestDslYamlUrl = find(plugin.yaml_urls, { dsl_version: latestDslVersion })?.url;
    const fallbackYamlUrl = last(plugin.yaml_urls)!.url;

    return latestDslYamlUrl || fallbackYamlUrl;
}

export function getWagon(plugin: Pick<PluginCatalogEntry, 'wagon_urls'>, currentDistribution: string) {
    return find(plugin.wagon_urls, wagon => {
        const lowerCasedRelease = wagon.release.toLowerCase();
        return lowerCasedRelease === currentDistribution || lowerCasedRelease === 'any';
    });
}

export default {
    getWagon,
    getYamlUrl
};
