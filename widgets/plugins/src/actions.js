/**
 * Created by kinneretzin on 30/11/2016.
 */


export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(plugin) {
        return this.toolbox.getManager().doDelete(`/plugins/${plugin.id}`);

    }

    doUpload(pluginUrl, file) {
        var params = {};

        if (!_.isEmpty(pluginUrl)) {
            params['plugin_archive_url'] = pluginUrl;
        }

        return this.toolbox.getManager().doUpload(`/plugins`, params, file, 'post');
    }
}