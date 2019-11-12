/**
 * Created by kinneretzin on 07/09/2016.
 */

import Actions from './actions';
import BlueprintSources from './BlueprintSources';

Stage.defineWidget({
    id: 'blueprintSources',
    name: 'Blueprint Sources',
    description: 'Shows blueprint files',
    initialWidth: 8,
    initialHeight: 20,
    color: 'orange',
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintSources'),
    hasStyle: true,
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

    fetchParams(widget, toolbox) {
        const blueprintId = toolbox.getContext().getValue('blueprintId');
        const deploymentId = toolbox.getContext().getValue('deploymentId');

        return {
            blueprint_id: blueprintId,
            deployment_id: deploymentId
        };
    },

    fetchData(widget, toolbox, params) {
        const actions = new Actions(toolbox);

        let blueprintId = params.blueprint_id;
        const deploymentId = params.deployment_id;

        let promise = Promise.resolve({ blueprint_id: blueprintId });
        if (!blueprintId && deploymentId) {
            promise = actions.doGetBlueprintId(deploymentId);
        }

        return promise
            .then(({ blueprint_id }) => (blueprintId = blueprint_id))
            .then(() => actions.doGetBlueprintYamlFile(blueprintId))
            .then(({ main_file_name }) => {
                if (blueprintId) {
                    return actions
                        .doGetImportedBlueprints(blueprintId)
                        .then(imports =>
                            Promise.all(_.map([blueprintId, ...imports], bp => actions.doGetFilesTree(bp))).then(
                                data => ({ imports, data })
                            )
                        )
                        .then(({ imports, data }) => {
                            const [blueprintTree, ...importedBlueprintTrees] = data;
                            return {
                                blueprintTree,
                                importedBlueprintTrees,
                                blueprintId,
                                importedBlueprintIds: imports,
                                yamlFileName: main_file_name
                            };
                        });
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

    render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }

        return <BlueprintSources widget={widget} data={data} toolbox={toolbox} />;
    }
});
