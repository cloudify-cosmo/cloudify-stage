import type {
    GetSourceBrowseBlueprintArchiveResponse,
    GetSourceBrowseBlueprintFileResponse
} from 'backend/routes/SourceBrowser.types';

export default class {
    constructor(private readonly toolbox: Stage.Types.Toolbox) {}

    doGetBlueprintId(deploymentId: string) {
        return this.toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=id,blueprint_id`);
    }

    doGetFilesTree(blueprintId: string) {
        return this.toolbox
            .getInternal()
            .doGet<GetSourceBrowseBlueprintArchiveResponse>(`/source/browse/${blueprintId}/archive`);
    }

    doGetBlueprintDetails(blueprintId: string) {
        return this.toolbox
            .getManager()
            .doGet(`/blueprints?id=${blueprintId}&_include=plan,main_file_name`)
            .then(data => ({
                yamlFileName: _.get(data, 'items[0].main_file_name', ''),
                imports: _.get(data, 'items[0].plan.imported_blueprints', [])
            }));
    }

    doGetFileContent(path: string) {
        return this.toolbox.getInternal().doGet<GetSourceBrowseBlueprintFileResponse>(`/source/browse/${path}`);
    }
}
