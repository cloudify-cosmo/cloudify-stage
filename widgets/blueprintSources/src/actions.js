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
        return this.toolbox.getInternal().doGet(`/source/browse/${blueprintId}/archive`);
    }

    doGetFileContent(path) {
        return this.toolbox.getInternal().doGet('/source/browse/file',{path});
    }

}