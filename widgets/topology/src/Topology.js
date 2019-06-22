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
            onExpandClick: (deploymentId, nodeId)=>this._markDeploymentsToExpand(deploymentId, nodeId)
        });

        this._topology.start();
    }

    _buildTopologyData() {
        let result = {
            connectors: [],
            groups: [],
            nodes: []
        };

        if (this.props.data && this.props.data.deploymentsData) {
            let deploymentsData = [];
            if (! this.props.data.deploymentsData instanceof Array){
                deploymentsData.push(this.props.data.deploymentsData);
            }
            else {
                deploymentsData = this.props.data.deploymentsData;
            }

            if (deploymentsData[0].data){
                let topologyData = {
                    data: deploymentsData[0].data,
                    instances: deploymentsData[0].instances,
                    executions: deploymentsData[0].executions
                };
                result = DataProcessingService.encodeTopologyFromRest(topologyData);
            }

            const size = Object.keys(deploymentsData).length;
            for (let i = 1; i < size; i++){
                console.error(deploymentsData[i]);
                console.error(this.props.data.expandedDeployments[i - 1].expendedNode);
                let father = _.find(result.nodes,
                    (node) => {
                        return node.name===this.props.data.expandedDeployments[i - 1].expendedNode;
                    });
                if (deploymentsData[i].data){
                    let topologyData = {
                        data: deploymentsData[i].data,
                        instances: deploymentsData[i].instances,
                        executions: deploymentsData[i].executions
                    };
                    let temp = DataProcessingService.encodeTopologyFromRest(topologyData);

                    father.container = {'children':[]};
                    _.forEach(temp.nodes, (node)=>{
                        father.container.children.push(node);
                        node.container = {'parent':father, 'type':'cloudify.relationships.contained_in'};
                    });
                    
                    result.connectors.push.apply(result.connectors, temp.connectors);
                    result.groups.push.apply(result.groups, temp.groups);
                    result.nodes.push.apply(result.nodes, temp.nodes);
                }
            }

            // _.forEach(deploymentsData, (deployment) => {
            //     console.error(deployment);
            //     if (deployment.data){
            //         let topologyData = {
            //             data: deployment.data,
            //             instances: deployment.instances,
            //             executions: deployment.executions
            //         };
            //         let temp = DataProcessingService.encodeTopologyFromRest(topologyData);
                    
            //         result.connectors.push.apply(result.connectors, temp.connectors);
            //         result.groups.push.apply(result.groups, temp.groups);
            //         result.nodes.push.apply(result.nodes, temp.nodes);
            // }
            // });
        }
        return result;
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
        if (! currentExpanded){
            currentExpanded = [];
        }

        let result = _.find(currentExpanded, (expended)=>{
            return expended.deploymentId === deploymentId;
        });

        if (!result){
            currentExpanded.push({expendedNode: nodeId, deploymentId});
            this.props.toolbox.getContext().setValue('deploymentsToExpand', currentExpanded);
        }
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
