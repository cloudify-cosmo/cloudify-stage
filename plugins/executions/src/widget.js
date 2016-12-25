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
    fetchUrl: '[manager]/executions[params]',
    isReact: true,
    initialConfiguration:
        [
            {id: "fieldsToShow",name: "List of fields to show in the table", placeHolder: "Enter list of comma separated field names (json format)",
             default: '["Blueprint","Deployment","Workflow","Id","Created","IsSystem","Params","Status"]'}
        ],
    pageSize: 5,

    fetchParams: function(widget, context) {
        return {
            blueprint_id: context.getValue('blueprintId'),
            deployment_id: context.getValue('deploymentId')
        }
    },

    render: function(widget,data,error,context,pluginUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var formattedData = Object.assign({},data);
        var selectedExecution = context.getValue('executionId');

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: item.id === selectedExecution
                })
            })
        });
        formattedData.total = _.get(data, "metadata.pagination.total", 0);

        let params = this.fetchParams(widget, context);
        formattedData.blueprintId = params.blueprint_id;
        formattedData.deploymentId = params.deployment_id;

        return (
            <ExecutionsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
        );
    }
});
