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

    doGetBlueprintDetails(blueprintId) {
        return this.toolbox
            .getManager()
            .doGet(`/blueprints?id=${blueprintId}&_include=plan,main_file_name`)
            .then(data => ({
                yamlFileName: _.get(data, 'items[0].main_file_name', ''),
                imports: _.get(data, 'items[0].plan.imported_blueprints', [])
            }));
    }

    doGetFileContent(path) {
        return this.toolbox.getInternal().doGet('/source/browse/file', { path });
    }
}
