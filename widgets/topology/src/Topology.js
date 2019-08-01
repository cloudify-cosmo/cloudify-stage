import 'cloudify-blueprint-topology';

let BlueprintTopology = cloudifyTopology.Topology;
let DataProcessingService = cloudifyTopology.DataProcessingService;

export default class Topology extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.glassRef = React.createRef();
        this.topologyParentContainerRef = React.createRef();

        this._topologyData = null;
        this._topology = null;
        this._processedTopologyData = null;
        this.isMouseOver = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this._startTopology();

        this.props.toolbox.getEventBus().on('topology:selectNode', this._selectNode, this);
    }

    componentWillUnmount() {
        this._destroyTopology();
        this.props.toolbox.getEventBus().off('topology:selectNode');
    }

    _destroyTopology() {
        if (!_.isNil(this._topology)) {
            this._topology.destroy();
            this._topology = null;
        }
    }

    _startTopology() {
        this._destroyTopology();
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
            onDataProcessed: (data)=>this._processedTopologyData = data,
            onDeploymentNodeClick: (deploymentId)=>this._goToDeploymentPage(deploymentId),
            onExpandClick: (deploymentId, nodeId)=>this._markDeploymentsToExpand(deploymentId, nodeId),
            onCollapseClick: (deploymentId)=>this._collapseExpendedDeployments(deploymentId)
        });

        this._topology.start();
    }

    _buildTopologyData() {
        if (!(this.props.data && this.props.data.deploymentsData)) {
            return null;
        }

        let deploymentsData = [];
        if (!this.props.data.deploymentsData instanceof Array){
            deploymentsData.push(this.props.data.deploymentsData);
        }
        else {
            deploymentsData = this.props.data.deploymentsData;
        }

        if (Object.entries(deploymentsData).length === 0 || !deploymentsData[0].data){
            return null;
        }
        let topology = this._create_base_topology(deploymentsData[0]);
        this._add_expanded_topologies(deploymentsData, topology);

        return topology;
    }

    _create_base_topology(deploymentData){
        let topologyData = {
            data: deploymentData.data,
            instances: deploymentData.instances,
            executions: deploymentData.executions
        };
        return DataProcessingService.encodeTopologyFromRest(topologyData);
    }

    _add_expanded_topologies(deploymentsData, currentTopology) {
    /* Will build all the topologies of the expanded deployments
     * of Component or SharedResource nodes.
     */
        for (let i = 1; i < _.size(deploymentsData); i++) {
            let expandedNodeData = _.find(currentTopology.nodes, (node) => {
                let found = false;
                _.each(node.templateData.deploymentSettings, (deploymentSettings) =>{
                    if (deploymentSettings.id === this.props.data.expandedDeployments[i - 1].expandedNodeId){
                        found = true;
                    }
                  });
                 return found;
            });
            if (deploymentsData[i].data) {
                let expanded_topology = this._create_expanded_topology(deploymentsData[i], expandedNodeData);
                _.each(expanded_topology.nodes, (node) =>{
                    node.name = this.props.data.expandedDeployments[i - 1].expandedNodeId + '\\' + node.name;
                });
                currentTopology.connectors.push.apply(currentTopology.connectors, expanded_topology.connectors);
                currentTopology.groups.push.apply(currentTopology.groups, expanded_topology.groups);
                currentTopology.nodes.push.apply(currentTopology.nodes, expanded_topology.nodes);
            }
        }
    }

    _create_expanded_topology(deploymentData, expandedNodeData){
        let topologyData = {
            data: deploymentData.data,
            instances: deploymentData.instances,
            executions: deploymentData.executions
        };
        return DataProcessingService.encodeExtendedTopologyFromRest(topologyData, expandedNodeData);
    }

     _selectNode(nodeId) {
        if (this._topology && this._processedTopologyData && this._processedTopologyData.nodes) {
            if (_.isEmpty(nodeId)) {
                this._topology.clearSelectedNodes();
            } else {
                let selectedNode = _.find(this._processedTopologyData.nodes, (topologyNode) => topologyNode.name === nodeId);
                this._topology.setSelectNode(selectedNode);
            }
        }
    }

     _setSelectedNode(selectedNode) {
        if (this.props.data.deploymentId) {
            this.props.toolbox.getContext().setValue('depNodeId', selectedNode.name + this.props.data.deploymentId);
            this.props.toolbox.getContext().setValue('nodeId', selectedNode.name);
        } else if (this.props.data.blueprintId) {
            this.props.toolbox.getContext().setValue('nodeId', selectedNode.name);
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
                this._destroyTopology();
                this._startTopology();
            }
        }

        if (this.props.data.blueprintId !== prevProps.data.blueprintId ||
            this.props.data.deploymentId !== prevProps.data.deploymentId) {

            this._topology.setLoading(true);
            this._topologyData = null;
            this.props.toolbox.refresh();
        } else {
            var isFirstTimeLoading = this._topologyData === null;
            var oldTopologyData = this._topologyData;
            this._topologyData = this._buildTopologyData();

            if (isFirstTimeLoading || this._isNodesChanged(oldTopologyData.nodes, this._topologyData.nodes)) {
                this._topology.setTopology(this._topologyData);
                this._topology.setLoading(false);
            } else {
                this._topology.refreshTopologyDeploymentStatus(this._topologyData);
            }
        }
    }

    _releaseScroller () {
        this.isMouseOver = true;
        $(this.glassRef.current).addClass('unlocked');
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
        $(this.glassRef.current).removeClass('unlocked');
    }

    _goToDeploymentPage(nodeDeploymentId) {
        this.props.toolbox.getContext().setValue('deploymentId', nodeDeploymentId);
        this.props.toolbox.goToPage('deployments');
        this.props.toolbox.drillDown(this.props.toolbox.getWidget(), 'deployment', {deploymentId: nodeDeploymentId}, nodeDeploymentId);
    }

    _markDeploymentsToExpand(deploymentId, nodeId){
        let currentExpanded = this.props.toolbox.getContext().getValue('deploymentsToExpand');
        if (!currentExpanded){
            currentExpanded = [];
        }

        let result = _.find(currentExpanded, (expended)=>{
            return expended.deploymentId === deploymentId;
        });

        if (!result){
            currentExpanded.push({expandedNodeId: nodeId, deploymentId});
            this.props.toolbox.getContext().setValue('deploymentsToExpand', currentExpanded);
        }
        this.props.toolbox.refresh();
    }

    _collapseExpendedDeployments(deploymentId){
        let currentExpanded = this.props.toolbox.getContext().getValue('deploymentsToExpand');
        if (!currentExpanded){
            return;
        }

        _.remove(currentExpanded, (expended)=>{
            return expended.deploymentId === deploymentId;
        });
        this.props.toolbox.getContext().setValue('deploymentsToExpand', currentExpanded);
        this.props.toolbox.refresh();
    }

    render () {
        return (
            <div ref={this.topologyParentContainerRef}
                 onClick={this._releaseScroller.bind(this)}
                 onMouseEnter={this._timerReleaseScroller.bind(this)}
                 onMouseLeave={this._reactivateScroller.bind(this)}>
                <div className='scrollGlass' ref={this.glassRef}><span className='message'>Click to release scroller</span></div>
                <div id='topologyContainer' />
            </div>
        );

    }
}
