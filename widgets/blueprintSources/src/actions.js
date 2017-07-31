/**
 * Created by pposel on 28/02/2017.
 */

export default class {

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetBlueprintId(deploymentId) {
        return this.toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=id,blueprint_id`);
    }

    doGetFilesTree(blueprintId) {
        var version = this.toolbox.getManager().getApiVersion();
        return this.toolbox.getInternal().doGet(`/source/browse/${blueprintId}/archive/${version}`);
    }

    doGetFileContent(path) {
        return this.toolbox.getInternal().doGet('/source/browse/file',{path});
    }

}