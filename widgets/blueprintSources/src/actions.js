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

    doGetBlueprintDetails(blueprintId) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprintId}?_include=updated_at`);
    }

    doGetFilesTree(blueprintId, lastUpdate) {
        return this.toolbox.getManager().doGet(`/source/browse?[manager]/blueprints/${blueprintId}/archive`,
                                               {last_update: lastUpdate});
    }

    doGetFileContent(path) {
        return this.toolbox.getExternal().doGet("/source/browse/file",{path});
    }

}