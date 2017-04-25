/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import ActiveExecutionStatus from './ActiveExecutionStatus';

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
        let { DataSegment } = Stage.Basic;

        return (
            <DataSegment totalSize={this.props.data.total}
                     pageSize={this.props.widget.configuration.pageSize}
                     fetchData={this.props.fetchData}>
                {
                    this.props.data.items.map((item) => {
                        return (
                            <DataSegment.Item key={item.id} selected={item.isSelected}
                                          onClick={()=>this.props.onSelectDeployment(item)}>
                                <div className="ui grid">
                                    <div className="three wide center aligned column rightDivider">
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
                                    <div className="two wide column">
                                        <h5 className="ui icon header">Creator</h5>
                                        <p>{item.created_by}</p>
                                    </div>
                                    <div className="four wide column">
                                        <h5 className="ui icon header">Nodes ({item.nodeSize})</h5>
                                        <div className="ui four column grid">
                                            <div className="column center aligned">
                                                <NodeState icon="checkmark" title="running" state="started" color="green"
                                                           value={item.nodeStates.started}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="spinner" title="in progress" state="uninitialized or created" color="yellow"
                                                           value={_.add(item.nodeStates.uninitialized, item.nodeStates.created)}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="exclamation" title="warning" state="undefined" color="orange"
                                                           value={0}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="remove" title="error" state="deleted or stopped" color="red"
                                                           value={_.add(item.nodeStates.deleted, item.nodeStates.stopped)}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="column action">
                                        {
                                            _.isEmpty(item.executions)
                                            ?
                                            <MenuAction item={item} onSelectAction={this.props.onMenuAction}/>
                                            :
                                            <ActiveExecutionStatus item={item.executions[0]} onCancelExecution={this.props.onCancelExecution}/>
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
    let { Segment, Icon, Popup } = Stage.Basic;
    let value = props.value ? props.value : 0;
    let disabled = value === 0;
    let color = disabled ? 'grey' : props.color;

    return (
        <Popup header={_.capitalize(props.title)}
               content={`${value} node instances in ${props.state} state`}
               trigger={
                   <Segment.Group className='nodeState' disabled={disabled}>
                       <Segment color={color} disabled={disabled} inverted>
                           <Icon name={props.icon} />
                       </Segment>
                       <Segment color={color} disabled={disabled} tertiary inverted>
                           {value}
                       </Segment>
                   </Segment.Group>
               }
        />
    )
}