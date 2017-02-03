/**
 * Created by kinneretzin on 07/09/2016.
 */

import LogsTable from './LogsTable';

Stage.defineWidget({
    id: 'logs',
    name: "Deployment Logs",
    description: 'This widget shows Cloudify logs',
    initialWidth: 5,
    initialHeight: 4,
    color: "purple",
    fetchUrl: {
        logs: '[manager]/events?type=cloudify_log[params]',
        blueprints: '[manager]/blueprints?_include=id',
        deployments: '[manager]/deployments?_include=id'
    },
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

        const SELECTED_LOG_ID = toolbox.getContext().getValue('logId');
        const CONTEXT_PARAMS = this.fetchParams(widget, toolbox);

        let formattedData = data.logs;
        formattedData = Object.assign({}, formattedData, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    id: item.context.execution_id + item['@timestamp'],
                    timestamp: moment(item.timestamp,'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103+000
                    isSelected: (item.context.execution_id + item['@timestamp']) === SELECTED_LOG_ID
                })
            }),
            total : _.get(formattedData, 'metadata.pagination.total', 0),
            blueprintId: CONTEXT_PARAMS['context.blueprint_id'],
            deploymentId: CONTEXT_PARAMS['context.deployment_id'],
            executionId: CONTEXT_PARAMS['context.execution_id']
        });

        return (
            <LogsTable widget={widget} data={formattedData} toolbox={toolbox}
                       blueprints={data.blueprints} deployments={data.deployments}/>
        );

    }
});