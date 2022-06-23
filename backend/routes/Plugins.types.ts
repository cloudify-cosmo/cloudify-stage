/* eslint-disable camelcase */

export interface PluginWagonUrl {
    arch: string;
    file_size: string;
    release: string;
    url: string;
}

export interface PluginYamlUrl {
    dsl_version: string;
    url: string;
}

export interface PluginCatalogEntry {
    name: string;
    display_name: string;
    version: string;
    logo_url: string;
    description: string;
    wagon_urls: PluginWagonUrl[];
    yaml_urls: PluginYamlUrl[];
}

export interface PluginEntry {
    visibility: string;
    distribution: string;
    package_name: string;
    package_version: string;
}
