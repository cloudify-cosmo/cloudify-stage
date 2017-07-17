/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class EventsTable extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        }

        this.actions = new Stage.Common.EventActions();
    }

    static MAX_MESSAGE_LENGTH = 200;

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
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

    render() {
        let {ErrorMessage, DataTable, Popup, HighlightText} = Stage.Basic;
        let {JsonUtils} = Stage.Common;

        let fieldsToShow = this.props.widget.configuration.fieldsToShow;
        let colorLogs = this.props.widget.configuration.colorLogs;
        let maxMessageLength = this.props.widget.configuration.maxMessageLength || EventsTable.MAX_MESSAGE_LENGTH;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} />

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className="eventsTable">

                    <DataTable.Column label="" width="40px" show={fieldsToShow.indexOf("Icon") >= 0}/>
                    <DataTable.Column label="Timestamp" width="10%" show={fieldsToShow.indexOf("Timestamp") >= 0}/>
                    <DataTable.Column label="Type" show={fieldsToShow.indexOf("Type") >= 0}/>
                    <DataTable.Column label="Blueprint" show={!this.props.data.blueprintId && !this.props.data.deploymentId &&
                                            !this.props.data.executionId && fieldsToShow.indexOf("Blueprint") >= 0} />
                    <DataTable.Column label="Deployment" show={!this.props.data.deploymentId && !this.props.data.executionId &&
                                            fieldsToShow.indexOf("Deployment") >= 0} />
                    <DataTable.Column label="Workflow" show={!this.props.data.executionId && fieldsToShow.indexOf("Workflow") >= 0} />
                    <DataTable.Column label="Operation" show={fieldsToShow.indexOf("Operation") >= 0}/>
                    <DataTable.Column label="Node Name" show={fieldsToShow.indexOf("Node Name") >= 0}/>
                    <DataTable.Column label="Node Id" show={fieldsToShow.indexOf("Node Id") >= 0}/>
                    <DataTable.Column label="Message" show={fieldsToShow.indexOf("Message") >= 0}/>

                    {
                        this.props.data.items.map((item, index) => {
                            let event = this.actions.getEventDef(item.event_type || item.level);
                            let rowClassName = 'verticalAlignTop' + (colorLogs ? ` ${event.class}` : '');
                            const TRUNCATE_OPTIONS = {'length': maxMessageLength};

                            return (
                                <DataTable.Row key={item.id + index} selected={item.isSelected}
                                               onClick={this._selectEvent.bind(this, item.id)} className={rowClassName}>
                                    <DataTable.Data className="alignCenter"><i className={`eventsType ${event.icon}`}></i></DataTable.Data>
                                    <DataTable.Data className="alignCenter noWrap">{item.timestamp}</DataTable.Data>
                                    <DataTable.Data>{event.text}</DataTable.Data>
                                    <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                    <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                    <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                    <DataTable.Data>{item.operation}</DataTable.Data>
                                    <DataTable.Data>{item.node_name}</DataTable.Data>
                                    <DataTable.Data>{item.node_instance_id}</DataTable.Data>
                                    <DataTable.Data>
                                        {item.message &&
                                            <Popup position='top left' hoverable wide="very">
                                                <Popup.Trigger>
                                                    <span>
                                                        {
                                                            _.truncate(JsonUtils.stringify(item.message, false), TRUNCATE_OPTIONS)
                                                        }
                                                    </span>
                                                </Popup.Trigger>
                                                <HighlightText>{JsonUtils.stringify(item.message, true)}</HighlightText>
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
