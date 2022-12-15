import { castArray, isEmpty } from 'lodash';
import ExecutionsTable from './ExecutionsTable';
import SingleExecution from './SingleExecution';

import './widget.css';

export interface ExecutionsWidgetParams {
    /* eslint-disable camelcase */
    blueprint_id: any;
    deployment_id: string | string[] | null | undefined;
    status_display: any;
    _include_system_workflows?: boolean;
    /* eslint-enable camelcase */
}

export interface ExecutionsWidgetConfiguration {
    fieldsToShow?: string;
    showSystemExecutions?: boolean;
    singleExecutionView?: boolean;
}

const t = Stage.Utils.getT('widgets.executions');

Stage.defineWidget<ExecutionsWidgetParams, any, ExecutionsWidgetConfiguration>({
    id: 'executions',
    name: t('name'),
    description: t('description'),
    initialWidth: 8,
    initialHeight: 24,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executions'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {
            id: 'fieldsToShow',
            name: t('configuration.fieldsToShow.name'),
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
            name: t('configuration.showSystemExecutions.name'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
        {
            id: 'singleExecutionView',
            name: t('configuration.singleExecutionView.name'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchData(widget, toolbox, params) {
        const { singleExecutionView } = widget.configuration;
        const executionActions = new Stage.Common.Executions.Actions(toolbox.getManager());

        if (singleExecutionView) {
            const deploymentIdFromParams = castArray(params.deployment_id)[0];

            if (deploymentIdFromParams) {
                return new Stage.Common.Deployments.Actions(toolbox.getManager())
                    .doGet(
                        {
                            id: deploymentIdFromParams
                        },
                        {
                            _include: 'id,latest_execution'
                        }
                    )
                    .then(deployment => executionActions.doGet(deployment.latest_execution));
            }

            return Promise.reject(t('invalidConfigurationError'));
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

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;
        const { singleExecutionView } = widget.configuration;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        if (singleExecutionView) {
            const latestExecution = data;
            if (isEmpty(latestExecution)) {
                const { ErrorMessage } = Stage.Basic;
                return <ErrorMessage error={t('noExecutionFound')} />;
            }
            return <SingleExecution execution={latestExecution} toolbox={toolbox} />;
        }

        const selectedExecution = toolbox.getContext().getValue('executionId');
        const params = this.fetchParams!(widget, toolbox);

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

        // @ts-ignore ExecutionsTable is not migrated yet
        return <ExecutionsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
