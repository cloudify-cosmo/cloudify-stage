/**
 * Created by kinneretzin on 07/09/2016.
 */

import LogsTable from './LogsTable';

Stage.defineWidget({
    id: 'logs',
    name: "Logs",
    description: 'This widget shows Cloudify logs',
    initialWidth: 5,
    initialHeight: 16,
    color: "purple",
    fetchUrl: '[manager]/events?type=cloudify_log[params]',
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('timestamp'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],

    fetchParams: function(widget, toolbox) {
        var params = {};

        let eventFilter = toolbox.getContext().getValue('eventFilter');

        let deploymentId = toolbox.getContext().getValue('deploymentId') || eventFilter && eventFilter.deploymentId;
        if (!_.isEmpty(deploymentId)) {
            params.deployment_id = deploymentId;
        }

        let blueprintId = toolbox.getContext().getValue('blueprintId') || eventFilter && eventFilter.blueprintId;
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = blueprintId;
        }

        let messageText = eventFilter && eventFilter.messageText;
        if (!_.isEmpty(messageText)) {
            params.message = messageText;
        }

        let logLevel = eventFilter && eventFilter.logLevel;
        if (!_.isEmpty(logLevel)) {
            params.level = logLevel;
        }

        let timeStart = eventFilter && eventFilter.timeStart;
        let timeEnd = eventFilter && eventFilter.timeEnd;
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
                var id = item.execution_id + item.message + item.timestamp;
                return Object.assign({}, item, {
                    id: id,
                    timestamp: Stage.Utils.formatTimestamp(item.timestamp),
                    isSelected: id === SELECTED_LOG_ID
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0),
            blueprintId: (blueprintId && !_.isArray(blueprintId) ? blueprintId : ""),
            deploymentId: (deploymentId && !_.isArray(deploymentId) ? deploymentId : "")
        });

        return (
            <LogsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});