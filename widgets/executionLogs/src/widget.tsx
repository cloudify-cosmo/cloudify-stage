import type { PaginatedResponse } from 'backend/types';
import type { PageSizeConfiguration, PollingTimeConfiguration } from 'app/utils/GenericConfig';
import LogsTable from './LogsTable';

const widgetId = 'executionLogs';
// const translate = Stage.Utils.getT(`widgets.${widgetId}`);

export interface Event {
    id: string;
    /* eslint-disable camelcase */
    execution_id: string;
    message: string;
    error_causes: { message: string; traceback: string; type: string }[] | null;
    event_type: string;
    level: string;
    reported_timestamp: string;
    type: string;
    /* eslint-enable camelcase */
}

interface ExecutionLogsParams {
    // eslint-disable-next-line camelcase
    execution_id: string;
}

type ExecutionLogsData = PaginatedResponse<Event>;

type ExecutionLogsConfiguration = PollingTimeConfiguration & PageSizeConfiguration;

Stage.defineWidget<ExecutionLogsParams, ExecutionLogsData, ExecutionLogsConfiguration>({
    id: widgetId,
    initialWidth: 12,
    initialHeight: 18,
    fetchUrl: '[manager]/events?[params]',
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('events'), // TODO: Change to `executionLogs`
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(2), Stage.GenericConfig.PAGE_SIZE_CONFIG()],

    fetchParams(_widget, toolbox) {
        const executionId = toolbox.getContext().getValue('executionId');

        return {
            execution_id: executionId
        };
    },

    render(_widget, data, _error, toolbox) {
        const { Loading, Message } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const executionId = toolbox.getContext().getValue('executionId');

        if (!executionId) {
            return <Message>Please select execution in order to see execution logs.</Message>;
        }

        return <LogsTable data={data} />;
    }
});
