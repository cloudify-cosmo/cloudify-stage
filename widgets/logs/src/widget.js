/**
 * Created by kinneretzin on 07/09/2016.
 */

import LogsTable from './LogsTable';

Stage.defineWidget({
    id: 'logs',
    name: "Deployment Logs",
    description: 'This widget shows Cloudify logs',
    initialWidth: 5,
    initialHeight: 16,
    color: "purple",
    fetchUrl: '[manager]/events?type=cloudify_log[params]',
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],

    fetchParams: function(widget, toolbox) {
        var params = {};

        let deploymentId = toolbox.getContext().getValue('event_deploymentId');
        if (!_.isEmpty(deploymentId)) {
            params.deployment_id = deploymentId;
        }

        let blueprintId = toolbox.getContext().getValue('event_blueprintId');
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = blueprintId;
        }

        let messageText = toolbox.getContext().getValue('event_messageText');
        if (!_.isEmpty(messageText)) {
            params.message_text = messageText;
        }

        let logLevel = toolbox.getContext().getValue('event_logLevel');
        if (!_.isEmpty(logLevel)) {
            params.level = logLevel;
        }

        let eventType = toolbox.getContext().getValue('event_eventType');
        if (!_.isEmpty(eventType)) {
            params.event_type = eventType;
        }

        let timeStart = toolbox.getContext().getValue('event_timeStart');
        let timeEnd = toolbox.getContext().getValue('event_timeEnd');
        if (timeStart || timeEnd) {
            timeStart = timeStart?timeStart.toISOString():"";
            timeEnd = timeEnd?timeEnd.toISOString():"";
            params._range = `@timestamp,${timeStart},${timeEnd}`;
        }

        return params;
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        const SELECTED_LOG_ID = toolbox.getContext().getValue('logId');
        const CONTEXT_PARAMS = this.fetchParams(widget, toolbox);

        let blueprintId = CONTEXT_PARAMS['blueprint_id'], deploymentId = CONTEXT_PARAMS['deployment_id'];
        var formattedData = Object.assign({}, data, {
            items: _.map (data.items, (item) => {
                return Object.assign({}, item, {
                    id: item.context.execution_id + item['@timestamp'],
                    timestamp: moment(item.timestamp,'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103+000
                    isSelected: (item.context.execution_id + item['@timestamp']) === SELECTED_LOG_ID
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0),
            blueprintId: (blueprintId && blueprintId.length == 1 ? blueprintId : ""),
            deploymentId: (deploymentId && deploymentId.length == 1 ? deploymentId : "")
        });

        return (
            <LogsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});