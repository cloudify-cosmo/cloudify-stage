/**
 * Created by pposel on 24/05/2017.
 */

import BlueprintInfo from './BlueprintInfo';
import Actions from './actions';

Stage.defineWidget({
    id: 'blueprintInfo',
    name: "Blueprint info",
    description: 'Shows blueprint info and status',
    initialWidth: 3,
    initialHeight: 14,
    color: "orange",
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintInfo'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        {id: "blueprintId", name: "Blueprint ID", placeHolder: "Enter the blueprint id you wish to show info", type: Stage.Basic.GenericField.STRING_TYPE}
    ],

    fetchParams: function(widget, toolbox) {
        var blueprintId = toolbox.getContext().getValue('blueprintId');

        blueprintId = _.isEmpty(widget.configuration.blueprintId) ? blueprintId : widget.configuration.blueprintId;

        var deploymentId = toolbox.getContext().getValue('deploymentId');

        return {
            blueprint_id: blueprintId,
            deployment_id: deploymentId
        }
    },

    fetchData(widget, toolbox, params) {
        var actions = new Actions(toolbox);

        var blueprintId = params.blueprint_id;
        var deploymentId = params.deployment_id;

        var promise = Promise.resolve({blueprint_id: blueprintId});
        if (!blueprintId && deploymentId) {
            promise = actions.doGetBlueprintId(deploymentId);
        }

        return promise.then(({blueprint_id}) => {
            blueprintId = blueprint_id;

            if (blueprintId) {
                return actions.doGetBlueprintDetails(blueprintId).then(data => {
                    return actions.doGetBlueprintDeployments(blueprintId).then(deps => {
                        return {
                            ...data,
                            created_at: Stage.Utils.formatTimestamp(data.created_at),
                            updated_at: Stage.Utils.formatTimestamp(data.updated_at),
                            deployments: deps.items.length
                        }
                    });
                });
            } else {
                return Promise.resolve({id:""});
            }
        });
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        return (
            <BlueprintInfo widget={widget} data={data} toolbox={toolbox}/>
        );
    }
});
