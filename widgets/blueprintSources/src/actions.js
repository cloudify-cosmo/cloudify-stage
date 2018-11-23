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

    doGetImportedBlueprints(blueprintId) {
        return this.toolbox.getManager().doGet(`/blueprints?id=${blueprintId}&_include=plan`)
            .then((data) => {
                const imported = data.items[0].plan.imported;
                const importedBlueprintPrefix = 'blueprint:';

                return _.isEmpty(imported)
                    ? []
                    : _.chain(imported)
                        .filter((i) => _.startsWith(i, importedBlueprintPrefix))
                        .map((i) => _.replace(i, importedBlueprintPrefix, ''))
                        .value();
            });
    }

    doGetFileContent(path) {
        return this.toolbox.getInternal().doGet('/source/browse/file',{path});
    }

}