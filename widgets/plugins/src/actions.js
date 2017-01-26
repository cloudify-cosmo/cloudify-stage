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

    doUpload(file) {
        return this.toolbox.getManager().doUpload('/plugins',null,file,'post');
    }

    doDownload(plugin) {
        let pluginDownloadUrl = `/plugins/${plugin.id}/archive`;
        let pluginFileName = `${plugin.package_name}_${plugin.package_version}.zip`;

        return this.toolbox.getManager().doDownload(pluginDownloadUrl, pluginFileName);
    }
}