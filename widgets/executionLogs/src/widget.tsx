import type { PaginatedResponse } from 'backend/types';
import type { PageSizeConfiguration, PollingTimeConfiguration } from 'app/utils/GenericConfig';
import type { CloudifyEventPart, CloudifyLogEventPart, Event } from 'app/widgets/common/events/types';
import LogsTable from './LogsTable';

const widgetId = 'executionLogs';
const translate = Stage.Utils.getT(`widgets.${widgetId}`);

const eventKeys: (keyof Event | keyof CloudifyLogEventPart | keyof CloudifyEventPart)[] = [
    '_storage_id',
    'execution_id',
    'message',
    'error_causes',
    'event_type',
    'level',
    'reported_timestamp',
    'type'
];

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
    fetchUrl: `[manager]/events?_include=${eventKeys.join(',')}[params]`,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executionLogs'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(2), Stage.GenericConfig.PAGE_SIZE_CONFIG(50)],

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
            return <Message>{translate('noExecutionSelectedMessage')}</Message>;
        }

        return <LogsTable data={data} />;
    }
});
