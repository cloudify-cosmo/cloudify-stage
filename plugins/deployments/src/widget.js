/**
 * Created by kinneretzin on 07/09/2016.
 */

import DeploymentsTable from './DeploymentsTable';

Stage.addPlugin({
    id: "deployments",
    name: 'Blueprint deployments',
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 6,
    color : "purple",
    fetchUrl: '[manager]/api/v2.1/deployments',
    initialConfiguration:
        [
            {id: "clickToDrillDown",name: "Should click to drilldown", placeHolder: "True of false to click to drill down", default: "true"},
            {id: "blueprintIdFilter",name: "Blueprint ID to filter by", placeHolder: "Enter the blueprint id you wish to filter by"}
        ],
    isReact: true,

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

        // Find if we have a config for blueprint selection
        var blueprintIdFilter = widget.configuration ? _.find(widget.configuration,{id:'blueprintIdFilter'}) : {};
        if (blueprintIdFilter && blueprintIdFilter.value) {
            blueprintId = blueprintIdFilter.value;
        }


        var filter = context.getValue('filterDep'+widget.id);
        if (blueprintId) {
            formattedData.items = _.filter(data.items,{blueprint_id:blueprintId});
        }

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    status: item.status || 'ok',
                    isSelected: deploymentId === item.id
                })
            })
        });

        if (filter) {
            formattedData.items = _.filter(formattedData.items,{status:filter});
        }

        formattedData.blueprintId = blueprintId;

        return (
            <div>
                <DeploymentsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
            </div>
        );
    }
});
