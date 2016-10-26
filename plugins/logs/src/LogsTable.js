/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        }
    }

    _refreshData() {
        this.props.context.refresh();
    }

    componentDidMount() {
        this.props.context.getEventBus().on('events:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('events:refresh', this._refreshData);
    }


    _selectEvent(item) {
        var oldSelectedEventId = this.props.context.getValue('eventId');
        this.props.context.setValue('eventId',item.id === oldSelectedEventId ? null : item.id);
    }
    
    render() {
        return (
            <div>
                {
                    this.state.error ?
                        <div className="ui error message" style={{"display":"block"}}>
                            <div className="header">Error Occured</div>
                            <p>{this.state.error}</p>
                        </div>
                        :
                        ''
                }

                <table className="ui very compact table logsTable">
                    <thead>
                    <tr>
                        {!this.props.data.blueprintId && !this.props.data.deploymentId && !this.props.data.executionId ? <th>Blueprint</th> : ''}
                        {!this.props.data.deploymentId && !this.props.data.executionId ? <th>Deployment</th> : ''}
                        { !this.props.data.executionId ? <th>Workflow</th> : ''}
                        <th>Log Level</th>
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
                            return (
                                <tr key={item.id} className={'row ' + (item.isSelected ? 'active' : '')} onClick={this._selectEvent.bind(this,item)}>
                                    {!this.props.data.blueprintId && !this.props.data.deploymentId && !this.props.data.executionId ? <td>{item.context.blueprint_id}</td> : ''}
                                    {!this.props.data.deploymentId && !this.props.data.executionId ? <td>{item.context.deployment_id}</td> : ''}
                                    { !this.props.data.executionId ? <td>{item.context.workflow_id}</td> : '' }

                                    <td>{item.level}</td>
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
