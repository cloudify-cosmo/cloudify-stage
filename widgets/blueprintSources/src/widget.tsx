import type { GetSourceBrowseBlueprintArchiveResponse } from 'backend/routes/SourceBrowser.types';
import Actions from './actions';
import BlueprintSources from './BlueprintSources';
import './widget.css';

type BlueprintSourcesParams = {
    blueprintId: string;
    deploymentId: string;
};

export type BlueprintTree = GetSourceBrowseBlueprintArchiveResponse;

export type BlueprintSourcesData = {
    blueprintId: string;
    blueprintTree: BlueprintTree;
    importedBlueprintIds: string[];
    importedBlueprintTrees?: BlueprintTree[];
    yamlFileName: string;
};

type BlueprintSourcesConfiguration = {
    contentPaneWidth: number;
};

Stage.defineWidget<BlueprintSourcesParams, BlueprintSourcesData, BlueprintSourcesConfiguration>({
    id: 'blueprintSources',
    name: 'Blueprint Sources',
    description: 'Shows blueprint files',
    initialWidth: 8,
    initialHeight: 20,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintSources'),
    hasReadme: true,
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],

    initialConfiguration: [
        {
            id: 'contentPaneWidth',
            name: 'Content pane initial width in %',
            default: 65,
            type: Stage.Basic.GenericField.NUMBER_TYPE
        }
    ],

    fetchParams(_widget, toolbox) {
        const blueprintId = toolbox.getContext().getValue('blueprintId') ?? '';

        // TODO(RD-2130): Use common utility function to get only the first ID
        const deploymentIds = toolbox.getContext().getValue('deploymentId');
        const deploymentId: string = Array.isArray(deploymentIds) ? deploymentIds[0] : deploymentIds ?? '';

        return { blueprintId, deploymentId };
    },

    fetchData(_widget, toolbox, params) {
        const actions = new Actions(toolbox);

        const paramBlueprintId = params.blueprintId;
        const paramDeploymentId = params.deploymentId;

        let promise = Promise.resolve({ blueprint_id: paramBlueprintId });
        if (!paramBlueprintId && paramDeploymentId) {
            promise = actions.doGetBlueprintId(paramDeploymentId);
        }

        return promise.then(({ blueprint_id: blueprintId }) => {
            if (blueprintId) {
                return actions
                    .doGetBlueprintDetails(blueprintId)
                    .then(({ imports, yamlFileName }) =>
                        Promise.all(_.map([blueprintId, ...imports], bp => actions.doGetFilesTree(bp))).then(data => ({
                            imports,
                            data,
                            yamlFileName
                        }))
                    )
                    .then(
                        ({
                            imports: importedBlueprintIds,
                            data: [blueprintTree, ...importedBlueprintTrees],
                            yamlFileName
                        }) => ({
                            blueprintTree,
                            importedBlueprintTrees,
                            blueprintId,
                            importedBlueprintIds,
                            yamlFileName
                        })
                    );
            }
            return {
                blueprintTree: {},
                importedBlueprintTrees: [],
                blueprintId: '',
                importedBlueprintIds: [],
                yamlFileName: ''
            };
        });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        return <BlueprintSources widget={widget} data={data} toolbox={toolbox} />;
    }
});
