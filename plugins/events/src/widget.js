/**
 * Created by kinneretzin on 07/09/2016.
 */

import EventsTable from './EventsTable';

Stage.addPlugin({
    id: 'events',
    name: "Deployment Events",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "green",
    fetchUrl: '[manager]/api/v2.1/events',
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 2}
    ],

    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var formattedData = Object.assign({},data,{
            items: _.filter(data.items,(item)=>{return item.event_type !== undefined;})
        });
        var deploymentId = context.getValue('deploymentId');
        var blueprintId = context.getValue('blueprintId');
        var executionId = context.getValue('executionId');

        if (executionId) {
            formattedData.items = _.filter(formattedData.items, (item)=> {
                return item.context.execution_id === executionId;
            });
        } else if (deploymentId) {
            formattedData.items = _.filter(formattedData.items,(item)=>{
                return item.context.deployment_id === deploymentId;
            });
        } else if (blueprintId) {
            formattedData.items = _.filter(formattedData.items,(item)=>{
                return item.context.blueprint_id === blueprintId;
            });
        }

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    id: item.type+item.timestamp,
                    timestamp: pluginUtils.moment(item.timestamp,'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm') //2016-07-20 09:10:53.103+000
                })
            })
        });

        formattedData.blueprintId = blueprintId;
        formattedData.deploymentId = deploymentId;
        formattedData.executionId = executionId;

        return (
            <EventsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
        );

    }
});