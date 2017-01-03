/**
 * Created by jakubniezgoda on 03/01/2017.
 */

import NodesTable from './NodesTable';

Stage.addPlugin({
    id: 'nodes',
    name: 'Nodes list',
    description: 'This plugin shows nodes',
    initialWidth: 6,
    initialHeight: 5,
    color : 'blue',
    isReact: true,
    initialConfiguration: [],
    fetchUrl: '[manager]/nodes?_include=id,deployment_id,blueprint_id,type,number_of_instances,host_id,relationships[params]',
    pageSize: 5,

    fetchParams: function(widget, context) {
        return {
            deployment_id: context.getValue('deploymentId'),
            blueprint_id: context.getValue('blueprintId')
        }
    },

    render: function(widget,data,error,context,pluginUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        let params = this.fetchParams(widget, context);
        let formattedData = data;
        formattedData = Object.assign({}, formattedData, {
            items : _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    deploymentId : item.deployment_id,
                    blueprintId : item.blueprint_id,
                    containedIn : item.host_id,
                    connectedTo : item.relationships.filter((r) => r.type === 'cloudify.relationships.connected_to')
                                                    .map((r) => r.target_id)
                                                    .join(','),
                    numberOfInstances : item.number_of_instances
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0),
            blueprintId : params.blueprint_id,
            deploymentId : params.deployment_id
        });

        return (
            <NodesTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
        );
    }
});