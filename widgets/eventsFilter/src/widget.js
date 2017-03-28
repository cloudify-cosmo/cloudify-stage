/**
 * Created by pposel on 07/02/2017.
 */

import EventFilter from './EventFilter';

Stage.defineWidget({
    id: 'eventsFilter',
    name: "Events/logs filter",
    description: 'Adds a filter section for events and logs',
    initialWidth: 12,
    initialHeight: 6,
    color: "pink",
    showHeader: false,
    showBorder: false,
    fetchData:(widget,toolbox,params)=>{
        return Promise.all([
            toolbox.getManager().doGetFull('/blueprints?_include=id'),
            toolbox.getManager().doGetFull('/deployments?_include=id,blueprint_id'),
            toolbox.getManager().doGetFull('/events?_include=event_type&type=cloudify_event')
        ]).then(results=>{
            return {
                blueprints: results[0],
                deployments : results[1],
                types: results[2]
            }
        });
    },
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],

    _processData(blueprintId,deploymentId,data) {
        var processedData = Object.assign({},data,{
            blueprintId,
            deploymentId,
            blueprints: {
                items: data.blueprints.items
            },
            deployments:{
                items: data.deployments.items
            },
            types:{
                items: _.uniqBy(data.types.items, 'event_type')
            }
        });

        if (blueprintId) {
            processedData.deployments.items = _.filter(processedData.deployments.items, {blueprint_id: blueprintId});
        }

        return processedData;
    },
    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedBlueprint = toolbox.getContext().getValue('blueprintId');
        var selectedDeployment = toolbox.getContext().getValue('deploymentId');

        var processedData = this._processData(selectedBlueprint,selectedDeployment,data);

        return (
            <EventFilter data={processedData} toolbox={toolbox}/>
        );
    }
});