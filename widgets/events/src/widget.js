/**
 * Created by kinneretzin on 07/09/2016.
 */

import EventsTable from './EventsTable';

Stage.defineWidget({
    id: 'events',
    name: "Events/logs",
    description: 'This widget shows Cloudify events/logs',
    initialWidth: 12,
    initialHeight: 18,
    color: "green",
    fetchUrl: '[manager]/events[params]',
    isReact: true,
    hasStyle: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('timestamp'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
        {id: "fieldsToShow",name: "List of fields to show in the table", placeHolder: "Select fields from the list",
            items: ["Icon","Timestamp","Type","Blueprint","Deployment","Workflow","Operation","Node Name","Node Id","Message"],
            default: 'Icon,Timestamp,Type,Blueprint,Deployment,Workflow,Operation,Node Name,Node Id,Message',
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE},
        {id: "colorLogs", name: "Color message based on type", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: "maxMessageLength", name: "Maximum message length before truncation", default: EventsTable.MAX_MESSAGE_LENGTH, type: Stage.Basic.GenericField.NUMBER_TYPE, min: 10}
    ],

    fetchParams: function(widget, toolbox) {
        var params = {};

        let eventFilter = toolbox.getContext().getValue('eventFilter') || {};

        let deploymentId = toolbox.getContext().getValue('deploymentId') || eventFilter.deploymentId;
        if (!_.isEmpty(deploymentId)) {
            params.deployment_id = deploymentId;
        }

        let blueprintId = toolbox.getContext().getValue('blueprintId') || eventFilter.blueprintId;
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = blueprintId;
        }

        let messageText = eventFilter.messageText;
        if (!_.isEmpty(messageText)) {
            params.message = messageText;
        }

        let logLevel = eventFilter.logLevel;
        if (!_.isEmpty(logLevel)) {
            params.level = logLevel;
        }

        let eventType = eventFilter.eventType;
        if (!_.isEmpty(eventType)) {
            params.event_type = eventType;
        }

        let timeStart = eventFilter.timeStart;
        let timeEnd = eventFilter.timeEnd;
        if (timeStart || timeEnd) {
            timeStart = timeStart?timeStart.utc().toISOString():"";
            timeEnd = timeEnd?timeEnd.utc().toISOString():"";
            params._range = `@timestamp,${timeStart},${timeEnd}`;
        }

        params.type = eventFilter.type;

        return params;
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        const SELECTED_EVENT_ID = toolbox.getContext().getValue('eventId');
        const SELECTED_LOG_ID = toolbox.getContext().getValue('logId');

        const CONTEXT_PARAMS = this.fetchParams(widget, toolbox);

        let blueprintId = CONTEXT_PARAMS.blueprint_id
        let deploymentId = CONTEXT_PARAMS.deployment_id;

        blueprintId = _.isArray(blueprintId) ? (blueprintId.length === 1 ? blueprintId[0] : "") : "";
        deploymentId = _.isArray(deploymentId) ? (deploymentId.length === 1 ? deploymentId[0] : "") : "";

        let formattedData = Object.assign({}, data, {
            items: _.map (data.items, (item) => {
                let id = Stage.Utils.getMD5(item.node_instance_id + item.operation + item.blueprint_id + item.timestamp +
                                            item.message + item.level + item.node_name + item.workflow_id +
                                            item.reported_timestamp + item.deployment_id + item.type + item.execution_id);
                return Object.assign({}, item, {
                    id: id,
                    timestamp: Stage.Utils.formatTimestamp(item.timestamp),
                    isSelected: id === SELECTED_EVENT_ID || (widget.configuration.showLogs && id === SELECTED_LOG_ID)
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0),
            blueprintId,
            deploymentId,
            type: CONTEXT_PARAMS.type
        });

        return (
            <EventsTable widget={widget} data={formattedData} toolbox={toolbox} />
        );

    }
});