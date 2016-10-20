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
        this.props.context.getEventBus().on('executions:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('executions:refresh', this._refreshData);
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

                <table className="ui very compact table executionsTable">
                    <thead>
                    <tr>
                        <th>Blueprint</th>
                        <th>Deployment</th>
                        <th>Workflow</th>
                        <th>Id</th>
                        <th>Created</th>
                        <th>Is System</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className='row'>
                                    <td>{item.blueprint_id}</td>
                                    <td>{item.deployment_id}</td>
                                    <td>{item.workflow_id}</td>
                                    <td>{item.id}</td>
                                    <td>{item.created_at}</td>
                                    <td>{item.is_system_workflow ? 'true' : 'false'}</td>
                                    <td>
                                        {item.status}
                                        { _.isEmpty(item.error) ?
                                            <i className="check circle icon inverted green"></i>
                                            :
                                            <i className="remove circle icon inverted red"></i>
                                        }
                                    </td>
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
