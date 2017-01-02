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

    fetchData: function(plugin,context,pluginUtils,params) {
        var deploymentData = context.getManager().doGet('/deployments',params);

        var deploymentIds = deploymentData.then(data=>Promise.resolve([...new Set(data.items.map(item=>item.id))]));

        var nodeData = deploymentIds.then(ids=>{
                    return context.getManager().doGet('/nodes?_include=deployment_id', {deployment_id: ids});
                });

        var nodeInstanceData = deploymentIds.then(ids=>{
                    return context.getManager().doGet('/node-instances?_include=state,deployment_id', {deployment_id: ids});
                });

        return Promise.all([deploymentData, nodeData, nodeInstanceData]).then(function(data) {
                let deploymentData = data[0];
                let nodeSize = _.countBy(data[1].items, "deployment_id");
                let nodeInstanceData = _.groupBy(data[2].items, "deployment_id");

                let formattedData = Object.assign({},deploymentData,{
                    items: _.map (deploymentData.items,(item)=>{
                        return Object.assign({},item,{
                            nodeSize: nodeSize[item.id],
                            nodeStates: _.countBy(nodeInstanceData[item.id], "state"),
                            created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                            updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm')
                        })
                    })
                });
                formattedData.total =  _.get(deploymentData, "metadata.pagination.total", 0);
                formattedData.blueprintId = params.blueprint_id;

                return Promise.resolve(formattedData);
            });
    },

    render: function(widget,data,error,context,pluginUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        let selectedDeployment = context.getValue('deploymentId');
        let formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    isSelected: selectedDeployment === item.id
                })
            })
        });

        return (
            <DeploymentsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
        );
    }
});
