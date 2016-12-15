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
    fetchUrl: '[manager]/deployments[params]',
    initialConfiguration:
        [
            {id: "pollingTime", default: 2},
            {id: "clickToDrillDown",name: "Should click to drilldown", placeHolder: "True of false to click to drill down", default: "true"},
            {id: "blueprintIdFilter",name: "Blueprint ID to filter by", placeHolder: "Enter the blueprint id you wish to filter by"}
        ],
    isReact: true,
    pageSize: 5,

    fetchParams: function(widget, context) {
        var blueprintId = context.getValue('blueprintId');

        // Find if we have a config for blueprint selection
        var blueprintIdFilter = widget.configuration ? _.find(widget.configuration,{id:'blueprintIdFilter'}) : {};
        if (blueprintIdFilter && blueprintIdFilter.value) {
            blueprintId = blueprintIdFilter.value;
        }

        return {
            blueprint_id: blueprintId
        }
    },

    render: function(widget,data,error,context,pluginUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var formattedData = Object.assign({},data);
        var selectedDeployment = context.getValue('deploymentId');

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    status: item.status || 'ok',
                    isSelected: selectedDeployment === item.id
                })
            })
        });
        formattedData.total =  _.get(data, "metadata.pagination.total", 0);

        var filter = context.getValue('filterDep'+widget.id);
        if (filter) {
            formattedData.items = _.filter(formattedData.items,{status:filter});
        }

        let params = this.fetchParams(widget, context);
        formattedData.blueprintId = params.blueprint_id;

        return (
            <DeploymentsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
        );
    }
});
