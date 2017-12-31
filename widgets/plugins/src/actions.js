/**
 * Created by kinneretzin on 30/11/2016.
 */


export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(plugin) {
        return this.toolbox.getManager().doDelete(`/plugins/${plugin.id}`,null,{force:true});

    }

    doUpload(pluginUrl, file, visibility) {
        var params = {visibility: visibility};

        if (!_.isEmpty(pluginUrl)) {
            params['plugin_archive_url'] = pluginUrl;
        }

        if (file) {
            return this.toolbox.getManager().doUpload('/plugins', params, file, 'post');
        } else {
            return this.toolbox.getManager().doPost('/plugins', params);
        }
    }

    doDownload(plugin) {
        let pluginDownloadUrl = `/plugins/${plugin.id}/archive`;
        let pluginFileName = `${plugin.package_name}_${plugin.package_version}.zip`;

        return this.toolbox.getManager().doDownload(pluginDownloadUrl, pluginFileName);
    }

    doSetVisibility(pluginId, visibility) {
        return this.toolbox.getManager().doPatch(`/plugins/${pluginId}/set-visibility`, null, {visibility: visibility});
    }
}