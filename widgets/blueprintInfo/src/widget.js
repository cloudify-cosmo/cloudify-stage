/**
 * Created by pposel on 24/05/2017.
 */

import BlueprintInfo from './BlueprintInfo';
import Actions from './actions';

Stage.defineWidget({
    id: 'blueprintInfo',
    name: 'Blueprint info',
    description: 'Shows blueprint info and status',
    initialWidth: 3,
    initialHeight: 14,
    color: 'orange',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintInfo'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'blueprintId',
            name: 'Blueprint ID',
            placeHolder: 'Enter the blueprint id you wish to show info',
            type: Stage.Basic.GenericField.STRING_TYPE
        }
    ],

    fetchParams(widget, toolbox) {
        let blueprintId = toolbox.getContext().getValue('blueprintId');

        blueprintId = _.isEmpty(widget.configuration.blueprintId) ? blueprintId : widget.configuration.blueprintId;

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

        return promise.then(({ blueprint_id }) => {
            blueprintId = blueprint_id;

            if (blueprintId) {
                return Promise.all([
                    actions.doGetBlueprintDetails(blueprintId),
                    actions.doGetBlueprintDeployments(blueprintId)
                ]).then(data => ({
                    ...data[0],
                    created_at: Stage.Utils.Time.formatTimestamp(data[0].created_at),
                    updated_at: Stage.Utils.Time.formatTimestamp(data[0].updated_at),
                    deployments: _.get(data[1].items[0], 'deployments', 0)
                }));
            }
            return Promise.resolve({ id: '' });
        });
    },

    render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }

        return <BlueprintInfo widget={widget} data={data} toolbox={toolbox} />;
    }
});
