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
    for (let i = 0; i < topologyNodes.length; i += 1) {
        if (topologyNodes[i].name !== newNodes[i].name) {
            return true;
        }
    }

    return false;
}

function findExpandedNode(currentTopology, nodeId) {
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

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('topology:selectNode', this.selectNode, this);
        this.startTopology();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { blueprintId, configuration, data, deploymentId } = this.props;
        return (
            !_.isEqual(blueprintId, nextProps.blueprintId) ||
            !_.isEqual(configuration, nextProps.configuration) ||
            !_.isEqual(data, nextProps.data) ||
            !_.isEqual(deploymentId, nextProps.deploymentId) ||
            !_.isEqual(this.state, nextState)
        );
    }

    componentDidUpdate(prevProps) {
        const { blueprintId, configuration, data, deploymentId, toolbox } = this.props;

        if (configuration !== prevProps.configuration) {
            this.startTopology();
        }

        if (blueprintId !== prevProps.blueprintId || deploymentId !== prevProps.deploymentId) {
            this.topology.setLoading(true);
            this.topologyData = null;
            toolbox.refresh();
        }

        if (data.blueprintDeploymentData !== prevProps.data.blueprintDeploymentData) {
            const isFirstTimeLoading = this.topologyData === null;
            const oldTopologyData = this.topologyData;
            this.topologyData = this.buildTopologyData();

            if (isFirstTimeLoading || isNodesChanged(oldTopologyData.nodes, this.topologyData.nodes)) {
                const { layout } = data;
                this.topology.setTopology(this.topologyData, layout);
                this.topology.setLoading(false);
                if (isFirstTimeLoading) this.topology.setScale(_.get(layout, 'scaleInfo'));
            } else {
                this.topology.refreshTopologyDeploymentStatus(this.topologyData);
            }
        }
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        this.destroyTopology();
        toolbox.getEventBus().off('topology:selectNode');
    }

    startTopology() {
        const { blueprintId, configuration, toolbox } = this.props;
        this.destroyTopology();
        this.topology = new BlueprintTopology({
            isLoading: true,
            selector: '#topologyContainer',
            autoScale: true,
            showToolbar: _.get(configuration, 'showToolbar', true),
            showToolbarCursorActions: false,
            showToolbarLayoutActions: true,
            enableGroupClick: _.get(configuration, 'enableGroupClick', true),
            enableNodeClick: _.get(configuration, 'enableNodeClick', true),
            enableZoom: _.get(configuration, 'enableZoom', true),
            enableDrag: _.get(configuration, 'enableDrag', true),
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
                toolbox
                    .getInternal()
                    .doPut(`/bud/layout/${blueprintId}`, null, layout)
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
        const {
            data: { blueprintDeploymentData, componentDeploymentsData }
        } = this.props;
        const { expandedDeployments } = this.state;

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
                        const componentDeploymentData = componentDeploymentsData[deploymentId];
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
                const expandedNodeData = findExpandedNode(topology, deploymentId);
                if (!expandedNodeData) {
                    return;
                }

                const expandedTopology = createExpandedTopology(
                    componentDeploymentsData[deploymentId],
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

        const deploymentsToExpand = [...expandedDeployments];
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
        const { deploymentId, blueprintId, toolbox } = this.props;
        if (deploymentId) {
            toolbox.getContext().setValue('depNodeId', selectedNode.name + deploymentId);
            toolbox.getContext().setValue('nodeId', selectedNode.name);
        } else if (blueprintId) {
            toolbox.getContext().setValue('nodeId', selectedNode.name);
        }
    }

    destroyTopology() {
        if (!_.isNil(this.topology)) {
            this.topology.destroy();
            this.topology = null;
        }
    }

    goToDeploymentPage(nodeDeploymentId) {
        const { toolbox } = this.props;
        toolbox.getContext().setValue('deploymentId', nodeDeploymentId);
        toolbox.goToPage('deployments');
        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId: nodeDeploymentId }, nodeDeploymentId);
    }

    markDeploymentsToExpand(deploymentId) {
        const { expandedDeployments: currentExpanded } = this.state;

        if (_.includes(currentExpanded, deploymentId)) {
            // Nothing to do
            return;
        }

        this.setState({ expandedDeployments: [...currentExpanded, deploymentId] });
    }

    collapseExpendedDeployments(deploymentId) {
        const { expandedDeployments: currentExpanded } = this.state;

        this.setState({ expandedDeployments: _.without(currentExpanded, deploymentId) });
    }

    render() {
        const { saveConfirmationOpen } = this.state;
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
                    open={saveConfirmationOpen}
                    content="Topology layout saved"
                    position="top center"
                    style={{ left: 'unset', right: 65 }}
                    trigger={<div id="topologyContainer" />}
                />
            </div>
        );
    }
}
Topology.propTypes = {
    blueprintId: PropTypes.string,
    deploymentId: PropTypes.string,
    configuration: PropTypes.shape({
        showToolbar: PropTypes.string,
        enableGroupClick: PropTypes.string,
        enableNodeClick: PropTypes.string,
        enableZoom: PropTypes.string,
        enableDrag: PropTypes.string
    }),
    data: PropTypes.shape({
        blueprintDeploymentData: PropTypes.object,
        componentDeploymentsData: PropTypes.object,
        layout: PropTypes.object
    }),
    // eslint-disable-next-line react/forbid-prop-types
    toolbox: PropTypes.object.isRequired
};

Topology.defaultProps = {
    blueprintId: '',
    deploymentId: '',
    configuration: {
        showToolbar: true,
        enableGroupClick: true,
        enableNodeClick: true,
        enableZoom: true,
        enableDrag: true
    },
    data: {
        blueprintDeploymentData: {},
        componentDeploymentsData: {},
        layout: {}
    }
};
