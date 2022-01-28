// @ts-nocheck File not migrated fully to TS
// @ts-expect-error Blueprint topology does not emit type declarations yet
import { Topology as BlueprintTopology } from 'cloudify-blueprint-topology';
import type { RefObject } from 'react';
import { createExpandedTopology } from './DataProcessor';
import ScrollerGlassHandler from './ScrollerGlassHandler';
import TerraformDetailsModal from './TerraformDetailsModal';

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

interface TopologyProps {
    toolbox: Stage.Types.Toolbox;
    blueprintId: string;
    configuration: unknown;
    data: {
        blueprintDeploymentData: unknown;
        icons: Record<string, string>;
        layout: unknown;
    };
    deploymentId: string;
}

function findExpandedNode(currentTopology: TopologyProps['data']['blueprintDeploymentData'], deploymentId: string) {
    return _.find(currentTopology.nodes, node => node.templateData.deploymentId === deploymentId);
}

interface TopologyState {
    expandedDeployments: string[];
    // eslint-disable-next-line camelcase
    expandedTerraformNodes: { deployment_id: string; id: string }[];
    saveConfirmationOpen: boolean;
}

export default class Topology extends React.Component<TopologyProps, TopologyState> {
    private readonly glassRef: RefObject<unknown>;

    private readonly topologyParentContainerRef: RefObject<unknown>;

    private topologyData: unknown;

    private topology: BlueprintTopology | null;

    private processedTopologyData: unknown;

    private readonly scrollerGlassHandler: ScrollerGlassHandler;

    constructor(props: TopologyProps) {
        super(props);

        this.glassRef = React.createRef();
        this.topologyParentContainerRef = React.createRef();

        this.topologyData = null;
        this.topology = null;
        this.processedTopologyData = null;
        this.scrollerGlassHandler = new ScrollerGlassHandler(this.glassRef);

        this.state = { saveConfirmationOpen: false, expandedDeployments: [], expandedTerraformNodes: [] };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('topology:selectNode', this.selectNode, this);
        toolbox.getEventBus().on('blueprints:refresh', toolbox.refresh, this);
        toolbox.getEventBus().on('deployments:refresh', toolbox.refresh, this);
        this.startTopology();
    }

    shouldComponentUpdate(nextProps: TopologyProps, nextState: TopologyState) {
        const { blueprintId, configuration, data, deploymentId } = this.props;
        return (
            !_.isEqual(blueprintId, nextProps.blueprintId) ||
            !_.isEqual(configuration, nextProps.configuration) ||
            !_.isEqual(data, nextProps.data) ||
            !_.isEqual(deploymentId, nextProps.deploymentId) ||
            !_.isEqual(this.state, nextState)
        );
    }

    componentDidUpdate(prevProps: TopologyProps, prevState: TopologyState) {
        const { blueprintId, configuration, data } = this.props;
        const { expandedDeployments, expandedTerraformNodes } = this.state;

        if (
            configuration !== prevProps.configuration ||
            blueprintId !== prevProps.blueprintId ||
            !_.isEqual(data.icons, prevProps.data.icons)
        ) {
            this.startTopology();
        }

        if (
            data.blueprintDeploymentData !== prevProps.data.blueprintDeploymentData ||
            expandedDeployments !== prevState.expandedDeployments ||
            expandedTerraformNodes !== prevState.expandedTerraformNodes
        ) {
            const isFirstTimeLoading = this.topologyData === null;
            const oldTopologyData = this.topologyData;
            this.topologyData = this.buildTopologyData();
            this.topology.setLoading(false);

            if (_.isEmpty(data.blueprintDeploymentData)) {
                this.topology.setTopology(this.topologyData, {});
            } else if (isFirstTimeLoading || isNodesChanged(oldTopologyData.nodes, this.topologyData.nodes)) {
                const { layout } = data;
                this.topology.setTopology(this.topologyData, layout);
                if (isFirstTimeLoading) this.topology.setScale(_.get(layout, 'scaleInfo'));
            } else {
                this.topology.refreshTopologyDeploymentStatus(this.topologyData);
            }
        }
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        this.destroyTopology();
        toolbox.getEventBus().off('topology:selectNode', this.selectNode);
        toolbox.getEventBus().off('blueprints:refresh', toolbox.refresh);
        toolbox.getEventBus().off('deployments:refresh', toolbox.refresh);
    }

