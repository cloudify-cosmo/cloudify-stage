import Actions from './actions';
import BlueprintSources from './BlueprintSources';
import type { BlueprintTree } from './BlueprintSources';
import './widget.css';

type BlueprintSourcesParams = {
    // eslint-disable-next-line camelcase
    blueprint_id: string;
    // eslint-disable-next-line camelcase
    deployment_id: string;
};

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
        const blueprintId = toolbox.getContext().getValue('blueprintId');
        const deploymentId = toolbox.getContext().getValue('deploymentId');

        return {
            blueprint_id: blueprintId,
            deployment_id: deploymentId as string
        };
    },

    fetchData(_widget, toolbox, params) {
        const actions = new Actions(toolbox);

        const paramBlueprintId: string = params.blueprint_id;
        const paramDeploymentId = params.deployment_id;

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
                importedBlueprintsTrees: [],
                blueprintId: '',
                importedBlueprintIds: [],
                yamlFileName: ''
            };
        });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <BlueprintSources widget={widget} data={data} toolbox={toolbox} />;
    }
});
