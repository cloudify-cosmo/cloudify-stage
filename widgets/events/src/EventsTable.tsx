import type { FetchDataFunction } from 'cloudify-ui-components';
import type { EventsWidgetConfiguration } from 'widgets/events/src/widget';
import DetailsIcon from './DetailsIcon';
import DetailsModal from './DetailsModal';
import type { Event } from './types';
import { isEventType } from './types';

const translate = Stage.Utils.getT('widgets.events');

export interface EventsTableProps {
    data: {
        items: Event[];
        total: any;
        blueprintId: string[] | undefined;
        deploymentId: string[] | undefined;
        nodeId: string[] | undefined;
        nodeInstanceId: string[] | undefined;
        executionId: string[] | undefined;
        eventFilter: any;
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<EventsWidgetConfiguration>;
}

export interface EventsTableState {
    error: null;
    event?: Event;
    showDetailsModal: boolean;
}
export default class EventsTable extends React.Component<EventsTableProps, EventsTableState> {
    static MAX_MESSAGE_LENGTH = 200;

    constructor(props: EventsTableProps, context: unknown) {
        super(props, context);

        this.state = {
            error: null,
            showDetailsModal: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('events:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: EventsTableProps, nextState: EventsTableState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget.configuration, nextProps.widget.configuration) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('events:refresh', this.refreshData);
    }

    getHighlightedText(text: string, parameterName: string, highlightColor = 'yellow') {
        const { toolbox } = this.props;
        const eventFilter = toolbox.getContext().getValue('eventFilter') || {};
        const highlightedTextFragment = eventFilter[parameterName];
        const strText = _.isString(text) ? text : '';

        if (!_.isEmpty(highlightedTextFragment)) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            const parts = strText.split(new RegExp(`(${_.escapeRegExp(highlightedTextFragment)})`, 'gi'));
            return (
                <span>
                    {parts.map((part, i) => (
                        <span
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            style={
                                part.toLowerCase() === highlightedTextFragment.toLowerCase()
                                    ? { backgroundColor: highlightColor }
                                    : {}
                            }
                        >
                            {part}
                        </span>
                    ))}
                </span>
            );
        }
        return <span>{strText}</span>;
    }

    fetchGridData: FetchDataFunction = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    isOneElementLike = (collection: Parameters<typeof _.size>[0]): boolean => {
        return _.size(collection) === 1;
    };

    hideDetailsModal = () => {
        this.setState({ event: undefined });
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    selectEvent(eventId: string) {
        const { toolbox } = this.props;
        const selectedEventId = toolbox.getContext().getValue('eventId');
        toolbox.getContext().setValue('eventId', eventId === selectedEventId ? null : eventId);
    }

    showDetailsModal(event: Event) {
        this.setState({ event });
    }

    render() {
        const { error, event } = this.state;
        const { data, widget } = this.props;
        const NO_DATA_MESSAGE = "There are no Events/Logs available. Probably there's no deployment created, yet.";
        const { DataTable, ErrorMessage, Icon, Popup } = Stage.Basic;
        const { EventUtils } = Stage.Common;
        const { Json } = Stage.Utils;
        const EmptySpace = () => <span>&nbsp;&nbsp;</span>;

        const { fieldsToShow } = widget.configuration;
        const { colorLogs } = widget.configuration;
        const maxMessageLength = widget.configuration.maxMessageLength || EventsTable.MAX_MESSAGE_LENGTH;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    className="eventsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="" width="40px" show={fieldsToShow.includes('Icon')} />
                    <DataTable.Column
                        label={translate('columns.timestamp')}
                        name="timestamp"
                        width="10%"
                        show={fieldsToShow.includes(translate('columns.timestamp'))}
                    />
                    <DataTable.Column
                        label={translate('columns.type')}
                        name="event_type"
                        show={fieldsToShow.includes(translate('columns.type'))}
                    />
                    <DataTable.Column
                        label={translate('columns.blueprint')}
                        name="blueprint_id"
                        show={
                            !this.isOneElementLike(data.blueprintId) &&
                            !this.isOneElementLike(data.deploymentId) &&
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            !this.isOneElementLike(data.executionId) &&
                            fieldsToShow.includes(translate('columns.blueprint'))
                        }
                    />
                    <DataTable.Column
                        label={translate('columns.deployment')}
                        name="deployment_display_name"
                        show={
                            !this.isOneElementLike(data.deploymentId) &&
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            !this.isOneElementLike(data.executionId) &&
                            fieldsToShow.includes(translate('columns.deployment'))
                        }
                    />
                    <DataTable.Column
                        label={translate('columns.deploymentId')}
                        name="deployment_id"
                        show={
                            !this.isOneElementLike(data.deploymentId) &&
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            !this.isOneElementLike(data.executionId) &&
                            fieldsToShow.includes(translate('columns.deploymentId'))
                        }
                    />
                    <DataTable.Column
                        label={translate('columns.nodeId')}
                        name="node_name"
                        show={
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            fieldsToShow.includes(translate('columns.nodeId'))
                        }
                    />
                    <DataTable.Column
                        label={translate('columns.nodeInstanceId')}
                        name="node_instance_id"
                        show={
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            fieldsToShow.includes(translate('columns.nodeInstanceId'))
                        }
                    />
                    <DataTable.Column
                        label={translate('columns.workflow')}
                        name="workflow_id"
                        show={
                            !this.isOneElementLike(data.executionId) &&
                            fieldsToShow.includes(translate('columns.workflow'))
                        }
                    />
                    <DataTable.Column
                        label={translate('columns.operation')}
                        name="operation"
                        show={fieldsToShow.includes(translate('columns.operation'))}
                    />
                    <DataTable.Column
                        label={translate('columns.message')}
                        show={fieldsToShow.includes(translate('columns.message'))}
                    />
                    {data.items.map(item => {
                        const messageText = Json.stringify(item.message, false);
                        const showDetailsIcon = !_.isEmpty(item.error_causes) || messageText.length > maxMessageLength;

                        const eventOptions = isEventType(item)
                            ? EventUtils.getEventTypeOptions(item.event_type)
                            : EventUtils.getLogLevelOptions(item.level);
                        const eventName =
                            eventOptions.text ||
                            _.capitalize(_.lowerCase(isEventType(item) ? item.event_type : item.level));
                        const EventIcon = () => (
                            <span style={{ color: '#2c4b68', lineHeight: 1 }}>
                                {'iconChar' in eventOptions ? (
                                    <i
                                        style={{ fontFamily: 'cloudify', fontSize: 26 }}
                                        className={`icon ${eventOptions.iconClass}`}
                                    >
                                        {eventOptions.iconChar}
                                    </i>
                                ) : (
                                    <Icon name={eventOptions.icon} color={eventOptions.color} circular inverted />
                                )}
                            </span>
                        );

                        const truncateOptions = { length: maxMessageLength };

                        return (
                            <DataTable.Row
                                key={item.id}
                                selected={item.isSelected}
                                onClick={() => this.selectEvent(item.id)}
                                className={colorLogs ? eventOptions.rowClass : ''}
                            >
                                <DataTable.Data className="alignCenter">
                                    {!eventName ? (
                                        <EventIcon />
                                    ) : (
                                        <Popup
                                            trigger={
                                                <span>
                                                    <EventIcon />
                                                </span>
                                            }
                                            content={<span>{eventName}</span>}
                                        />
                                    )}
                                </DataTable.Data>
                                <DataTable.Data className="alignCenter noWrap">{item.timestamp}</DataTable.Data>
                                <DataTable.Data>{eventName}</DataTable.Data>
                                <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                <DataTable.Data>{item.deployment_display_name}</DataTable.Data>
                                <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                <DataTable.Data>{item.node_name}</DataTable.Data>
                                <DataTable.Data>{item.node_instance_id}</DataTable.Data>
                                <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                <DataTable.Data>
                                    {this.getHighlightedText(item.operation, 'operationText', 'lawngreen')}
                                </DataTable.Data>
                                <DataTable.Data>
                                    {item.message && (
                                        <span style={{ wordBreak: 'break-word' }}>
                                            {this.getHighlightedText(
                                                _.truncate(messageText, truncateOptions),
                                                'messageText'
                                            )}
                                        </span>
                                    )}
                                    {showDetailsIcon && (
                                        <>
                                            <EmptySpace />
                                            <DetailsIcon onClick={() => this.showDetailsModal(item)} />
                                        </>
                                    )}
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
                {event && <DetailsModal event={event} onClose={this.hideDetailsModal} />}
            </div>
        );
    }
}
