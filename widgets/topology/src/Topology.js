import { Topology as BlueprintTopology } from 'cloudify-blueprint-topology';
import { createExpandedTopology } from './DataProcessor';
import ScrollerGlassHandler from './ScrollerGlassHandler';
import DataFetcher from './DataFetcher';

import pluginsData from './pluginsData';

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
            onExpandClick: deploymentId => this.markDeploymentsToExpand(deploymentId),
            onCollapseClick: deploymentId => this.collapseExpendedDeployments(deploymentId),
            onTerraformDetailsClick: node => this.setState({ terraformDetails: node.templateData.terraformResources }),
            onLayoutSave: layout =>
                this.props.toolbox
                    .getInternal()
                    .doPut(`/bud/layout/${this.props.data.blueprintId}`, null, layout)
                    .then(() => {
                        this.setState({ saveConfirmationOpen: true });
                        setTimeout(() => this.setState({ saveConfirmationOpen: false }), saveConfirmationTimeout);
                    }),
            pluginsCatalog: pluginsData
        });

        this.topology.start();
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
                    const componentDeploymentData = this.props.data.componentDeployemntsData[templateData.deploymentId];
                    if (componentDeploymentData) {
                        determineComponentsPlugins(componentDeploymentData);
                        templateData.plugins = _(componentDeploymentData.nodes)
                            .flatMap('templateData.plugins')
                            .filter('package_name')
                            .uniq()
                            .value();
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
                    this.props.data.componentDeployemntsData[deploymentId],
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

    findExpandedNode(currentTopology, deploymentId) {
        return _.find(currentTopology.nodes, node => node.templateData.deploymentId === deploymentId);
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
        } else if (!_.isEmpty(this.props.data.blueprintDeploymentData)) {
            if (!this.topology) {
                this.startTopology();
            }
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
        const { Popup, Modal, DataTable, HighlightText, CancelButton } = Stage.Basic;
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
                <Modal open={this.state.terraformDetails} onClose={() => this.setState({ terraformDetails: null })}>
                    <Modal.Header>Terraform resources</Modal.Header>
                    <Modal.Content>
                        <DataTable>
                            <DataTable.Column label="Object (type)" />
                            <DataTable.Column label="Name" />
                            <DataTable.Column label="Provider" />
                            <DataTable.Column label="Raw data" />

                            {_(this.state.terraformDetails)
                                .sortBy('type')
                                .map(tfResource => (
                                    <DataTable.Row>
                                        <DataTable.Data>{tfResource.type}</DataTable.Data>
                                        <DataTable.Data>{tfResource.name}</DataTable.Data>
                                        <DataTable.Data>{tfResource.provider}</DataTable.Data>
                                        <DataTable.Data>
                                            <HighlightText>{JSON.stringify(tfResource, null, 2)}</HighlightText>
                                        </DataTable.Data>
                                    </DataTable.Row>
                                ))
                                .value()}
                        </DataTable>
                    </Modal.Content>
                    <Modal.Actions>
                        <CancelButton onClick={() => this.setState({ terraformDetails: null })} content="Close" />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
