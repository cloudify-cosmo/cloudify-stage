/**
 * Created by kinneretzin on 07/09/2016.
 */

import Filter from './Filter';

Stage.defineWidget({
    id: 'filter',
    name: 'Resource filter',
    description: 'Adds a filter section for resources - blueprints, deployments, nodes, node instances and executions',
    initialWidth: 12,
    initialHeight: 5,
    color: 'yellow',
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    
    fetchData:(widget,toolbox,params)=>{
        return Promise.all([
            toolbox.getManager().doGetFull('/blueprints?_include=id'),
            toolbox.getManager().doGetFull('/deployments?_include=id,blueprint_id'),
            widget.configuration.filterByNodes ? toolbox.getManager().doGetFull('/nodes?_include=id,blueprint_id,deployment_id') : Promise.resolve({}),
            widget.configuration.filterByNodeInstances ? toolbox.getManager().doGetFull('/node-instances?_include=id,deployment_id,node_id') : Promise.resolve({}),
            widget.configuration.filterByExecutions ? toolbox.getManager().doGetFull('/executions?_include=id,blueprint_id,deployment_id,workflow_id') : Promise.resolve({})
        ]).then(results=>{
            return {
                blueprints: results[0],
                deployments: results[1],
                nodes: results[2],
                nodeInstances: results[3],
                executions: results[4]
            }
        });
    },

    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('filter'),
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        {id: "filterByExecutions",name: "Show execution filter", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: "filterByNodes",name: "Show node filter", default: false, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: "filterByNodeInstances",name: "Show node instance filter", default: false, type: Stage.Basic.GenericField.BOOLEAN_TYPE}
    ],

    _processData(blueprintId,deploymentId,nodeId,nodeInstanceId,executionId,data) {
        var processedData = Object.assign({},data,{
            blueprintId,
            deploymentId,
            nodeId,
            nodeInstanceId,
            executionId,
            blueprints: {
                items: data.blueprints.items
            },
            deployments:{
                items: data.deployments.items
            },
            nodes:{
                items: data.nodes.items
            },
            nodeInstances:{
                items: data.nodeInstances.items
            },
            executions: {
                items: data.executions.items
            }
        });

        if (blueprintId) {
            processedData.deployments.items = _.filter(processedData.deployments.items, {blueprint_id: blueprintId});
            processedData.nodes.items = _.filter(processedData.nodes.items, {blueprint_id: blueprintId});
        }
        if (deploymentId) {
            processedData.nodes.items = _.filter(processedData.nodes.items, {deployment_id: deploymentId});
            processedData.nodeInstances.items = _.filter(processedData.nodeInstances.items, {deployment_id: deploymentId});
            processedData.executions.items = _.filter(processedData.executions.items, {deployment_id: deploymentId});
        }
        if (nodeId) {
            processedData.nodeInstances.items = _.filter(processedData.nodeInstances.items, {node_id: nodeId});
        }

        return processedData;
    },
    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedBlueprint = toolbox.getContext().getValue('blueprintId');
        var selectedDeployment = toolbox.getContext().getValue('deploymentId');
        var selectedNode = toolbox.getContext().getValue('nodeId');
        var selectedNodeInstance = toolbox.getContext().getValue('nodeInstanceId');
        var selectedExecution = toolbox.getContext().getValue('executionId');

        var processedData = this._processData(selectedBlueprint,selectedDeployment,selectedNode,selectedNodeInstance,selectedExecution,data);

        return (
            <Filter widget={widget} data={processedData} toolbox={toolbox}/>
        );

    }
});