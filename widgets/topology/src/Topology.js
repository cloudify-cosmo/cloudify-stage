import { Topology as BlueprintTopology } from 'cloudify-blueprint-topology';
import { createBaseTopology, createExpandedTopology } from './DataProcessor';
import ScrollerGlassHandler from './ScrollerGlassHandler';

function isNodesChanged(topologyNodes, newNodes) {
    // compare # of nodes
    if (topologyNodes.length !== newNodes.length) {
        return true;
    }

    // compare node names, and if in the same order
    for (let i = 0; i < topologyNodes.length; i++) {
        if (topologyNodes[i].name !== newNodes[i].name) {
            return true;
        }
    }

    return false;
}

export default class Topology extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.glassRef = React.createRef();
        this.topologyParentContainerRef = React.createRef();

        this.topologyData = null;
        this.topology = null;
        this.processedTopologyData = null;
        this.scrollerGlassHandler = new ScrollerGlassHandler(this.glassRef);

        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('topology:selectNode', this.selectNode, this);
    }

    componentWillUnmount() {
        this.destroyTopology();
        this.props.toolbox.getEventBus().off('topology:selectNode');
    }

    destroyTopology() {
        if (!_.isNil(this.topology)) {
            this.topology.destroy();
            this.topology = null;
        }
    }

    startTopology() {
        this.destroyTopology();
        this.topology = new BlueprintTopology({
            isLoading: true,
            selector: '#topologyContainer',
            autoScale: true,
            showToolbar: _.get(this.props.data, 'topologyConfig.showToolbar', true),
            showToolbarCursorActions: false,
            showToolbarLayoutActions: true,
            enableGroupClick: _.get(this.props.data, 'topologyConfig.enableGroupClick', true),
            enableNodeClick: _.get(this.props.data, 'topologyConfig.enableNodeClick', true),
            enableZoom: _.get(this.props.data, 'topologyConfig.enableZoom', true),
            enableDrag: _.get(this.props.data, 'topologyConfig.enableDrag', true),
            enableDrop: true,
            enableDragEdit: false,
            enableDragToSelect: true,
            enableContextMenu: false,
            onNodeSelected: node => this.setSelectedNode(node),
            onDataProcessed: data => (this.processedTopologyData = data),
            onDeploymentNodeClick: deploymentId => this.goToDeploymentPage(deploymentId),
            onExpandClick: (deploymentId, nodeId) => this.markDeploymentsToExpand(deploymentId, nodeId),
            onCollapseClick: deploymentId => this.collapseExpendedDeployments(deploymentId),
            onLayoutSave: layout =>
                this.props.toolbox
                    .getInternal()
                    .doPut(
                        `/bud/layout/${this.props.data.blueprintId || this.props.data.deploymentsData[0].data.id}`,
                        null,
                        layout
                    )
                    .then(() => {
                        this.setState({ saveConfirmationOpen: true });
                        setTimeout(() => this.setState({ saveConfirmationOpen: false }), 2500);
                    })
        });

        this.topology.start();
    }

    buildTopologyData() {
        if (!(this.props.data && this.props.data.deploymentsData)) {
            return null;
        }

        const { deploymentsData } = this.props.data;
        if (_.size(deploymentsData) === 0 || !deploymentsData[0].data) {
            return null;
        }
        const topology = createBaseTopology(deploymentsData[0]);
        this.addExpandedTopologies(deploymentsData, topology);

        return topology;
    }

    addExpandedTopologies(deploymentsData, currentTopology) {
        /* Will build all the topologies of the expanded deployments
         * of Component or SharedResource nodes.
         */
        for (let i = 1; i < _.size(deploymentsData); i++) {
            const expandedDeploymentId = this.props.data.expandedDeployments[i - 1];
            const expandedNodeData = this.findExpandedNode(currentTopology, expandedDeploymentId);
            if (!expandedNodeData) {
                // In the case of a parent node that contained it was collapsed already
                const currentExpanded = this.props.toolbox.getContext().getValue('deploymentsToExpand');
                _.remove(currentExpanded, expended => {
                    return expended === expandedDeploymentId;
                });
                return;
            }

            if (deploymentsData[i].data) {
                const expanded_topology = createExpandedTopology(deploymentsData[i], expandedNodeData);
                _.each(expanded_topology.nodes, node => {
                    // Formating the name to not collision on nodes from other topologies
                    node.name = `${node.name}(${expandedNodeData.name})`;
                });

                currentTopology.connectors.push.apply(currentTopology.connectors, expanded_topology.connectors);
                currentTopology.groups.push.apply(currentTopology.groups, expanded_topology.groups);
                currentTopology.nodes.push.apply(currentTopology.nodes, expanded_topology.nodes);
            }
        }
    }

    findExpandedNode(currentTopology, nodeId) {
        return _.find(currentTopology.nodes, node => {
            let found = false;
            _.each(node.templateData.deploymentSettings, deploymentSettings => {
                // This will check if one of the node instances has that id,
                // currently we only support one node instance for nodes that can extend.
                if (deploymentSettings.id === nodeId) {
                    found = true;
                }
            });
            return found;
        });
    }

    selectNode(nodeId) {
        if (this.topology && this.processedTopologyData && this.processedTopologyData.nodes) {
            if (_.isEmpty(nodeId)) {
                this.topology.clearSelectedNodes();
            } else {
                const selectedNode = _.find(
                    this.processedTopologyData.nodes,
                    topologyNode => topologyNode.name === nodeId
                );
                this.topology.setSelectNode(selectedNode);
            }
        }
    }

    setSelectedNode(selectedNode) {
        if (this.props.data.deploymentId) {
            this.props.toolbox.getContext().setValue('depNodeId', selectedNode.name + this.props.data.deploymentId);
            this.props.toolbox.getContext().setValue('nodeId', selectedNode.name);
        } else if (this.props.data.blueprintId) {
            this.props.toolbox.getContext().setValue('nodeId', selectedNode.name);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.data.topologyConfig &&
            (this.props.data.topologyConfig.enableNodeClick !== prevProps.data.topologyConfig.enableNodeClick ||
                this.props.data.topologyConfig.enableGroupClick !== prevProps.data.topologyConfig.enableGroupClick ||
                this.props.data.topologyConfig.enableZoom !== prevProps.data.topologyConfig.enableZoom ||
                this.props.data.topologyConfig.enableDrag !== prevProps.data.topologyConfig.enableDrag ||
                this.props.data.topologyConfig.showToolbar !== prevProps.data.topologyConfig.showToolbar)
        ) {
            if (this.topology) {
                this.destroyTopology();
                this.startTopology();
            }
        }

        if (
            this.props.data.blueprintId !== prevProps.data.blueprintId ||
            this.props.data.deploymentId !== prevProps.data.deploymentId
        ) {
            this.topology.setLoading(true);
            this.topologyData = null;
            this.props.toolbox.refresh();
        } else if (!_.isEmpty(this.props.data.deploymentsData)) {
            if (!this.topology) {
                this.startTopology();
            }
            const isFirstTimeLoading = this.topologyData === null;
            const oldTopologyData = this.topologyData;
            this.topologyData = this.buildTopologyData();

            if (isFirstTimeLoading || isNodesChanged(oldTopologyData.nodes, this.topologyData.nodes)) {
                this.topology.setTopology(this.topologyData, this.props.data.deploymentsData[0].layout);
                this.topology.setLoading(false);
            } else {
                this.topology.refreshTopologyDeploymentStatus(this.topologyData);
            }
        }
    }

    goToDeploymentPage(nodeDeploymentId) {
        this.props.toolbox.getContext().setValue('deploymentId', nodeDeploymentId);
        this.props.toolbox.goToPage('deployments');
        this.props.toolbox.drillDown(
            this.props.toolbox.getWidget(),
            'deployment',
            { deploymentId: nodeDeploymentId },
            nodeDeploymentId
        );
    }

    markDeploymentsToExpand(deploymentId) {
        const currentExpanded = this.props.toolbox.getContext().getValue('deploymentsToExpand') || [];

        if (_.includes(currentExpanded, deploymentId)) {
            // Nothing to do
            return;
        }

        currentExpanded.push(deploymentId);
        this.props.toolbox.getContext().setValue('deploymentsToExpand', currentExpanded);
        this.props.toolbox.refresh();
    }

    collapseExpendedDeployments(deploymentId) {
        const currentExpanded = this.props.toolbox.getContext().getValue('deploymentsToExpand');
        if (!currentExpanded) {
            // Nothing to do
            return;
        }
        _.remove(currentExpanded, expanded => {
            return expanded === deploymentId;
        });
        this.props.toolbox.getContext().setValue('deploymentsToExpand', currentExpanded);
        this.props.toolbox.refresh();
    }

    render() {
        return (
            <div
                ref={this.topologyParentContainerRef}
                onClick={this.scrollerGlassHandler.releaseScroller}
                onMouseEnter={this.scrollerGlassHandler.timerReleaseScroller}
                onMouseLeave={this.scrollerGlassHandler.reactivateScroller}
            >
                <div className="scrollGlass" ref={this.glassRef}>
                    <span className="message">Click to release scroller</span>
                </div>
                <Stage.Basic.Popup
                    open={this.state.saveConfirmationOpen}
                    content="Topology layout saved"
                    position="top center"
                    style={{ left: 'unset', right: 65 }}
                    on=""
                    trigger={<div id="topologyContainer" />}
                />
            </div>
        );
    }
}
