/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';

let PropTypes = React.PropTypes;

export default class extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onMenuAction: PropTypes.func

    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onMenuAction: ()=>{}
    };

    render() {
        var Segment = Stage.Basic.Segment;

        return (
            <Segment totalSize={this.props.data.total}
                     pageSize={this.props.widget.configuration.pageSize}
                     fetchData={this.props.fetchData}>
                {
                    this.props.data.items.map((item) => {
                        return (
                            <Segment.Item key={item.id} select={item.isSelected}
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
                                        <div className="ui five column grid">
                                            <div className="column center aligned">
                                                <NodeState icon="spinner" title="uninitialized"
                                                           value={item.nodeStates.uninitialized}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="plus" title="created"
                                                           value={item.nodeStates.created}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="remove" title="deleted"
                                                           value={item.nodeStates.deleted}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="warning" title="stopped"
                                                           value={item.nodeStates.stopped}/>
                                            </div>
                                            <div className="column center aligned">
                                                <NodeState icon="checkmark" title="started"
                                                           value={item.nodeStates.started}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="two wide column action">
                                        <MenuAction item={item} onSelectAction={this.props.onMenuAction}/>
                                    </div>
                                </div>
                            </Segment.Item>
                        );
                    })
                }
            </Segment>
        );
    }
}

function NodeState(props) {
    return (
        <div className="ui compact segments nodeState" data-title={_.capitalize(props.title)} data-content={`${props.value?props.value:0} node instances has been ${props.title}`} ref={(popup)=>{$(popup).popup()}}>
            <div className="ui segment orange inverted">
                <i className={`${props.icon} icon`}></i>
            </div>
            <div className="ui segment orange tertiary inverted">{props.value?props.value:0}</div>
        </div>
    )
}