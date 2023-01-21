import type { PostPluginsUploadQueryParams } from 'backend/routes/Plugins.types';

export type ResourceName = 'wagon' | 'yaml' | 'icon';
export type Resources = Record<
    ResourceName,
    {
        url: string;
        file: unknown;
    }
>;

class PluginActions {
    constructor(private readonly toolbox: Stage.Types.Toolbox) {}

    doDelete(plugin: { id: string }, force = true) {
        return this.toolbox.getManager().doDelete(`/plugins/${plugin.id}`, { body: { force } });
    }

    doUpload(visibility: string, title: string, resources: Resources) {
        const params: PostPluginsUploadQueryParams = { visibility, title };
        const files: Record<string, unknown> = {};

        _.each(resources, ({ url, file }, name) => {
            const paramName = `${name}Url` as keyof PostPluginsUploadQueryParams;
            if (file) {
                params[paramName] = '';
                files[`${name}_file`] = file;
            } else if (!_.isEmpty(url)) {
                params[paramName] = url;
            }
        });

        return this.toolbox.getInternal().doUpload<any, PostPluginsUploadQueryParams>('/plugins/upload', {
            params,
            files: !_.isEmpty(files) ? files : undefined,
            method: 'post'
        });
    }

    // eslint-disable-next-line camelcase
    doDownload(plugin: { id: string; package_name: string; package_version: string }) {
        const pluginDownloadUrl = `/plugins/${plugin.id}/archive`;
        const pluginFileName = `${plugin.package_name}_${plugin.package_version}.zip`;

        return this.toolbox.getManager().doDownload(pluginDownloadUrl, pluginFileName);
    }

    doSetVisibility(pluginId: string, visibility: string) {
        return this.toolbox.getManager().doPatch(`/plugins/${pluginId}/set-visibility`, { body: { visibility } });
    }
}

export default PluginActions;
