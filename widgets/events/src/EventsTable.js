/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class EventsTable extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        };
    }

    static MAX_MESSAGE_LENGTH = 200;

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget.configuration, nextProps.widget.configuration)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('events:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('events:refresh', this._refreshData);
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _selectEvent(eventId) {
        let selectedEventId = this.props.toolbox.getContext().getValue('eventId');
        this.props.toolbox.getContext().setValue('eventId', eventId === selectedEventId ? null : eventId);
    }

    getHighlightedText(text) {
        let eventFilter = this.props.toolbox.getContext().getValue('eventFilter') || {};
        let messageText = eventFilter.messageText;

        if (!_.isEmpty(messageText)) {
            let parts = text.split(new RegExp(`(${messageText})`, 'gi'));
            return (
                <span>
                    {
                        parts.map((part, i) =>
                            <span key={i}
                                  style={part.toLowerCase() === messageText.toLowerCase() ? { backgroundColor: 'yellow' } : {} }>
                            {part}
                            </span>
                        )
                    }
                </span>
            );
        } else {
            return (
                <span>
                    {text}
                </span>
            );
        }

    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Events/Logs available. Probably there\'s no deployment created, yet.';
        let {CopyToClipboardButton, DataTable, ErrorMessage, HighlightText, Icon, Popup} = Stage.Basic;
        let {JsonUtils, EventUtils} = Stage.Common;

        let fieldsToShow = this.props.widget.configuration.fieldsToShow;
        let colorLogs = this.props.widget.configuration.colorLogs;
        let maxMessageLength = this.props.widget.configuration.maxMessageLength || EventsTable.MAX_MESSAGE_LENGTH;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className="eventsTable"
                           noDataMessage={NO_DATA_MESSAGE}>>

                    <DataTable.Column label="" width="40px" show={fieldsToShow.indexOf('Icon') >= 0}/>
                    <DataTable.Column label="Timestamp" name="timestamp" width="10%" show={fieldsToShow.indexOf('Timestamp') >= 0}/>
                    <DataTable.Column label="Type" name="event_type" show={fieldsToShow.indexOf('Type') >= 0}/>
                    <DataTable.Column label="Blueprint" name="blueprint_id"
                                      show={!this.props.data.blueprintId && !this.props.data.deploymentId &&
                                            !this.props.data.executionId && fieldsToShow.indexOf('Blueprint') >= 0} />
                    <DataTable.Column label="Deployment" name="deployment_id"
                                      show={!this.props.data.deploymentId && !this.props.data.executionId &&
                                            fieldsToShow.indexOf('Deployment') >= 0} />
                    <DataTable.Column label="Node Id" name="node_name" show={fieldsToShow.indexOf('Node Id') >= 0}/>
                    <DataTable.Column label="Node Instance Id" name="node_instance_id" show={fieldsToShow.indexOf('Node Instance Id') >= 0}/>
                    <DataTable.Column label="Workflow" name="workflow_id" show={!this.props.data.executionId && fieldsToShow.indexOf('Workflow') >= 0} />
                    <DataTable.Column label="Operation" name="operation" show={fieldsToShow.indexOf('Operation') >= 0}/>
                    <DataTable.Column label="Message" show={fieldsToShow.indexOf('Message') >= 0}/>

                    {
                        this.props.data.items.map((item, index) => {
                            const eventOrLogOption = EventUtils.getEventTypeOrLogLevelOption(item.event_type || item.level);
                            const rowClassName = 'verticalAlignTop' + (colorLogs ? ` ${eventOrLogOption.class}` : '');
                            const truncateOptions = {'length': maxMessageLength};

                            return (
                                <DataTable.Row key={item.id + index} selected={item.isSelected}
                                               onClick={this._selectEvent.bind(this, item.id)} className={rowClassName}>
                                    <DataTable.Data className="alignCenter">
                                        {
                                            item.type === EventUtils.eventType &&
                                            (
                                                _.isEmpty(eventOrLogOption.text)
                                                ?
                                                    <i className={`eventsType icon big ${eventOrLogOption.icon}`} />
                                                :
                                                    <Popup>
                                                        <Popup.Trigger>
                                                            <i className={`eventsType icon big ${eventOrLogOption.icon}`} />
                                                        </Popup.Trigger>
                                                        <Popup.Content>
                                                            <span>{eventOrLogOption.text}</span>
                                                        </Popup.Content>
                                                    </Popup>
                                            )
                                        }
                                        {
                                            item.type === EventUtils.logType &&
                                            (
                                                _.isEmpty(eventOrLogOption.text)
                                                    ?
                                                    <Icon name={eventOrLogOption.icon} circular={eventOrLogOption.circular}
                                                          color={eventOrLogOption.color} className={`eventsType ${eventOrLogOption.class}`}
                                                          title={eventOrLogOption.text} inverted />
                                                    :
                                                    <Popup>
                                                        <Popup.Trigger>
                                                            <Icon name={eventOrLogOption.icon} circular={eventOrLogOption.circular}
                                                                  color={eventOrLogOption.color} className={`eventsType ${eventOrLogOption.class}`}
                                                                  title={eventOrLogOption.text} inverted />
                                                        </Popup.Trigger>
                                                        <Popup.Content>
                                                            <span>{eventOrLogOption.text}</span>
                                                        </Popup.Content>
                                                    </Popup>
                                            )

                                        }
                                    </DataTable.Data>
                                    <DataTable.Data className="alignCenter noWrap">{item.timestamp}</DataTable.Data>
                                    <DataTable.Data>{eventOrLogOption.text}</DataTable.Data>
                                    <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                    <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                    <DataTable.Data>{item.node_name}</DataTable.Data>
                                    <DataTable.Data>{item.node_instance_id}</DataTable.Data>
                                    <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                    <DataTable.Data>{item.operation}</DataTable.Data>
                                    <DataTable.Data>
                                        {item.message &&
                                            <Popup position='top left' hoverable wide="very">
                                                <Popup.Trigger>
                                                    <span>
                                                        {
                                                           this.getHighlightedText(_.truncate(JsonUtils.stringify(item.message, false), truncateOptions))
                                                        }
                                                    </span>
                                                </Popup.Trigger>
                                                <Popup.Content>
                                                    <HighlightText>{JsonUtils.stringify(item.message, true)}</HighlightText>
                                                    <CopyToClipboardButton content='Copy Message' text={item.message} className='rightFloated' />
                                                </Popup.Content>
                                            </Popup>
                                        }
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>
            </div>
        );
    }
}
