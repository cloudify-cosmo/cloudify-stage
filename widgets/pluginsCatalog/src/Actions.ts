import type { PluginDescription, PluginDescriptionWithVersion, PluginUploadData } from './types';

interface UploadedPlugin {
    // NOTE: property names match from the backend ones
    /* eslint-disable camelcase */
    package_name: string;
    package_version: string;
    /* eslint-disable camelcase */
}

export default class Actions {
    constructor(private readonly toolbox: Stage.Types.Toolbox, private readonly jsonPath: string) {}

    async doGetPluginsList(): Promise<PluginDescriptionWithVersion[]> {
        const pluginDescriptions = await this.doGetPluginsCatalogList();

        const uploadedPlugins: Stage.Types.PaginatedResponse<UploadedPlugin> = await this.toolbox
            .getManager()
            .doGet('/plugins?_include=package_name,package_version', {
                params: {
                    package_name: pluginDescriptions.map(({ name }) => name),
                    ...(this.toolbox.getContext().getValue('onlyMyResources')
                        ? { created_by: this.toolbox.getManager().getCurrentUsername() }
                        : {})
                }
            });

        const uploadedPluginsVersions = new Map(
            // eslint-disable-next-line camelcase
            uploadedPlugins.items.map(({ package_name, package_version }) => [package_name, package_version])
        );

        return pluginDescriptions.map(
            (pluginDescription): PluginDescriptionWithVersion => ({
                pluginDescription,
                uploadedVersion: uploadedPluginsVersions.get(pluginDescription.name)
            })
        );
    }

    private doGetPluginsCatalogList(): Promise<PluginDescription[]> {
        return this.toolbox
            .getInternal()
            .doGet('/external/content', { params: { url: this.jsonPath }, parseResponse: false })
            .then(response => response.json());
    }

    doUpload({ url: wagonUrl, yamlUrl, icon: iconUrl, title }: PluginUploadData) {
        const params = {
            visibility: 'tenant',
            wagonUrl,
            yamlUrl,
            iconUrl,
            title
        };

        return this.toolbox.getInternal().doUpload('/plugins/upload', { params, method: 'post' });
    }
}
