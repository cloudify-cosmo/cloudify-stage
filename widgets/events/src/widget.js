/**
 * Created by kinneretzin on 07/09/2016.
 */

import EventsTable from './EventsTable';

Stage.defineWidget({
    id: 'events',
    name: "Deployment Events",
    description: 'This widget shows Cloudify events',
    initialWidth: 5,
    initialHeight: 4,
    color: "green",
    fetchUrl: '[manager]/events?type=cloudify_event[params]',
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],

    fetchParams: function(widget, toolbox) {
        return {
            'context.blueprint_id': toolbox.getContext().getValue('blueprintId'),
            'context.deployment_id': toolbox.getContext().getValue('deploymentId'),
            'context.execution_id': toolbox.getContext().getValue('executionId')
        }
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        const SELECTED_EVENT_ID = toolbox.getContext().getValue('eventId');
        const CONTEXT_PARAMS = this.fetchParams(widget, toolbox);

        let formattedData = data;
        formattedData = Object.assign({}, data, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    id: item.context.execution_id + item['@timestamp'],
                    timestamp: moment(item.timestamp,'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103+000
                    isSelected: (item.context.execution_id + item['@timestamp']) === SELECTED_EVENT_ID
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0),
            blueprintId: CONTEXT_PARAMS['context.blueprint_id'],
            deploymentId: CONTEXT_PARAMS['context.deployment_id'],
            executionId: CONTEXT_PARAMS['context.execution_id']
        });

        return (
            <EventsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});