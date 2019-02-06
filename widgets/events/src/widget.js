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
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('events'),
    hasStyle: true,
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('timestamp'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
        {id: "fieldsToShow",name: "List of fields to show in the table", placeHolder: "Select fields from the list",
            items: ["Icon","Timestamp","Type","Blueprint","Deployment","Workflow","Operation","Node Id","Node Instance Id","Message"],
            default: 'Icon,Timestamp,Blueprint,Deployment,Workflow,Operation,Node Id,Node Instance Id,Message',
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE},
        {id: "colorLogs", name: "Color message based on type", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: "maxMessageLength", name: "Maximum message length before truncation", default: EventsTable.MAX_MESSAGE_LENGTH, type: Stage.Basic.GenericField.NUMBER_TYPE, min: 10}
    ],

    fetchParams: function(widget, toolbox) {
        var params = {};

        let eventFilter = toolbox.getContext().getValue('eventFilter') || {};

        let blueprintId = toolbox.getContext().getValue('blueprintId');
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = _.castArray(blueprintId);
        }

        let deploymentId = toolbox.getContext().getValue('deploymentId');
        if (!_.isEmpty(deploymentId)) {
            params.deployment_id = _.castArray(deploymentId);
        }

        let nodeId = toolbox.getContext().getValue('nodeId');
        if (!_.isEmpty(nodeId)) {
            params.node_id = _.castArray(nodeId);
        }

        let nodeInstanceId = toolbox.getContext().getValue('nodeInstanceId');
        if (!_.isEmpty(nodeInstanceId)) {
            params.node_instance_id = _.castArray(nodeInstanceId);
        }

        let executionId = toolbox.getContext().getValue('executionId');
        if (!_.isEmpty(executionId)) {
            params.execution_id = _.castArray(executionId);
        }

        let messageText = eventFilter.messageText;
        if (!_.isEmpty(messageText)) {
            params.message = `%${messageText}%`;
        }

        let operationText = eventFilter.operationText;
        if (!_.isEmpty(operationText)) {
            params.operation = `%${operationText}%`;
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
            timeStart = timeStart?timeStart.utc().toISOString():'';
            timeEnd = timeEnd?timeEnd.utc().toISOString():'';
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
        const eventFilter = toolbox.getContext().getValue('eventFilter') || {};

        const CONTEXT_PARAMS = this.fetchParams(widget, toolbox);

        let blueprintId = CONTEXT_PARAMS.blueprint_id;
        let deploymentId = CONTEXT_PARAMS.deployment_id;
        let nodeId = CONTEXT_PARAMS.node_id;
        let nodeInstanceId = CONTEXT_PARAMS.node_instance_id;
        let executionId = CONTEXT_PARAMS.execution_id;

        let formattedData = {
            items: _.map (data.items, (item) => {
                let id = Stage.Utils.getMD5(item.node_instance_id + item.operation + item.blueprint_id + item.timestamp +
                                            item.message + item.level + item.node_name + item.workflow_id +
                                            item.reported_timestamp + item.deployment_id + item.type + item.execution_id);
                return Object.assign({}, item, {
                    id: id,
                    timestamp: Stage.Utils.Time.formatTimestamp(item.timestamp),
                    isSelected: id === SELECTED_EVENT_ID || (widget.configuration.showLogs && id === SELECTED_LOG_ID)
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0),
            blueprintId,
            deploymentId,
            nodeId,
            nodeInstanceId,
            executionId,
            eventFilter
        };

        return (
            <EventsTable widget={widget} data={formattedData} toolbox={toolbox} />
        );

    }
});