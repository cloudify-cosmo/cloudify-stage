// @ts-nocheck File not migrated fully to TS
export {};

class PluginActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(plugin, force = true) {
        return this.toolbox.getManager().doDelete(`/plugins/${plugin.id}`, { body: { force } });
    }

    doUpload(visibility, title, resources) {
        const params = { visibility, title };
        const files = {};

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
            .doUpload('/plugins/upload', { params, files: !_.isEmpty(files) ? files : null, method: 'post' });
    }

    doDownload(plugin) {
        const pluginDownloadUrl = `/plugins/${plugin.id}/archive`;
        const pluginFileName = `${plugin.package_name}_${plugin.package_version}.zip`;

        return this.toolbox.getManager().doDownload(pluginDownloadUrl, pluginFileName);
    }

    doSetVisibility(pluginId, visibility) {
        return this.toolbox.getManager().doPatch(`/plugins/${pluginId}/set-visibility`, { body: { visibility } });
    }
}

Stage.defineCommon({
    name: 'PluginActions',
    common: PluginActions
});
