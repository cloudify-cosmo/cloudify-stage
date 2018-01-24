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

    doUpload(visibility, wagonUrl, yamlUrl, wagonFile, yamlFile) {
        var params = {visibility: visibility};

        if (!_.isEmpty(wagonUrl)) {
            params['wagonUrl'] = wagonUrl;
        }

        if (!_.isEmpty(yamlUrl)) {
            params['yamlUrl'] = yamlUrl;
        }
        var files = {};
        if (wagonFile) {
            files['wagon_file'] = wagonFile;
        }

        if (yamlFile) {
            files['yaml_file'] = yamlFile;
        }

        return this.toolbox.getInternal().doUpload('/plugins/upload', params, !_.isEmpty(files) ? files : null, 'post');
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