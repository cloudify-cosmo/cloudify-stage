/**
 * Created by kinneretzin on 20/10/2016.
 */

import ExecutionsTable from './ExecutionsTable';

Stage.addPlugin({
    id: "executions",
    name: 'Deployment executions',
    description: 'This plugin shows the deployment executions',
    initialWidth: 8,
    initialHeight: 6,
    color : "purple",
    fetchUrl: '[manager]/api/v2.1/executions',
    isReact: true,
    initialConfiguration:
        [
            {id: "fieldsToShow",name: "List of fields to show in the table", placeHolder: "Enter list of comma separated field names (json format)",
                default: '["Blueprint","Deployment","Workflow","Id","Created","IsSystem","Status"]'}
        ],

    render: function(widget,data,error,context,pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var formattedData = Object.assign({},data);

        var blueprintId = context.getValue('blueprintId');
        var deploymentId = context.getValue('deploymentId');
        var selectedExecution = context.getValue('executionId');

        if (blueprintId) {
            formattedData.items = _.filter(data.items,{blueprint_id:blueprintId});
        }

        if (deploymentId) {
            formattedData.items = _.filter(data.items,{deployment_id:deploymentId});
        }


        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: item.id === selectedExecution
                })
            })
        });

        formattedData.blueprintId = blueprintId;
        formattedData.deploymentId = deploymentId;
        return (
            <ExecutionsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
        );
    }
});
