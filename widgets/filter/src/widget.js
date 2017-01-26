/**
 * Created by kinneretzin on 07/09/2016.
 */

import Filter from './Filter';

Stage.defineWidget({
    id: 'filter',
    name: "Filter by blueprint/deployment/execution",
    description: 'Adds a filter section for blueprints, deployments and execution list',
    initialWidth: 12,
    initialHeight: 1,
    color: "yellow",
    showHeader: false,
    showBorder: false,
    keepOnTop: true,
    fetchUrl: {
        blueprints: '[manager]/blueprints?_include=id',
        deployments: '[manager]/deployments?_include=id,blueprint_id',
        executions: '[manager]/executions?_include=id,blueprint_id,deployment_id,workflow_id'
    },
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        {id: "filterByExecutions",name: "Should show execution filter", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE}
    ],

    _processData(blueprintId,deploymentId,executionId,data) {
        var processedData = Object.assign({},data,{
            blueprintId,
            deploymentId,
            executionId,
            blueprints: {
                items: data.blueprints.items
            },
            deployments:{
                items: data.deployments.items
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
    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedBlueprint = toolbox.getContext().getValue('blueprintId');
        var selectedDeployment = toolbox.getContext().getValue('deploymentId');
        var selectedExecution = toolbox.getContext().getValue('executionId');

        var processedData = this._processData(selectedBlueprint,selectedDeployment,selectedExecution,data);

        return (
            <Filter widget={widget} data={processedData} toolbox={toolbox}/>
        );

    }
});