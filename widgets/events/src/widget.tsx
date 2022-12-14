// @ts-nocheck File not migrated fully to TS

import EventsTable from './EventsTable';
import './widget.css';

const widgetId = 'events';
const t = Stage.Utils.getT(`widgets.${widgetId}`);
const fieldsToShowItemsTranslationPrefix = 'configuration.fieldsToShow.items';

const fieldsToShowItems = Object.values(
    t(fieldsToShowItemsTranslationPrefix, {
        returnObjects: true
    })
);

const fieldsToShowDefaultItems = [
    t(`${fieldsToShowItemsTranslationPrefix}.icon`),
    t(`${fieldsToShowItemsTranslationPrefix}.timestamp`),
    t(`${fieldsToShowItemsTranslationPrefix}.blueprint`),
    t(`${fieldsToShowItemsTranslationPrefix}.deployment`),
    t(`${fieldsToShowItemsTranslationPrefix}.workflow`),
    t(`${fieldsToShowItemsTranslationPrefix}.operation`),
    t(`${fieldsToShowItemsTranslationPrefix}.nodeId`),
    t(`${fieldsToShowItemsTranslationPrefix}.nodeInstanceId`),
    t(`${fieldsToShowItemsTranslationPrefix}.message`)
];

Stage.defineWidget({
    id: widgetId,
    name: t('name'),
    description: t('description'),
    initialWidth: 12,
    initialHeight: 18,
    fetchUrl: '[manager]/events[params]',
    isReact: true,
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
            name: t('configuration.fieldsToShow.name'),
            placeHolder: t('configuration.fieldsToShow.placeholder'),
            items: fieldsToShowItems,
            default: fieldsToShowDefaultItems.join(','),
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'colorLogs',
            name: t('configuration.colorLogs.name'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'maxMessageLength',
            name: t('configuration.maxMessageLength.name'),
            default: EventsTable.MAX_MESSAGE_LENGTH,
            type: Stage.Basic.GenericField.NUMBER_TYPE,
            min: 10
        }
    ],

    fetchParams(widget, toolbox) {
        const params = {};

        const eventFilter = toolbox.getContext().getValue('eventFilter') || {};

        const blueprintId = toolbox.getContext().getValue('blueprintId');
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = _.castArray(blueprintId);
        }

        const deploymentId = toolbox.getContext().getValue('deploymentId');
        if (!_.isEmpty(deploymentId)) {
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

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const SELECTED_EVENT_ID = toolbox.getContext().getValue('eventId');
        const SELECTED_LOG_ID = toolbox.getContext().getValue('logId');
        const eventFilter = toolbox.getContext().getValue('eventFilter') || {};

        const CONTEXT_PARAMS = this.fetchParams(widget, toolbox);

        const blueprintId = CONTEXT_PARAMS.blueprint_id;
        const deploymentId = CONTEXT_PARAMS.deployment_id;
        const nodeId = CONTEXT_PARAMS.node_id;
        const nodeInstanceId = CONTEXT_PARAMS.node_instance_id;
        const executionId = CONTEXT_PARAMS.execution_id;

        const formattedData = {
            items: _.map(data.items, item => {
                // eslint-disable-next-line no-underscore-dangle
                const id = item._storage_id;
                return {
                    ...item,
                    id,
                    timestamp: Stage.Utils.Time.formatTimestamp(
                        item.reported_timestamp,
                        'DD-MM-YYYY HH:mm:ss.SSS',
                        moment.ISO_8601
                    ),
                    isSelected: id === SELECTED_EVENT_ID || (widget.configuration.showLogs && id === SELECTED_LOG_ID)
                };
            }),
            total: _.get(data, 'metadata.pagination.total', 0),
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
