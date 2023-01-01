import type { GetExternalContentQueryParams } from 'backend/routes/External.types';
import type { PostPluginsUploadQueryParams } from 'backend/routes/Plugins.types';
import type { PluginDescription, PluginDescriptionWithVersion, PluginUploadData } from './types';

interface UploadedPlugin {
    // NOTE: property names match from the backend ones
    title: string;
    // eslint-disable-next-line camelcase
    package_version: string;
}

export default class Actions {
    constructor(private readonly toolbox: Stage.Types.Toolbox, private readonly jsonPath: string) {}

    async doGetPluginsList(): Promise<PluginDescriptionWithVersion[]> {
        const pluginDescriptions = await this.doGetPluginsCatalogList();

        const uploadedPlugins: Stage.Types.PaginatedResponse<UploadedPlugin> = await this.toolbox
            .getManager()
            .doGet('/plugins?_include=title,package_version', {
                params: {
                    // eslint-disable-next-line camelcase
                    title: pluginDescriptions.map(({ display_name }) => display_name),
                    ...(this.toolbox.getContext().getValue('onlyMyResources')
                        ? { created_by: this.toolbox.getManager().getCurrentUsername() }
                        : {})
                }
            });

        const uploadedPluginsVersions = new Map(
            // eslint-disable-next-line camelcase
            uploadedPlugins.items.map(({ title, package_version }) => [title, package_version])
        );

        return pluginDescriptions.map(
            (pluginDescription): PluginDescriptionWithVersion => ({
                pluginDescription,
                uploadedVersion: uploadedPluginsVersions.get(pluginDescription.display_name)
            })
        );
    }

    private doGetPluginsCatalogList(): Promise<PluginDescription[]> {
        return this.toolbox
            .getInternal()
            .doGet<Response, GetExternalContentQueryParams>('/external/content', {
                params: { url: this.jsonPath },
                parseResponse: false
            })
            .then(response => response.json());
    }

    doUpload({ url: wagonUrl, yamlUrl, icon: iconUrl, title }: PluginUploadData) {
        const params = {
            visibility: Stage.Common.Consts.defaultVisibility,
            wagonUrl,
            yamlUrl,
            iconUrl,
            title
        };

        return this.toolbox
            .getInternal()
            .doUpload<any, PostPluginsUploadQueryParams>('/plugins/upload', { params, method: 'post' });
    }
}
