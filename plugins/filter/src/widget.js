/**
 * Created by kinneretzin on 07/09/2016.
 */

import DataFetcher from './DataFetcher';
import Filter from './Filter';

Stage.addPlugin({
    id: 'filter',
    name: "Filter by blueprint/deployment/execution",
    description: 'Adds a filter section for blueprints, deployments and execution list',
    initialWidth: 12,
    initialHeight: 1,
    color: "yellow",
    showHeader: false,
    showBorder: false,
    fetchData: function(plugin,context,pluginUtils) {
        return DataFetcher.fetch(context);
    },

    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 5},
        {id: "FilterByExecutions",name: "Should show execution filter", placeHolder: "True of false if to show execution filter as well", default: "true"}
    ],

    _processData(blueprintId,deploymentId,executionId,data) {
        var processedData = Object.assign({},data,{
            blueprintId,
            deploymentId,
            executionId,
            deployments:{
                items: data.deployments.items
            },
            blueprints: {
                items: data.blueprints.items
            },
            executions: {
                items: data.executions.items
            }
        });

        if (blueprintId) {
            processedData.deployments.items = _.filter(processedData.deployments.items, {blueprint_id: blueprintId});
        }
        if (deploymentId) {
            processedData.executions.items = _.filter(processedData.executions.items, {deployment_id: deploymentId});
        }

        return processedData;
    },
    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var selectedBlueprint = context.getValue('blueprintId');
        var selectedDeployment = context.getValue('deploymentId');
        var selectedExecution = context.getValue('executionId');

        var processedData = this._processData(selectedBlueprint,selectedDeployment,selectedExecution,data);

        return (
            <Filter widget={widget} data={processedData} context={context} utils={pluginUtils}/>
        );

    }
});