    getExpandHandler(stateProp: keyof Pick<TopologyState, 'expandedDeployments' | 'expandedTerraformNodes'>) {
        return (entityId: string) => {
            const { [stateProp]: currentExpanded } = this.state;

            if (_.find(currentExpanded, entityId)) {
                // Nothing to do
                return;
            }

            this.setState({ [stateProp]: [...currentExpanded, entityId] });
        };
    }

    getCollapseHandler(stateProp: keyof Pick<TopologyState, 'expandedDeployments' | 'expandedTerraformNodes'>) {
        return (entityToCollapse: unknown) => {
            const { [stateProp]: currentExpanded } = this.state;
            this.setState({ [stateProp]: _.reject(currentExpanded, entity => _.isEqual(entity, entityToCollapse)) });
        };
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

    startTopology() {
        const { blueprintId, configuration, data, toolbox } = this.props;
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
            // @ts-expect-error Blueprint topology does not emit type declarations yet
            onNodeSelected: node => this.setSelectedNode(node),
            // @ts-expect-error Blueprint topology does not emit type declarations yet
            onDataProcessed: processedData => {
                this.processedTopologyData = processedData;
            },
            // @ts-expect-error Blueprint topology does not emit type declarations yet
            onDeploymentNodeClick: deploymentId => this.goToDeploymentPage(deploymentId),
            onExpandClick: this.getExpandHandler('expandedDeployments'),
            onCollapseClick: this.getCollapseHandler('expandedDeployments'),
            // @ts-expect-error Blueprint topology does not emit type declarations yet
            onTerraformDetailsClick: node => this.setState({ terraformDetails: node.templateData.terraformResources }),
            onTerraformExpandClick: this.getExpandHandler('expandedTerraformNodes'),
            onTerraformCollapseClick: this.getCollapseHandler('expandedTerraformNodes'),
            // @ts-expect-error Blueprint topology does not emit type declarations yet
            onLayoutSave: body =>
                toolbox
                    .getInternal()
                    .doPut(`/bud/layout/${blueprintId}`, { body })
                    .then(() => {
                        this.setState({ saveConfirmationOpen: true });
                        setTimeout(() => this.setState({ saveConfirmationOpen: false }), saveConfirmationTimeout);
                    }),
            pluginsCatalog: _.map(data.icons, (icon, name) => ({ icon, name, title: name }))
        });
        this.topology.start();
    }

    buildTopologyData() {
        const { data } = this.props;
        const { expandedDeployments, expandedTerraformNodes } = this.state;

        if (_.isEmpty(data.blueprintDeploymentData)) {
            return null;
        }

        const topology = _.cloneDeep(data.blueprintDeploymentData);

        const determineComponentsPlugins = deploymentData => {
            _(deploymentData.nodes)
                .map('templateData')
                .filter({ actual_number_of_instances: 1 })
                .each(templateData => {
                    const componentDeploymentData = data.componentDeploymentsData[templateData.deploymentId];
                    if (componentDeploymentData) {
                        determineComponentsPlugins(componentDeploymentData);
                        templateData.plugins = _(componentDeploymentData.nodes)
                            .flatMap('templateData.plugins')
                            .filter('package_name')
                            .uniqBy('package_name')
                            .value();
                    }
                });
        };

        determineComponentsPlugins(topology);

        const expandDeployments = deploymentsToExpand => {
            [...deploymentsToExpand].forEach(deploymentId => {
                const expandedNodeData = findExpandedNode(topology, deploymentId);
                const componentDeploymentsData = data.componentDeploymentsData[deploymentId];

                if (!expandedNodeData || !componentDeploymentsData) {
                    return;
                }

                const expandedTopology = createExpandedTopology(componentDeploymentsData, expandedNodeData);
                _.each(expandedTopology.nodes, node => {
                    // Formating the name to not collision on nodes from other topologies
                    node.name = `${node.name}(${expandedNodeData.name})`;
                });

                topology.connectors.push(...expandedTopology.connectors);
                topology.groups.push(...expandedTopology.groups);
                topology.nodes.push(...expandedTopology.nodes);

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

        expandedTerraformNodes.forEach(terraformNodeData => {
            const terraformNode = _.find(topology.nodes, node => _.isMatch(node.templateData, terraformNodeData));
            const terraformDeploymentNodes = _.map(terraformNode.templateData.terraformResources, resource => {
                const newNode = {
                    name: resource.name,
                    templateData: {
                        type: 'cloudify.nodes.terraform.Node',
                        plugins: [{ package_name: 'Terraform resource' }],
                        capabilities: {
                            scalable: {
                                properties: {}
                            }
                        },
                        actual_planned_number_of_instances: _.size(resource.instances)
                    },
                    container: { parent: terraformNode }
                };
                terraformNode.children = terraformNode.children || [];
                terraformNode.children.push(newNode);
                return newNode;
            });
            topology.nodes.push(...terraformDeploymentNodes);

            _.each(terraformNode.templateData.terraformResources, resource =>
                _(resource.instances)
                    .flatMap('dependencies')
                    .compact()
                    .uniq()
                    .forEach((dependency: string) => {
                        const [dependencyName] = dependency.split('.').slice(-1);
                        const side2 = _.find(terraformDeploymentNodes, { name: dependencyName });

                        if (!side2) {
                            return;
                        }

                        const side1 = _.find(terraformDeploymentNodes, _.pick(resource, 'name'));
                        const connector = {
                            name: '',
                            id: `terraformDependency:${resource.name}.${dependencyName}`,
                            templateData: {
                                type: 'cloudify.relationships.depends_on'
                            },
                            side1,
                            side2
                        };
                        side1.connectedTo = side1.connectedTo || [];
                        side1.connectedTo.push(connector);
                        side2.connectedTo = side2.connectedTo || [];
                        side2.connectedTo.push(connector);
                        topology.connectors.push(connector);
                    })
            );
        });

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

    destroyTopology() {
        if (!_.isNil(this.topology)) {
            this.topology.destroy();
            this.topology = null;
        }
    }

    goToDeploymentPage(nodeDeploymentId) {
        const { toolbox } = this.props;
        toolbox.getContext().setValue('deploymentId', nodeDeploymentId);
        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId: nodeDeploymentId }, nodeDeploymentId);
    }

    render() {
        const { saveConfirmationOpen, terraformDetails } = this.state;
        const { Popup } = Stage.Basic;
        return (
            <div
                role="none"
                ref={this.topologyParentContainerRef}
                onClick={this.scrollerGlassHandler.releaseScroller}
                onKeyPress={this.scrollerGlassHandler.releaseScroller}
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
                <TerraformDetailsModal
                    terraformDetails={terraformDetails}
                    onClose={() => this.setState({ terraformDetails: null })}
                />
            </div>
        );
    }
}
Topology.propTypes = {
    blueprintId: PropTypes.string,
    deploymentId: PropTypes.string,
    configuration: PropTypes.shape({
        showToolbar: PropTypes.boolean,
        enableGroupClick: PropTypes.boolean,
        enableNodeClick: PropTypes.boolean,
        enableZoom: PropTypes.boolean,
        enableDrag: PropTypes.boolean
    }),
    data: PropTypes.shape({
        blueprintDeploymentData: PropTypes.shape({}),
        componentDeploymentsData: PropTypes.shape({}),
        layout: PropTypes.shape({ scaleInfo: PropTypes.shape({}) }),
        icons: PropTypes.shape({})
    }),
    toolbox: Stage.PropTypes.Toolbox.isRequired
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
        layout: {},
        icons: {}
    }
};
