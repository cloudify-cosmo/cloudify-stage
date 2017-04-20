/**
 * Created by kinneretzin on 28/03/2017.
 */

import CreateClusterModal from './CreateClusterModal';
import JoinClusterModal from './JoinClusterModal';
import ClusterNodesList from './ClusterNodesList';

export default class ClusterManagement extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showCreate: false,
            showJoin: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('cluster:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('cluster:refresh', this._refreshData);
    }

    _showCreateCluster () {
        event.stopPropagation();

        this.setState({showCreate: true});
    }

    _showJoinCluster () {
        event.stopPropagation();

        this.setState({showJoin: true});
    }

    render() {
        var {ErrorMessage,Label,Icon} = Stage.Basic;

        var isClusterInitialized = this.props.data.state.initialized;
        return (
            <div>
                <ErrorMessage error={this.state.error || this.props.data.error}/>

                {
                    isClusterInitialized ?
                    <h3><Icon name='checkmark' color='green'/> Cluster Is initialized</h3> :
                    <h3>Cluster is Not Initialized</h3>
                }

                {
                    !isClusterInitialized &&
                    <Label as='a' onClick={this._showCreateCluster.bind(this)}>Create Cluster</Label>
                }
                {
                    !isClusterInitialized &&
                    <Label as='a' onClick={this._showJoinCluster.bind(this)}>Join Existing Cluster</Label>
                }


                {
                    isClusterInitialized &&
                    <ClusterNodesList toolbox={this.props.toolbox} widget={this.props.widget} nodes={this.props.data.nodes}/>
                }



                <CreateClusterModal toolbox={this.props.toolbox}
                                    open={this.state.showCreate}
                                    onHide={()=>this.setState({showCreate : false})}
                                    />
                <JoinClusterModal toolbox={this.props.toolbox}
                                  open={this.state.showJoin}
                                  onHide={()=>this.setState({showJoin : false})}
                    />

            </div>
        );
    }
}