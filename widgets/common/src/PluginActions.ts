export {};

class PluginActions {
    constructor(private readonly toolbox: Stage.Types.Toolbox) {}

    doDelete(plugin: { id: string }, force = true) {
        return this.toolbox.getManager().doDelete(`/plugins/${plugin.id}`, { body: { force } });
    }

    doUpload(visibility: string, title: string, resources: Record<string, { url: string; file: unknown }>) {
        const params: Record<string, unknown> = { visibility, title };
        const files: Record<string, unknown> = {};

        _.each(resources, ({ url, file }, name) => {
            if (file) {
                params[`${name}Url`] = '';
                files[`${name}_file`] = file;
            } else if (!_.isEmpty(url)) {
                params[`${name}Url`] = url;
            }
        });

        return this.toolbox
            .getInternal()
            .doUpload('/plugins/upload', { params, files: !_.isEmpty(files) ? files : undefined, method: 'post' });
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

declare global {
    namespace Stage.Common {
        export { PluginActions };
    }
}

Stage.defineCommon({
    name: 'PluginActions',
    common: PluginActions
});
