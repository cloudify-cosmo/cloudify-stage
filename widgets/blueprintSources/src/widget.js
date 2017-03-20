/**
 * Created by kinneretzin on 07/09/2016.
 */

import Actions from './actions';
import BlueprintSources from './BlueprintSources';

Stage.defineWidget({
    id: "blueprintSources",
    name: "Blueprint Sources",
    description: 'Shows blueprint files',
    initialWidth: 8,
    initialHeight: 20,
    color : "orange",
    isReact: true,
    hasStyle: true,
    initialConfiguration: [
        {id: "contentPaneWidth", name: "Content pane initial width in %", default: 65, type: Stage.Basic.GenericField.NUMBER_TYPE}
    ],

    fetchParams: function(widget, toolbox) {
        var blueprintId = toolbox.getContext().getValue('blueprintId');
        var deploymentId = toolbox.getContext().getValue('deploymentId');

        return {
            blueprint_id: blueprintId,
            deployment_id: deploymentId
        }
    },

    fetchData: function(widget, toolbox, params) {
        var actions = new Actions(toolbox);

        var blueprintId = params.blueprint_id;
        var deploymentId = params.deployment_id;

        var promise = Promise.resolve({blueprint_id: blueprintId});
        if (!blueprintId && deploymentId) {
            promise = actions.doGetBlueprintId(deploymentId);
        }

        return promise.then(({blueprint_id})=>{
            blueprintId = blueprint_id;

            if (blueprintId) {
                return actions.doGetBlueprintDetails(blueprintId).then(data => {
                    var lastUpdate = Stage.Utils.formatTimestamp(data.updated_at, 'DDMMYYYYHHmm');
                    return actions.doGetFilesTree(blueprintId, lastUpdate).then(tree => Promise.resolve({tree, blueprintId}));
                });
            } else {
                return Promise.resolve({tree:{}});
            }
        });
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        return (
            <div>
                <BlueprintSources widget={widget} data={data} toolbox={toolbox}/>
            </div>
        );
    }
});