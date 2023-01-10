import { Topology as BlueprintTopology } from 'cloudify-blueprint-topology';
import type { PutBlueprintUserDataLayoutRequestBody } from 'backend/routes/BlueprintUserData.types';
import type {
    NodeTemplateData,
    StageTopologyData,
    StageTopologyElement,
    TerraformResources,
    TopologyWidget
} from 'widgets/topology/src/widget.types';
import TopologyView, { topologyContainerId } from './TopologyView';
import { createExpandedTopology } from './DataProcessor';

const saveConfirmationTimeout = 2500;

function isNodesChanged(topologyNodes: unknown, newNodes: unknown) {
    return !_.isEqual(topologyNodes, newNodes);
}

interface TopologyProps {
    toolbox: Stage.Types.Toolbox;
    blueprintId: string;
    configuration: TopologyWidget.Configuration;
    data: {
        blueprintDeploymentData?: StageTopologyData;
        componentDeploymentsData: Record<string, StageTopologyData>;
        icons: Record<string, string>;
        layout: unknown;
    };
    deploymentId?: string;
}

function findExpandedNode(currentTopology: StageTopologyData, deploymentId: string) {
    return _.find(currentTopology.nodes, node => node.templateData.deploymentId === deploymentId);
}

interface TopologyState {
    expandedDeployments: string[];
    // eslint-disable-next-line camelcase
    expandedTerraformNodes: { deployment_id: string; id: string }[];
    saveConfirmationOpen: boolean;
    isRedirecting: boolean;
    terraformDetails?: TerraformResources;
}

