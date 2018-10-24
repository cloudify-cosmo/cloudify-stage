/**
 * Created by kinneretzin on 07/09/2016.
 */

import DeploymentsList from './DeploymentsList';

Stage.defineWidget({
    id: 'deployments',
    name: 'Blueprint deployments',
    description: 'Shows blueprint deployments list',
    initialWidth: 8,
    initialHeight: 24,
    color : 'purple',
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration:
        [
            Stage.GenericConfig.POLLING_TIME_CONFIG(10),
            Stage.GenericConfig.PAGE_SIZE_CONFIG(),
            {id: "clickToDrillDown", name: "Enable click to drill down",
                default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
            {id: "showExecutionStatusLabel", name: "Show execution status label",
                description: "Show last execution workflow ID and status",
                default: false, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
            {id: "blueprintIdFilter", name: "Blueprint ID to filter by",
                placeHolder: "Enter the blueprint id you wish to filter by", type: Stage.Basic.GenericField.STRING_TYPE},
            {id: "displayStyle", name: "Display style",
                items: [{name:'Table', value:'table'}, {name:'List', value:'list'}],
                default: "table", type: Stage.Basic.GenericField.LIST_TYPE},
            Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
            Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
        ],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    fetchParams: function(widget, toolbox) {
        var blueprintId = toolbox.getContext().getValue('blueprintId');

        blueprintId = _.isEmpty(widget.configuration.blueprintIdFilter) ? blueprintId : widget.configuration.blueprintIdFilter;

        let obj = {
            blueprint_id: blueprintId
        }
        if(toolbox.getContext ().getValue ('onlyMyResources')){
            obj.created_by = toolbox.getManager().getCurrentUsername();
        }
        return obj;
    },

    fetchData: function(widget,toolbox,params) {
        var deploymentData = toolbox.getManager().doGet('/deployments', params);

        var deploymentIds = deploymentData.then(data=>Promise.resolve([...new Set(data.items.map(item=>item.id))]));

        var nodeInstanceData = deploymentIds.then(ids=>{
                    return toolbox.getManager().doGet('/node-instances?_include=id,state,deployment_id', {deployment_id: ids});
                });

        let executionsData = deploymentIds.then(ids=>{
            return toolbox.getManager().doGet('/executions', {
                _sort: '-ended_at',
                deployment_id: ids
            });
        });

        return Promise.all([deploymentData, nodeInstanceData, executionsData]).then(function(data) {
                let deploymentData = data[0];
                let nodeInstancesSize = _.countBy(data[1].items, "deployment_id");
                let nodeInstanceData = _.groupBy(data[1].items, "deployment_id");
                let executionsData = _.groupBy(data[2].items, "deployment_id");

                let formattedData = Object.assign({},deploymentData,{
                    items: _.map (deploymentData.items,(item)=>{
                        let workflows = Stage.Common.DeploymentUtils.filterWorkflows(_.sortBy(item.workflows, ['name']));
                        return Object.assign({},item,{
                            nodeSize: nodeInstancesSize[item.id],
                            nodeStates: _.countBy(nodeInstanceData[item.id], "state"),
                            created_at: Stage.Utils.formatTimestamp(item.created_at), //2016-07-20 09:10:53.103579
                            updated_at: Stage.Utils.formatTimestamp(item.updated_at),
                            executions: _.filter(executionsData[item.id], Stage.Common.ExecutionUtils.isActiveExecution),
                            lastExecution: _.first(executionsData[item.id]),
                            workflows
                        })
                    })
                });
                formattedData.total =  _.get(deploymentData, "metadata.pagination.total", 0);
                formattedData.blueprintId = params.blueprint_id;

                return Promise.resolve(formattedData);
            });
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let selectedDeployment = toolbox.getContext().getValue('deploymentId');
        let formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    isSelected: selectedDeployment === item.id,
                    isUpdated: !_.isEqual(item.created_at, item.updated_at)
                })
            })
        });

        return (
            <DeploymentsList widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
