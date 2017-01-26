/**
 * Created by kinneretzin on 20/10/2016.
 */

import ExecutionsTable from './ExecutionsTable';

Stage.defineWidget({
    id: "executions",
    name: 'Deployment executions',
    description: 'This widget shows the deployment executions',
    initialWidth: 8,
    initialHeight: 6,
    color : "purple",
    fetchUrl: '[manager]/executions[params]',
    isReact: true,
    initialConfiguration:
        [
            Stage.GenericConfig.POLLING_TIME_CONFIG(2),
            Stage.GenericConfig.PAGE_SIZE_CONFIG(),
            {id: "fieldsToShow",name: "List of fields to show in the table", placeHolder: "Select fields from the list",
                items: ["Blueprint","Deployment","Workflow","Id","Created","IsSystem","Params","Status"],
                default: 'Blueprint,Deployment,Workflow,Id,Created,IsSystem,Params,Status', type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE}
        ],

    fetchParams: function(widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            deployment_id: toolbox.getContext().getValue('deploymentId')
        }
    },

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = Object.assign({},data);
        var selectedExecution = toolbox.getContext().getValue('executionId');

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: item.id === selectedExecution
                })
            })
        });
        formattedData.total = _.get(data, "metadata.pagination.total", 0);

        let params = this.fetchParams(widget, toolbox);
        formattedData.blueprintId = params.blueprint_id;
        formattedData.deploymentId = params.deployment_id;

        return (
            <ExecutionsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
