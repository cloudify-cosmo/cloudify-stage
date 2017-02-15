/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import ActiveExecutionStatus from './ActiveExecutionStatus';
import { isActiveExecution } from './utils';

let PropTypes = React.PropTypes;

export default class extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onCancelExecution: PropTypes.func,
        onMenuAction: PropTypes.func,
        onError: PropTypes.func
    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onCancelExecution: ()=>{},
        onMenuAction: ()=>{},
        onError: ()=>{}
    };

    render() {
        var DataSegment = Stage.Basic.DataSegment;

        return (
            <DataSegment totalSize={this.props.data.total}
                     pageSize={this.props.widget.configuration.pageSize}
                     fetchData={this.props.fetchData}>
                {
                    this.props.data.items.map((item) => {

                        let activeExecutions = item.executions.filter((execution) => isActiveExecution(execution));
                        if (activeExecutions.size > 1) {
                            this.props.onError('Internal error: More than one execution is running for \'' + item.id + '\' deployment')
                        }

                        return (
                            <DataSegment.Item key={item.id} select={item.isSelected}
                                          onClick={()=>this.props.onSelectDeployment(item)}>
                                <div className="ui grid">
                                    <div className="four wide center aligned column rightDivider">
                                        <h3 className="ui icon header verticalCenter">{item.id}</h3>
                                    </div>
                                    <div className="two wide column">
                                        <h5 className="ui icon header">Blueprint</h5>
                                        <p>{item.blueprint_id}</p>
                                    </div>
                                    <div className="two wide column">
                                        <h5 className="ui icon header">Created</h5>
                                        <p>{item.created_at}</p>
                                    </div>
                                    <div className="two wide column">
                                        <h5 className="ui icon header">Updated</h5>
                                        <p>{item.updated_at}</p>
                                    </div>
                                    <div className="four wide column">
                                        <h5 className="ui icon header">Nodes ({item.nodeSize})</h5>
                                        <div className="ui four column grid">
                                            <div className="column center aligned">
                                                <NodeState icon="checkmark" title="running" color="green"
                                                           value={item.nodeStates.started}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="spinner" title="in progress" color="yellow"
                                                           value={_.add(item.nodeStates.uninitialized, item.nodeStates.created)}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="exclamation" title="warning" color="orange"
                                                           value={0}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="remove" title="error" color="red"
                                                           value={_.add(item.nodeStates.deleted, item.nodeStates.stopped)}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="two wide column action">
                                        {
                                            _.isEmpty(activeExecutions)
                                            ?
                                            <MenuAction item={item} onSelectAction={this.props.onMenuAction}/>
                                            :
                                            <ActiveExecutionStatus item={activeExecutions[0]} onCancelExecution={this.props.onCancelExecution}/>
                                        }
                                    </div>
                                </div>
                            </DataSegment.Item>
                        );
                    })
                }
            </DataSegment>
        );
    }
}

function NodeState(props) {
    return (
        <div className="ui compact segments nodeState" data-title={_.capitalize(props.title)} data-content={`${props.value?props.value:0} node instances in '${props.title}' state`} ref={(popup)=>{$(popup).popup()}}>
            <div className={`ui segment ${props.color} inverted`}>
                <i className={`${props.icon} icon`}></i>
            </div>
            <div className={`ui segment ${props.color} tertiary inverted`}>{props.value?props.value:0}</div>
        </div>
    )
}