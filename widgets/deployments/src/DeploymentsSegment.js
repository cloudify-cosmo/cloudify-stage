/**
 * Created by kinneretzin on 18/10/2016.
 */

import PropTypes from 'prop-types';

import MenuAction from './MenuAction';
import ActiveExecutionStatus from './ActiveExecutionStatus';
import DeploymentUpdatedIcon from './DeploymentUpdatedIcon';

export default class DeploymentsSegment extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onCancelExecution: PropTypes.func,
        onMenuAction: PropTypes.func,
        onError: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        noDataMessage: PropTypes.string
    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onCancelExecution: ()=>{},
        onMenuAction: ()=>{},
        onError: ()=>{},
        onSetVisibility: ()=>{},
        allowedSettingTo: ['tenant'],
        noDataMessage: ''
    };

    render() {
        let {DataSegment, ResourceVisibility} = Stage.Basic;
        const {NodeInstancesConsts} = Stage.Common;

        return (
            <DataSegment totalSize={this.props.data.total}
                         pageSize={this.props.widget.configuration.pageSize}
                         fetchData={this.props.fetchData}
                         searchable={true}
                         noDataMessage={this.props.noDataMessage}>
                {
                    this.props.data.items.map((item) => {
                        return (
                            <DataSegment.Item key={item.id} selected={item.isSelected} className={item.id}
                                          onClick={()=>this.props.onSelectDeployment(item)}>
                                <div className="ui grid">
                                    <div className="three wide center aligned column rightDivider">
                                        <h3 className="ui icon header verticalCenter breakWord"><a href="javascript:void(0)" className="breakWord">{item.id}</a></h3>
                                        <ResourceVisibility visibility={item.visibility} onSetVisibility={(visibility) => this.props.onSetVisibility(item.id, visibility)} allowedSettingTo={this.props.allowedSettingTo} className="topRightCorner"/>
                                        <DeploymentUpdatedIcon show={item.isUpdated} className="rightFloated" />
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
                                        <h5 className="ui icon header">Node Instances ({item.nodeSize})</h5>
                                        <div className="ui four column grid nodesStates">
                                            {
                                                _.map(NodeInstancesConsts.groupStates, (groupState) =>
                                                    <div key={groupState.name} className="column center aligned">
                                                        <NodeState icon={groupState.icon} title={groupState.name}
                                                                   state={_.join(groupState.states, ', ')} color={groupState.color}
                                                                   value={_.sum(_.map(groupState.states, (state) =>
                                                                       _.isNumber(item.nodeStates[state]) ? item.nodeStates[state] : 0))}/>
                                                    </div>
                                                )
                                            }
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
    const areManyStates = _.size(_.words(props.state)) > 1;

    return (
        <Popup header={_.capitalize(props.title)}
               content={<span><strong>{value}</strong> node instances in <strong>{props.state}</strong> state{areManyStates && 's'}</span>}
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