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

    fetchParams: function(widget, toolbox) {
        var blueprintId = toolbox.getContext().getValue('blueprintId');

        blueprintId = _.isEmpty(widget.configuration.blueprintIdFilter) ? blueprintId : widget.configuration.blueprintIdFilter;

        return {
            blueprint_id: blueprintId
        }
    },

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = Object.assign({},data);
        var selectedDeployment = toolbox.getContext().getValue('deploymentId');

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    status: item.status || 'ok',
                    isSelected: selectedDeployment === item.id
                })
            })
        });
        formattedData.total =  _.get(data, "metadata.pagination.total", 0);

        var filter = toolbox.getContext().getValue('filterDep'+widget.id);
        if (filter) {
            formattedData.items = _.filter(formattedData.items,{status:filter});
        }

        let params = this.fetchParams(widget, toolbox);
        formattedData.blueprintId = params.blueprint_id;

        return (
            <DeploymentsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});