export default class Topology extends React.Component<TopologyProps, TopologyState> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
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

    private topologyData: ReturnType<Topology['buildTopologyData']>;

    private topology: BlueprintTopology<NodeTemplateData> | null;

    private processedTopologyData?: StageTopologyData;

    constructor(props: TopologyProps) {
        super(props);

        this.topologyData = null;
        this.topology = null;

        this.state = {
            saveConfirmationOpen: false,
            expandedDeployments: [],
            expandedTerraformNodes: [],
            isRedirecting: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('topology:selectNode', this.selectNode, this);
        toolbox.getEventBus().on('blueprints:refresh', toolbox.refresh, this);
        toolbox.getEventBus().on('deployments:refresh', toolbox.refresh, this);
        this.startTopology();
        this.updateTopology();
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

        const topologyRestartRequired =
            configuration !== prevProps.configuration ||
            blueprintId !== prevProps.blueprintId ||
            !_.isEqual(data.icons, prevProps.data.icons);

        const topologyUpdateRequired =
            topologyRestartRequired ||
            !_.isEqual(data.blueprintDeploymentData, prevProps.data.blueprintDeploymentData) ||
            expandedDeployments !== prevState.expandedDeployments ||
            expandedTerraformNodes !== prevState.expandedTerraformNodes;

        if (topologyRestartRequired) this.startTopology();
        if (topologyUpdateRequired) this.updateTopology();
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        this.destroyTopology();
        toolbox.getEventBus().off('topology:selectNode', this.selectNode);
        toolbox.getEventBus().off('blueprints:refresh', toolbox.refresh);
        toolbox.getEventBus().off('deployments:refresh', toolbox.refresh);
    }

    getExpandHandler(stateProp: 'expandedDeployments' | 'expandedTerraformNodes') {
        return (entityId: string) => {
            const { [stateProp]: currentExpanded } = this.state;

            if (_.find(currentExpanded, entityId)) {
                // Nothing to do
                return;
            }

            this.setState(prevState => ({ ...prevState, [stateProp]: [...currentExpanded, entityId] }));
        };
    }

    getCollapseHandler(stateProp: 'expandedDeployments' | 'expandedTerraformNodes') {
        return (entityToCollapse: unknown) => {
            const { [stateProp]: currentExpanded } = this.state;
            this.setState(prevState => ({
                ...prevState,
                [stateProp]: _.reject(currentExpanded, entity => _.isEqual(entity, entityToCollapse))
            }));
        };
    }

    setSelectedNode(selectedNode: StageTopologyElement) {
        const { deploymentId, blueprintId, toolbox } = this.props;
        const { isRedirecting } = this.state;

        if (isRedirecting) {
            return;
        }

        if (deploymentId) {
            toolbox.getContext().setValue('depNodeId', selectedNode.name + deploymentId);
            toolbox.getContext().setValue('nodeId', selectedNode.name);
        } else if (blueprintId) {
            toolbox.getContext().setValue('nodeId', selectedNode.name);
        }
    }

    updateTopology() {
        const { data } = this.props;
        const isFirstTimeLoading = this.topologyData === null;
        const oldTopologyData = this.topologyData;
        this.topologyData = this.buildTopologyData();

        if (_.isEmpty(data.blueprintDeploymentData)) {
            this.topology?.setTopology(this.topologyData, {});
        } else if (isFirstTimeLoading || isNodesChanged(oldTopologyData?.nodes, this.topologyData?.nodes)) {
            const { layout } = data;
            this.topology?.setTopology(this.topologyData, layout);
            if (isFirstTimeLoading) this.topology?.setScale(_.get(layout, 'scaleInfo'));
        } else {
            this.topology?.refreshTopologyDeploymentStatus(this.topologyData);
        }
        this.topology?.setLoading(false);
    }

    startTopology() {
        const { blueprintId, configuration, data, toolbox } = this.props;
        this.destroyTopology();
        this.topology = new BlueprintTopology({
            isLoading: true,
            selector: `#${topologyContainerId}`,
            autoScale: true,
            showToolbar: configuration.showToolbar ?? true,
            showToolbarCursorActions: false,
            showToolbarLayoutActions: true,
            enableGroupClick: configuration.enableGroupClick ?? true,
            enableNodeClick: configuration.enableNodeClick ?? true,
            enableZoom: configuration.enableZoom ?? true,
            enableDrag: configuration.enableDrag ?? true,
            enableDrop: true,
            enableDragEdit: false,
            enableDragToSelect: true,
            enableContextMenu: false,
            onNodeSelected: node => this.setSelectedNode(node),
            onDataProcessed: processedData => {
                this.processedTopologyData = processedData;
            },
            onDeploymentNodeClick: deploymentId => this.goToDeploymentPage(deploymentId),
            onExpandClick: this.getExpandHandler('expandedDeployments'),
            onCollapseClick: this.getCollapseHandler('expandedDeployments'),
            onTerraformDetailsClick: node => this.setState({ terraformDetails: node.templateData.terraformResources }),
            onTerraformExpandClick: this.getExpandHandler('expandedTerraformNodes'),
            onTerraformCollapseClick: this.getCollapseHandler('expandedTerraformNodes'),
            onLayoutSave: body =>
                toolbox
                    .getInternal()
                    .doPut<any, PutBlueprintUserDataLayoutRequestBody>(`/bud/layout/${blueprintId}`, { body })
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

        const topology = _.cloneDeep(data.blueprintDeploymentData)!;

        const determineComponentsPlugins = (deploymentData: StageTopologyData) => {
            _(deploymentData.nodes)
                .map('templateData')
                .filter({ actual_number_of_instances: 1 })
                .each(templateData => {
                    if (templateData.deploymentId) {
                        const componentDeploymentData = data.componentDeploymentsData[templateData.deploymentId];
                        if (componentDeploymentData) {
                            determineComponentsPlugins(componentDeploymentData);
                            templateData.plugins = _(componentDeploymentData.nodes)
                                .flatMap('templateData.plugins')
                                .filter('package_name')
                                .uniqBy('package_name')
                                .value();
                        }
                    }
                });
        };

        determineComponentsPlugins(topology);

        const expandDeployments = (deploymentsToExpand: string[]) => {
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

                topology.connectors?.push(...expandedTopology.connectors);
                topology.groups?.push(...expandedTopology.groups);
                topology.nodes?.push(...expandedTopology.nodes);

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
            const terraformNode = _.find(topology.nodes, node => _.isMatch(node.templateData, terraformNodeData))!;
            const terraformDeploymentNodes = _.map(terraformNode.templateData.terraformResources, resource => {
                const newNode: StageTopologyElement = {
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
                    connectedTo: [],
                    container: { parent: terraformNode }
                };
                terraformNode.children = terraformNode.children || [];
                terraformNode.children.push(newNode);
                return newNode;
            });
            topology.nodes?.push(...terraformDeploymentNodes);

            _.each(terraformNode.templateData.terraformResources, resource =>
                _(resource.instances)
                    .flatMap('dependencies')
                    .compact()
                    .uniq()
                    .forEach((dependency: string) => {
                        const [dependencyName] = dependency.split('.').slice(-1);
                        const side2 = terraformDeploymentNodes.find(node => node.name === dependencyName);

                        if (!side2) {
                            return;
                        }

                        const side1 = terraformDeploymentNodes.find(node => node.name === resource.name)!;
                        const connector = {
                            name: '',
                            id: `terraformDependency:${resource.name}.${dependencyName}`,
                            templateData: {
                                type: 'cloudify.relationships.depends_on'
                            },
                            side1,
                            side2
                        };
                        side1?.connectedTo?.push(connector);
                        side2?.connectedTo?.push(connector);
                        topology.connectors?.push(connector);
                    })
            );
        });

        return topology;
    }

    selectNode(nodeId: unknown) {
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

    goToDeploymentPage(nodeDeploymentId: unknown) {
        const { toolbox } = this.props;

        /*
            NOTE: isRedirecting flag is being set to block updating context with data provided by setSelectedNode function.
            More context: it seems that upon clicking 'Go to deployment page' button we are also triggering (via event bubbling) onNodeSelected event handler, which is executing setSelectedNode function.
        */
        this.setState({
            isRedirecting: true
        });

        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId: nodeDeploymentId }, nodeDeploymentId);
    }

    render() {
        const { saveConfirmationOpen, terraformDetails } = this.state;
        return (
            <TopologyView
                terraformDetails={terraformDetails}
                onTerraformDetailsModalClose={() => this.setState({ terraformDetails: undefined })}
                saveConfirmationOpen={saveConfirmationOpen}
            />
        );
    }
}
