import type { DataTableConfiguration, PollingTimeConfiguration } from 'app/utils/GenericConfig';
import type { CloudifyEventPart, CloudifyLogEventPart, FullEventData } from 'app/widgets/common/events';
import type { ExecutionLogsData } from './types';
import { basePageSize, commonIncludeKeys, translate, widgetId } from './consts';
import LogsTable from './LogsTable';

const includeKeys: (keyof FullEventData | keyof CloudifyLogEventPart | keyof CloudifyEventPart)[] = [
    ...commonIncludeKeys,
    'event_type',
    'level'
];

interface ExecutionLogsParams {
    // eslint-disable-next-line camelcase
    execution_id: string;
}

type ExecutionLogsConfiguration = PollingTimeConfiguration & DataTableConfiguration;

Stage.defineWidget<ExecutionLogsParams, ExecutionLogsData, ExecutionLogsConfiguration>({
    id: widgetId,
    initialWidth: 12,
    initialHeight: 24,
    fetchUrl: `[manager]/events?_include=${includeKeys.join(',')}[params]`,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(basePageSize),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('reported_timestamp'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],

    fetchParams(_widget, toolbox) {
        const executionId = toolbox.getContext().getValue('executionId');

        return {
            execution_id: executionId
        };
    },

    render(widget, data, _error, toolbox) {
        const { Loading, Message } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const executionId = toolbox.getContext().getValue('executionId');

        if (!executionId) {
            return <Message>{translate('noExecutionSelectedMessage')}</Message>;
        }

        const items = [...data.items].reverse();
        const moreItemsAvailable = data.metadata.pagination.size >= data.metadata.pagination.total;

        return (
            <LogsTable
                items={items}
                executionId={executionId}
                moreItemsAvailable={moreItemsAvailable}
                pageSize={widget.configuration.pageSize}
                toolbox={toolbox}
            />
        );
    }
});
