/**
 * Created by kinneretzin on 06/11/2016.
 */

var BlueprintTopology = cloudifyTopology.Topology;
var DataProcessingService = cloudifyTopology.DataProcessingService;

export default class Topology extends React.Component {
    constructor(props, context) {
        super(props, context);

        this._topologyData = null;
        this._topology = null;
        this._processedTopologyData = null;
        this.isMouseOver = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {

        this._startTopology();

        this.props.toolbox.getEventBus().on('topology:selectNode', this._selectNode, this);
    }

    componentWillUnmount() {
        if (this._topology) {
            this._topology.destroy();
            this._topology = null;
        }
        this.props.toolbox.getEventBus().off('topology:selectNode');
    }

    _startTopology() {
        if (this._topology) {
            this._topology.destroy();
        }

        this._topology = new BlueprintTopology({
            isLoading: true,
            selector: '#topologyContainer',
            autoScale: true,
            showToolbar:_.get(this.props.data,'topologyConfig.showToolbar',true),
            enableGroupClick:_.get(this.props.data,'topologyConfig.enableGroupClick',true),
            enableNodeClick: _.get(this.props.data,'topologyConfig.enableNodeClick',true),
            enableZoom: _.get(this.props.data,'topologyConfig.enableZoom',true),
            enableDrag: _.get(this.props.data,'topologyConfig.enableDrag',true),
            enableDrop: true,
            enableDragEdit: false,
            enableDragToSelect: true,
            autoLayout:true,
            enableContextMenu: false,
            onNodeSelected: (node)=> this._setSelectedNode(node),
            onDataProcessed: (data)=>this._processedTopologyData = data
        });

        this._topology.start();
    }

    _buildTopologyData() {
        if (this.props.data && this.props.data.data) {
            var topologyData = {
                data: this.props.data.data,
                instances: this.props.data.instances,
                executions: this.props.data.executions
            };

            return DataProcessingService.encodeTopologyFromRest(topologyData);
        }
    }

     _selectNode(nodeId) {
        if (this._topology && this._processedTopologyData && this._processedTopologyData.nodes) {
            let selectedNode = _.find(this._processedTopologyData.nodes, (topologyNode) => topologyNode.name === nodeId);
            this._topology.setSelectNode(selectedNode);
        }
    }

     _setSelectedNode(selectedNode) {
        if (this.props.data.deploymentId) {
            this.props.toolbox.getContext().setValue('nodeId', selectedNode.name + this.props.data.deploymentId);
        }
    }


    _isNodesChanged(topologyNodes, newNodes) {

        // compare # of nodes
        if (topologyNodes.length !== newNodes.length) {
            return true;
        }

        // compare node names, and if in the same order
        for (var i = 0; i < topologyNodes.length; i++) {
            if (topologyNodes[i].name !== newNodes[i].name) {
                return true;
            }
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data.topologyConfig &&
            (this.props.data.topologyConfig.enableNodeClick !== prevProps.data.topologyConfig.enableNodeClick ||
            this.props.data.topologyConfig.enableGroupClick !== prevProps.data.topologyConfig.enableGroupClick ||
            this.props.data.topologyConfig.enableZoom !== prevProps.data.topologyConfig.enableZoom ||
            this.props.data.topologyConfig.enableDrag !== prevProps.data.topologyConfig.enableDrag ||
            this.props.data.topologyConfig.showToolbar !== prevProps.data.topologyConfig.showToolbar)) {

            if (this._topology) {
                this._topology.destroy();
                this._startTopology();
            }
        }

        if (this.props.data.blueprintId !== prevProps.data.blueprintId ||
            this.props.data.deploymentId !== prevProps.data.deploymentId) {

            this._topology.setLoading(true);
            this._topologyData = null;
            this.props.toolbox.refresh();
        } else {
            var isFirstTimeLoading = this._topologyData == null;
            var oldTopologyData = this._topologyData;
            this._topologyData = this._buildTopologyData();

            if (isFirstTimeLoading || this._isNodesChanged(oldTopologyData.nodes,this._topologyData.nodes)) {
                this._topology.setTopology(this._topologyData);
                this._topology.setLoading(false);
            } else {
                this._topology.refreshTopologyDeploymentStatus(this._topologyData);
            }
        }
    }

    _releaseScroller () {
        this.isMouseOver = true;
        $(this.refs.glass).addClass('unlocked');
    }

    _timerReleaseScroller() {
        this.isMouseOver = true;
        setTimeout(()=>{
            if (this.isMouseOver) {
                this._releaseScroller();
            }
        },3000);
    }

    _reactivateScroller () {
        this.isMouseOver = false;
        $(this.refs.glass).removeClass('unlocked');
    }

    render () {
        return (
            <div ref='topologyParentContainer'
                 onClick={this._releaseScroller.bind(this)}
                 onMouseEnter={this._timerReleaseScroller.bind(this)}
                 onMouseLeave={this._reactivateScroller.bind(this)}>
                <div className='scrollGlass' ref='glass'><span className='message'>Click to release scroller</span></div>
                <div id='topologyContainer'></div>
            </div>
        );

    }
}

