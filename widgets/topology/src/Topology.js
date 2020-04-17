import { Topology as BlueprintTopology } from 'cloudify-blueprint-topology';
import { createExpandedTopology } from './DataProcessor';
import ScrollerGlassHandler from './ScrollerGlassHandler';

import pluginsData from './pluginsData.json';

const saveConfirmationTimeout = 2500;

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

        this.state = { saveConfirmationOpen: false, expandedDeployments: [] };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.blueprintId, nextProps.blueprintId) ||
            !_.isEqual(this.props.configuration, nextProps.configuration) ||
            !_.isEqual(this.props.deploymentId, nextProps.deploymentId) ||
            !_.isEqual(this.props.data, nextProps.data) ||
            !_.isEqual(this.state, nextState)
        );
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('topology:selectNode', this.selectNode, this);
        this.startTopology();
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
            showToolbar: _.get(this.props.configuration, 'showToolbar', true),
            showToolbarCursorActions: false,
            showToolbarLayoutActions: true,
            enableGroupClick: _.get(this.props.configuration, 'enableGroupClick', true),
            enableNodeClick: _.get(this.props.configuration, 'enableNodeClick', true),
            enableZoom: _.get(this.props.configuration, 'enableZoom', true),
            enableDrag: _.get(this.props.configuration, 'enableDrag', true),
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
                    .doPut(`/bud/layout/${this.props.blueprintId}`, null, layout)
                    .then(() => {
                        this.setState({ saveConfirmationOpen: true });
                        setTimeout(() => this.setState({ saveConfirmationOpen: false }), saveConfirmationTimeout);
                    }),
            pluginsCatalog: pluginsData
        });
        this.topology.start();
        this.topology.setLoading(false);
    }

    buildTopologyData() {
        const { blueprintDeploymentData } = this.props.data;
        if (_.isEmpty(blueprintDeploymentData)) {
            return null;
        }

        const topology = _.cloneDeep(blueprintDeploymentData);

        const determineComponentsPlugins = deploymentData => {
            _(deploymentData.nodes)
                .map('templateData')
                .filter({ actual_number_of_instances: 1 })
                .each(templateData => {
                    const deploymentId = _(templateData.deploymentSettings)
                        .map('id')
                        .compact()
                        .head();
                    if (deploymentId) {
                        const componentDeploymentData = this.props.data.componentDeploymentsData[deploymentId];
                        if (componentDeploymentData) {
                            determineComponentsPlugins(componentDeploymentData);
                            templateData.plugins = _(componentDeploymentData.nodes)
                                .flatMap('templateData.plugins')
                                .filter('package_name')
                                .uniq()
                                .value();
                        }
                    }
                });
        };

        determineComponentsPlugins(topology);

        const expandDeployments = deploymentsToExpand => {
            [...deploymentsToExpand].forEach(deploymentId => {
                const expandedNodeData = this.findExpandedNode(topology, deploymentId);
                if (!expandedNodeData) {
                    return;
                }

                const expandedTopology = createExpandedTopology(
                    this.props.data.componentDeploymentsData[deploymentId],
                    expandedNodeData
                );
                _.each(expandedTopology.nodes, node => {
                    // Formating the name to not collision on nodes from other topologies
                    node.name = `${node.name}(${expandedNodeData.name})`;
                });

                topology.connectors.push.apply(topology.connectors, expandedTopology.connectors);
                topology.groups.push.apply(topology.groups, expandedTopology.groups);
                topology.nodes.push.apply(topology.nodes, expandedTopology.nodes);

                _.pull(deploymentsToExpand, deploymentId);
            });

            return deploymentsToExpand.length;
        };

        const deploymentsToExpand = [...this.state.expandedDeployments];
        let deploymentsCount = deploymentsToExpand.length;
        for (;;) {
            const currentDeploymentsCount = expandDeployments(deploymentsToExpand);
            if (currentDeploymentsCount === deploymentsCount) {
                break;
            }
            deploymentsCount = currentDeploymentsCount;
        }

        return topology;
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
        if (this.props.deploymentId) {
            this.props.toolbox.getContext().setValue('depNodeId', selectedNode.name + this.props.deploymentId);
            this.props.toolbox.getContext().setValue('nodeId', selectedNode.name);
        } else if (this.props.blueprintId) {
            this.props.toolbox.getContext().setValue('nodeId', selectedNode.name);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.configuration !== prevProps.configuration) {
            this.startTopology();
        }

        if (this.props.blueprintId !== prevProps.blueprintId || this.props.deploymentId !== prevProps.deploymentId) {
            this.topology.setLoading(true);
            this.topologyData = null;
            this.props.toolbox.refresh();
        }

        if (this.props.data.blueprintDeploymentData !== prevProps.data.blueprintDeploymentData) {
            const isFirstTimeLoading = this.topologyData === null;
            const oldTopologyData = this.topologyData;
            this.topologyData = this.buildTopologyData();

            if (isFirstTimeLoading || isNodesChanged(oldTopologyData.nodes, this.topologyData.nodes)) {
                const { layout } = this.props.data;
                this.topology.setTopology(this.topologyData, layout);
                this.topology.setLoading(false);
                if (isFirstTimeLoading) this.topology.setScale(_.get(layout, 'scaleInfo'));
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
        const currentExpanded = this.state.expandedDeployments;

        if (_.includes(currentExpanded, deploymentId)) {
            // Nothing to do
            return;
        }

        this.setState({ expandedDeployments: [...currentExpanded, deploymentId] });
    }

    collapseExpendedDeployments(deploymentId) {
        const currentExpanded = this.state.expandedDeployments;

        this.setState({ expandedDeployments: _.without(currentExpanded, deploymentId) });
    }

    render() {
        const { Popup } = Stage.Basic;
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
                <Popup
                    open={this.state.saveConfirmationOpen}
                    content="Topology layout saved"
                    position="top center"
                    style={{ left: 'unset', right: 65 }}
                    trigger={<div id="topologyContainer" />}
                />
            </div>
        );
    }
}
