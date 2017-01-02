/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class EventsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        }
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


    _selectEvent(item) {
        var oldSelectedEventId = this.props.toolbox.getContext().getValue('eventId');
        this.props.toolbox.getContext().setValue('eventId',item.id === oldSelectedEventId ? null : item.id);
    }
    
    render() {
        var ErrorMessage = Stage.Basic.ErrorMessage;

        var filteredColumnsTitles = [];
        if (!this.props.data.blueprintId && !this.props.data.deploymentId && !this.props.data.executionId) filteredColumnsTitles.push(<th key='blueprintHeader'>Blueprint</th>);
        if (!this.props.data.deploymentId && !this.props.data.executionId) filteredColumnsTitles.push(<th key='deploymentHeader'>Deployment</th>);
        if (!this.props.data.executionId ) filteredColumnsTitles.push( <th key='workflowHeader'>Workflow</th>);

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <table className="ui very compact table eventsTable">
                    <thead>
                    <tr>
                        {filteredColumnsTitles}
                        <th>Event Type</th>
                        <th>Timestamp</th>
                        <th>Operation</th>
                        <th>Node Name</th>
                        <th>Node Id</th>
                        <th>Message</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            var filteredColumns = [];

                            if (!this.props.data.blueprintId && !this.props.data.deploymentId && !this.props.data.executionId) filteredColumns.push(<td key='blueprint'>{item.context.blueprint_id}</td>);
                            if (!this.props.data.deploymentId && !this.props.data.executionId)filteredColumns.push( <td key='deployment'>{item.context.deployment_id}</td>);
                            if (!this.props.data.executionId) filteredColumns.push( <td key='workflow'>{item.context.workflow_id}</td>);

                            return (
                                <tr key={item.id} className={'row ' + (item.isSelected ? 'active' : '')} onClick={this._selectEvent.bind(this,item)}>
                                    {filteredColumns}
                                    <td>{item.event_type}</td>
                                    <td>{item.timestamp}</td>
                                    <td>{item.context.operation}</td>
                                    <td>{item.context.node_name}</td>
                                    <td>{item.context.node_id}</td>
                                    <td>{item.message.text}</td>

                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
