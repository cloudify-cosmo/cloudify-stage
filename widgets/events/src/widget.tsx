import type { DataTableConfiguration } from 'app/utils/GenericConfig';
import type { FullEventData } from '../../../app/widgets/common/events';
import EventsTable from './EventsTable';
import './widget.css';

const widgetId = 'events';
const translate = Stage.Utils.getT(`widgets.${widgetId}`);
const fieldsToShowItemsTranslationPrefix = 'configuration.fieldsToShow.items';

const fieldsToShowItems: string[] = Object.values(
    translate(fieldsToShowItemsTranslationPrefix, {
        returnObjects: true
    })
);

const fieldsToShowDefaultItems = [
    translate(`${fieldsToShowItemsTranslationPrefix}.icon`),
    translate(`${fieldsToShowItemsTranslationPrefix}.timestamp`),
    translate(`${fieldsToShowItemsTranslationPrefix}.blueprint`),
    translate(`${fieldsToShowItemsTranslationPrefix}.deployment`),
    translate(`${fieldsToShowItemsTranslationPrefix}.workflow`),
    translate(`${fieldsToShowItemsTranslationPrefix}.operation`),
    translate(`${fieldsToShowItemsTranslationPrefix}.nodeId`),
    translate(`${fieldsToShowItemsTranslationPrefix}.nodeInstanceId`),
    translate(`${fieldsToShowItemsTranslationPrefix}.message`)
];

export interface EventsWidgetConfiguration extends DataTableConfiguration {
    fieldsToShow: string[];
    showLogs: boolean;
    colorLogs: boolean;
    maxMessageLength: number;
}

export interface EventsWidgetParams {
    /* eslint-disable camelcase */
    blueprint_id?: string[];
    deployment_id?: string[];
    node_id?: string[];
    node_instance_id?: string[];
    execution_id?: string[];
    message?: string;
    level?: string;
    event_type?: string;
    _range?: string;
    type?: string;
    operation?: string;
    /* eslint-enable camelcase */
}

export type EventsWidgetData = Stage.Types.PaginatedResponse<FullEventData>;

Stage.defineWidget<EventsWidgetParams, EventsWidgetData, EventsWidgetConfiguration>({
    id: widgetId,
    initialWidth: 12,
    initialHeight: 18,
    fetchUrl: '[manager]/events[params]',
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('timestamp'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
        {
            id: 'fieldsToShow',
            name: translate('configuration.fieldsToShow.name'),
            placeHolder: translate('configuration.fieldsToShow.placeholder'),
            items: fieldsToShowItems,
            default: fieldsToShowDefaultItems.join(','),
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'colorLogs',
            name: translate('configuration.colorLogs.name'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'maxMessageLength',
            name: translate('configuration.maxMessageLength.name'),
            default: EventsTable.MAX_MESSAGE_LENGTH,
            type: Stage.Basic.GenericField.NUMBER_TYPE,
            min: 10
        }
    ],

    fetchParams(_widget, toolbox) {
        const params: EventsWidgetParams = {};

        const eventFilter = toolbox.getContext().getValue('eventFilter') || {};

        const blueprintId = toolbox.getContext().getValue('blueprintId');
        if (blueprintId && !_.isEmpty(blueprintId)) {
            params.blueprint_id = _.castArray(blueprintId);
        }

        const deploymentId = toolbox.getContext().getValue('deploymentId');
        if (deploymentId && !_.isEmpty(deploymentId)) {
            params.deployment_id = _.castArray(deploymentId);
        }

        const nodeId = toolbox.getContext().getValue('nodeId');
        if (!_.isEmpty(nodeId)) {
            params.node_id = _.castArray(nodeId);
        }

        const nodeInstanceId = toolbox.getContext().getValue('nodeInstanceId');
        if (!_.isEmpty(nodeInstanceId)) {
            params.node_instance_id = _.castArray(nodeInstanceId);
        }

        const executionId = toolbox.getContext().getValue('executionId');
        if (!_.isEmpty(executionId)) {
            params.execution_id = _.castArray(executionId);
        }

        const { messageText } = eventFilter;
        if (!_.isEmpty(messageText)) {
            params.message = `%${messageText}%`;
        }

        const { operationText } = eventFilter;
        if (!_.isEmpty(operationText)) {
            params.operation = `%${operationText}%`;
        }

        const { logLevel } = eventFilter;
        if (!_.isEmpty(logLevel)) {
            params.level = logLevel;
        }

        const { eventType } = eventFilter;
        if (!_.isEmpty(eventType)) {
            params.event_type = eventType;
        }

        let { timeStart } = eventFilter;
        let { timeEnd } = eventFilter;
        if (timeStart || timeEnd) {
            timeStart = timeStart ? timeStart.utc().toISOString() : '';
            timeEnd = timeEnd ? timeEnd.utc().toISOString() : '';
            // eslint-disable-next-line no-underscore-dangle
            params._range = `@reported_timestamp,${timeStart},${timeEnd}`;
        }

        params.type = eventFilter.type;

        return params;
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const SELECTED_EVENT_ID = toolbox.getContext().getValue('eventId');
        const SELECTED_LOG_ID = toolbox.getContext().getValue('logId');
        const eventFilter = toolbox.getContext().getValue('eventFilter') || {};

        const CONTEXT_PARAMS = this.fetchParams!(widget, toolbox);

        const blueprintId = CONTEXT_PARAMS.blueprint_id;
        const deploymentId = CONTEXT_PARAMS.deployment_id;
        const nodeId = CONTEXT_PARAMS.node_id;
        const nodeInstanceId = CONTEXT_PARAMS.node_instance_id;
        const executionId = CONTEXT_PARAMS.execution_id;

        const formattedData = {
            items: data.items.map(item => {
                // eslint-disable-next-line no-underscore-dangle
                const id = item._storage_id;
                return {
                    ...item,
                    id,
                    timestamp: Stage.Common.Events.Utils.getFormattedTimestamp(item),
                    isSelected: id === SELECTED_EVENT_ID || (widget.configuration.showLogs && id === SELECTED_LOG_ID)
                };
            }),
            total: data.metadata.pagination.total,
            blueprintId,
            deploymentId,
            nodeId,
            nodeInstanceId,
            executionId,
            eventFilter
        };

        return <EventsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
