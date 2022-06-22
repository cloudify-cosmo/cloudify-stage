/* eslint-disable camelcase */

export interface PluginWagon {
    arch: string;
    file_size: string;
    release: string;
    url: string;
}

export interface PluginYaml {
    dsl_version: string;
    url: string;
}

export interface PluginCatalogEntry {
    name: string;
    display_name: string;
    version: string;
    logo_url: string;
    description: string;
    wagon_urls: PluginWagon[];
    yaml_urls: PluginYaml[];
}

export interface PluginEntry {
    visibility: string;
    distribution: string;
    package_name: string;
    package_version: string;
}
