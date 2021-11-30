// @ts-nocheck File not migrated fully to TS
/**
 * Created by kinneretzin on 20/10/2016.
 */

import { isEmpty } from 'lodash';
import ExecutionsTable from './ExecutionsTable';
import SingleExecution from './SingleExecution';

Stage.defineWidget({
    id: 'executions',
    name: 'Executions',
    description: 'This widget shows the deployment executions',
    initialWidth: 8,
    initialHeight: 24,
    hasStyle: true,
    color: 'teal',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executions'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {
            id: 'fieldsToShow',
            name: 'List of fields to show in the table',
            placeHolder: 'Select fields from the list',
            items: [
                'Blueprint',
                'Deployment',
                'Deployment ID',
                'Workflow',
                'Id',
                'Created',
                'Scheduled',
                'Ended',
                'Creator',
                'Attributes',
                'Status',
                'Actions'
            ],
            default: 'Blueprint,Deployment,Workflow,Created,Ended,Creator,Attributes,Actions,Status',
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'showSystemExecutions',
            name: 'Show system executions',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
        {
            id: 'singleExecutionView',
            name: 'Show most recent execution only',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchData(widget, toolbox, params) {
        const { singleExecutionView } = widget.configuration;
        const executionActions = new Stage.Common.ExecutionActions(toolbox);

        if (singleExecutionView) {
            const paramDeploymentId = params.deployment_id;

            if (paramDeploymentId) {
                return new Stage.Common.DeploymentActions(toolbox)
                    .doGet({
                        id: paramDeploymentId,
                        _include: 'latest_execution'
                    })
                    .then(deployment => executionActions.doGet(deployment.latest_execution));
            }

            return Promise.reject(
                'When "Show most recent execution only" widget configuration option is turned on, Deployment ID must be selected.'
            );
        }

        return executionActions.doGetAll(params);
    },

    fetchParams(widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            status_display: toolbox.getContext().getValue('executionStatus'),
            _include_system_workflows:
                widget.configuration.showSystemExecutions &&
                !toolbox.getContext().getValue('blueprintId') &&
                !toolbox.getContext().getValue('deploymentId')
        };
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;
        const { singleExecutionView } = widget.configuration;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        if (singleExecutionView) {
            const lastExecution = data;
            if (isEmpty(lastExecution)) {
                const { ErrorMessage } = Stage.Basic;
                return <ErrorMessage error={Stage.i18n.t('widgets.executions.noExecutionFound')} />;
            }
            return <SingleExecution execution={lastExecution} toolbox={toolbox} />;
        }

        const selectedExecution = toolbox.getContext().getValue('executionId');
        const params = this.fetchParams(widget, toolbox);

        const formattedData = {
            items: _.map(data.items, item => ({
                ...item,
                created_at: Stage.Utils.Time.formatTimestamp(item.created_at), // 2016-07-20 09:10:53.103579
                scheduled_for: Stage.Utils.Time.formatTimestamp(item.scheduled_for),
                ended_at: Stage.Utils.Time.formatTimestamp(item.ended_at),
                isSelected: item.id === selectedExecution
            })),
            total: _.get(data, 'metadata.pagination.total', 0),
            blueprintId: !!params.blueprint_id,
            deploymentId: !!params.deployment_id
        };

        return <ExecutionsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
