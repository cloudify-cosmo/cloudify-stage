// @ts-nocheck File not migrated fully to TS

import DetailsIcon from './DetailsIcon';
import DetailsModal from './DetailsModal';
import ErrorCausesPropType from './props/ErrorCausesPropType';

const t = Stage.Utils.getT('widgets.events');

export default class EventsTable extends React.Component {
    static MAX_MESSAGE_LENGTH = 200;

    constructor(props, context) {
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

    shouldComponentUpdate(nextProps, nextState) {
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

    getHighlightedText(text, parameterName, highlightColor = 'yellow') {
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

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    isOneElementLike = (collection: unknown): boolean => {
        return _.size(collection) === 1;
    };

    hideDetailsModal = () => {
        this.setState({ showDetailsModal: false });
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    selectEvent(eventId) {
        const { toolbox } = this.props;
        const selectedEventId = toolbox.getContext().getValue('eventId');
        toolbox.getContext().setValue('eventId', eventId === selectedEventId ? null : eventId);
    }

    showDetailsModal(event) {
        this.setState({ event, showDetailsModal: true });
    }

    render() {
        const { error, event, showDetailsModal } = this.state;
        const { data, widget } = this.props;
        const NO_DATA_MESSAGE = "There are no Events/Logs available. Probably there's no deployment created, yet.";
        const { CopyToClipboardButton, DataTable, ErrorMessage, HighlightText, Icon, Popup } = Stage.Basic;
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
                        label={t('columns.timestamp')}
                        name="timestamp"
                        width="10%"
                        show={fieldsToShow.includes(t('columns.timestamp'))}
                    />
                    <DataTable.Column
                        label={t('columns.type')}
                        name="event_type"
                        show={fieldsToShow.includes(t('columns.type'))}
                    />
                    <DataTable.Column
                        label={t('columns.blueprint')}
                        name="blueprint_id"
                        show={
                            !this.isOneElementLike(data.blueprintId) &&
                            !this.isOneElementLike(data.deploymentId) &&
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            !this.isOneElementLike(data.executionId) &&
                            fieldsToShow.includes(t('columns.blueprint'))
                        }
                    />
                    <DataTable.Column
                        label={t('columns.deployment')}
                        name="deployment_display_name"
                        show={
                            !this.isOneElementLike(data.deploymentId) &&
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            !this.isOneElementLike(data.executionId) &&
                            fieldsToShow.includes(t('columns.deployment'))
                        }
                    />
                    <DataTable.Column
                        label={t('columns.deploymentId')}
                        name="deployment_id"
                        show={
                            !this.isOneElementLike(data.deploymentId) &&
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            !this.isOneElementLike(data.executionId) &&
                            fieldsToShow.includes(t('columns.deploymentId'))
                        }
                    />
                    <DataTable.Column
                        label={t('columns.nodeId')}
                        name="node_name"
                        show={!this.isOneElementLike(data.nodeInstanceId) && fieldsToShow.includes(t('columns.nodeId'))}
                    />
                    <DataTable.Column
                        label={t('columns.nodeInstanceId')}
                        name="node_instance_id"
                        show={
                            !this.isOneElementLike(data.nodeInstanceId) &&
                            fieldsToShow.includes(t('columns.nodeInstanceId'))
                        }
                    />
                    <DataTable.Column
                        label={t('columns.workflow')}
                        name="workflow_id"
                        show={!this.isOneElementLike(data.executionId) && fieldsToShow.includes(t('columns.workflow'))}
                    />
                    <DataTable.Column
                        label={t('columns.operation')}
                        name="operation"
                        show={fieldsToShow.includes(t('columns.operation'))}
                    />
                    <DataTable.Column label={t('columns.message')} show={fieldsToShow.includes(t('columns.message'))} />
                    {data.items.map(item => {
                        const isEventType = item.type === EventUtils.eventType;
                        const messageText = Json.stringify(item.message, false);
                        const showDetailsIcon = !_.isEmpty(item.error_causes) || messageText.length > maxMessageLength;

                        // eslint-disable-next-line
                        console.log(item.event_type);

                        // eslint-disable-next-line
                        console.log(item.level);

                        const eventOptions = isEventType
                            ? EventUtils.getEventTypeOptions(item.event_type)
                            : EventUtils.getLogLevelOptions(item.level);
                        const eventName =
                            eventOptions.text || _.capitalize(_.lowerCase(isEventType ? item.event_type : item.level));
                        const EventIcon = () => (
                            <span style={{ color: '#2c4b68', lineHeight: 1 }}>
                                {isEventType ? (
                                    <i
                                        style={{ fontFamily: 'cloudify', fontSize: 26 }}
                                        className={`icon ${eventOptions.iconClass}`}
                                    >
                                        {eventOptions.iconChar}
                                    </i>
                                ) : (
                                    <Icon
                                        name={eventOptions.icon}
                                        color={eventOptions.color}
                                        circular
                                        inverted
                                        className={eventOptions.class}
                                    />
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
                                        <span>
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
                {showDetailsModal && <DetailsModal event={event} onClose={this.hideDetailsModal} />}
            </div>
        );
    }
}

EventsTable.propTypes = {
    data: PropTypes.shape({
        blueprintId: PropTypes.arrayOf(PropTypes.string),
        deploymentId: PropTypes.arrayOf(PropTypes.string),
        executionId: PropTypes.arrayOf(PropTypes.string),
        items: PropTypes.arrayOf(
            PropTypes.shape({
                blueprint_id: PropTypes.string,
                deployment_id: PropTypes.string,
                deployment_display_name: PropTypes.string,
                error_causes: ErrorCausesPropType,
                event_type: PropTypes.string,
                id: PropTypes.number,
                isSelected: PropTypes.bool,
                level: PropTypes.string,
                message: PropTypes.string,
                node_instance_id: PropTypes.string,
                node_name: PropTypes.string,
                operation: PropTypes.string,
                type: PropTypes.string,
                workflow_id: PropTypes.string
            })
        ),
        nodeInstanceId: PropTypes.arrayOf(PropTypes.string),
        timestamp: PropTypes.string,
        total: PropTypes.number
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
