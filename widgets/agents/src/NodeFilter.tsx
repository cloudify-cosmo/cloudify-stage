import type { StrictDropdownProps } from 'semantic-ui-react';
import type Manager from 'app/utils/Manager';
import type { ResourceId, ResourceIds } from './types';

export interface NodeFilterProps {
    /**
     * name of the field
     */
    name: string;

    /**
     * value of the field (object containing the following string valued keys: blueprintId, deploymentId, nodeId, nodeInstanceId)
     */
    value: ResourceIds;

    /**
     * function to be called on value change
     */
    onChange: (event: React.SyntheticEvent<HTMLElement>, data: { name: string; value: ResourceIds }) => void;

    /**
     *
     */
    manager: Manager;

    /**
     * if set to true, then it will be allowed to select more than one blueprint, deployment, node and node instance
     */
    allowMultiple: boolean;

    /**
     * if set to true, then it will be allowed to select more than one blueprint
     */
    allowMultipleBlueprints: boolean;

    /**
     * if set to true, then it will be allowed to select more than one deployment
     */
    allowMultipleDeployments: boolean;

    /**
     * if set to true, then it will be allowed to select more than one node
     */
    allowMultipleNodes: boolean;

    /**
     * if set to true, then it will be allowed to select more than one node instance
     */
    allowMultipleNodeInstances: boolean;

    /**
     * array specifing allowed blueprints to be selected
     */
    allowedBlueprints: string[];

    /**
     * array specifing allowed deployments to be selected
     */
    allowedDeployments: string[];

    /**
     * array specifing allowed nodes to be selected
     */
    allowedNodes: string[];

    /**
     * array specifing allowed node instances to be selected
     */
    allowedNodeInstances: string[];

    /**
     * if set to false, then it will be not allowed to select blueprint
     */
    showBlueprints: boolean;

    /**
     * if set to false, then it will be not allowed to select deployment
     */
    showDeployments: boolean;

    /**
     * if set to false, then it will be not allowed to select node
     */
    showNodes: boolean;

    /**
     * if set to false, then it will be not allowed to select node instance
     */
    showNodeInstances: boolean;
}

interface NodeFilterState extends ResourceIds {
    blueprints?: StrictDropdownProps['options'];
    deployments?: StrictDropdownProps['options'];
    nodes?: StrictDropdownProps['options'];
    nodeInstances?: StrictDropdownProps['options'];
    blueprintsLoading?: boolean;
    deploymentsLoading?: boolean;
    nodesLoading?: boolean;
    nodeInstancesLoading?: boolean;
    errors: Partial<Record<ResourceName, string>>;
}

type AllowedPropKey = keyof Pick<
    NodeFilterProps,
    'allowedBlueprints' | 'allowedDeployments' | 'allowedNodes' | 'allowedNodeInstances'
>;
type AllowedMultiplePropKey = keyof Pick<
    NodeFilterProps,
    'allowMultipleBlueprints' | 'allowMultipleDeployments' | 'allowMultipleNodes' | 'allowMultipleNodeInstances'
>;
type OnChangeDropdown = NonNullable<StrictDropdownProps['onChange']>;
type Params = Partial<Record<'_include' | 'blueprint_id' | 'deployment_id' | 'node_id', ResourceId>>;
type ResourceName = keyof Pick<NodeFilterState, 'blueprints' | 'deployments' | 'nodes' | 'nodeInstances'>;

/**
 * NodeFilter  - a component showing dropdowns for filtering blueprints, deployments, nodes and nodes instances.
 * Data (list of blueprints, deployments, nodes and node instances) is dynamically fetched from manager.
 */
export default class NodeFilter extends React.Component<NodeFilterProps, NodeFilterState> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        onChange: _.noop,
        allowMultiple: false,
        allowMultipleBlueprints: false,
        allowMultipleDeployments: false,
        allowMultipleNodeInstances: false,
        allowMultipleNodes: false,
        allowedBlueprints: null,
        allowedDeployments: null,
        allowedNodeInstances: null,
        allowedNodes: null,
        showBlueprints: true,
        showDeployments: true,
        showNodes: true,
        showNodeInstances: true
    };

    static BASIC_PARAMS = { _include: 'id' };

    static initialState = (props: NodeFilterProps) => ({
        blueprints: [],
        deployments: [],
        nodes: [],
        nodeInstances: [],
        blueprintId: props.value.blueprintId,
        deploymentId: props.value.deploymentId,
        nodeId: props.value.nodeId,
        nodeInstanceId: props.value.nodeInstanceId,
        blueprintsLoading: false,
        deploymentsLoading: false,
        nodesLoading: false,
        nodeInstancesLoading: false,
        errors: {}
    });

    constructor(props: NodeFilterProps) {
        super(props);

        this.state = NodeFilter.initialState(props);
    }

    componentDidMount() {
        this.fetchBlueprints();
        this.fetchDeployments();
        this.fetchNodes();
        this.fetchNodeInstances();
    }

    shouldComponentUpdate(nextProps: NodeFilterProps, nextState: NodeFilterState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    handleInputChange(
        state: Partial<NodeFilterState>,
        event: Parameters<OnChangeDropdown>[0],
        field: Parameters<OnChangeDropdown>[1],
        onStateChange?: () => void
    ) {
        const { name, onChange } = this.props;
        this.setState({ ...state, [field.name]: field.value, errors: {} }, () => {
            if (_.isFunction(onStateChange)) {
                onStateChange();
            }

            const { blueprintId, deploymentId, nodeId, nodeInstanceId } = this.state;
            onChange(event, {
                name,
                value: {
                    blueprintId,
                    deploymentId,
                    nodeId,
                    nodeInstanceId
                }
            });
        });
    }

    getEmptyValueFor(resourcesName: ResourceName) {
        return this.isMultipleSetFor(resourcesName) ? [] : '';
    }

    getAllowedOptionsFor(resourcesName: ResourceName) {
        const propKey = `allowed${_.upperFirst(resourcesName)}` as AllowedPropKey;
        const { [propKey]: allowedOptions } = this.props;
        return allowedOptions;
    }

    selectBlueprint: OnChangeDropdown = (event, field) => {
        this.handleInputChange(
            {
                deploymentId: this.getEmptyValueFor('deployments'),
                nodeId: this.getEmptyValueFor('nodes'),
                nodeInstanceId: this.getEmptyValueFor('nodeInstances')
            },
            event,
            field,
            () => {
                this.fetchDeployments();
                this.fetchNodes();
                this.fetchNodeInstances();
            }
        );
    };

    selectDeployment: OnChangeDropdown = (event, field) => {
        this.handleInputChange(
            {
                nodeId: this.getEmptyValueFor('nodes'),
                nodeInstanceId: this.getEmptyValueFor('nodeInstances')
            },
            event,
            field,
            () => {
                this.fetchNodes();
                this.fetchNodeInstances();
            }
        );
    };

    selectNode: OnChangeDropdown = (event, field) => {
        this.handleInputChange(
            {
                nodeInstanceId: this.getEmptyValueFor('nodeInstances')
            },
            event,
            field,
            () => {
                this.fetchNodeInstances();
            }
        );
    };

    selectNodeInstance: OnChangeDropdown = (event, field) => {
        this.handleInputChange({}, event, field);
    };

    fetchData(fetchUrl: string, params: Record<string, string | string[]>, resourceName: ResourceName) {
        const { manager } = this.props;
        const { errors: stateErrors } = this.state;

        type LoadingStateKey = 'blueprintsLoading' | 'deploymentsLoading' | 'nodesLoading' | 'nodeInstancesLoading';
        const loading: LoadingStateKey = `${resourceName}Loading`;
        const errors = { ...stateErrors };
        errors[resourceName] = undefined;
        this.setState({ [loading]: true, [resourceName]: [], errors });

        manager
            .doGet(fetchUrl, { params })
            .then((data: Stage.Types.PaginatedResponse<any>) => {
                let ids = _.chain(data.items || [])
                    .map(item => item.id)
                    .uniqWith(_.isEqual)
                    .value();
                if (this.isFilteringSetFor(resourceName)) {
                    ids = _.intersection(ids, this.getAllowedOptionsFor(resourceName));
                }

                const options = _.map(ids, id => ({ text: id, value: id, key: id }));
                if (!this.isMultipleSetFor(resourceName)) {
                    options.unshift({ text: '', value: '', key: '' });
                }

                this.setState({ [loading]: false, [resourceName]: options, errors: {} });
            })
            .catch((error: any) => {
                errors[resourceName] = `Data fetching error: ${error.message}`;
                this.setState({ [loading]: false, [resourceName]: [], errors });
            });
    }

    fetchBlueprints() {
        const params: Params = { ...NodeFilter.BASIC_PARAMS };
        this.fetchData('/blueprints', params, 'blueprints');
    }

    fetchDeployments() {
        const { blueprintId } = this.state;
        const params: Params = { ...NodeFilter.BASIC_PARAMS };
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = blueprintId;
        }
        this.fetchData('/deployments', params, 'deployments');
    }

    fetchNodes() {
        const { blueprintId, deploymentId } = this.state;
        const params: Params = { ...NodeFilter.BASIC_PARAMS };
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = blueprintId;
        }
        if (!_.isEmpty(deploymentId)) {
            params.deployment_id = deploymentId;
        }
        this.fetchData('/nodes', params, 'nodes');
    }

    fetchNodeInstances() {
        const { deploymentId, nodeId } = this.state;
        const params: Params = { ...NodeFilter.BASIC_PARAMS };
        if (!_.isEmpty(deploymentId)) {
            params.deployment_id = deploymentId;
        }
        if (!_.isEmpty(nodeId)) {
            params.node_id = nodeId;
        }
        this.fetchData('/node-instances', params, 'nodeInstances');
    }

    isMultipleSetFor(resourcesName: ResourceName) {
        const propKey = `allowMultiple${_.upperFirst(resourcesName)}` as AllowedMultiplePropKey;
        const { allowMultiple, [propKey]: resourceAllowMultiple } = this.props;
        return allowMultiple || resourceAllowMultiple;
    }

    isFilteringSetFor(resourcesName: ResourceName) {
        const propKey = `allowed${_.upperFirst(resourcesName)}` as AllowedPropKey;
        const { [propKey]: allowedOptions } = this.props;
        return !_.isEmpty(allowedOptions);
    }

    render() {
        const { showBlueprints, showDeployments, showNodeInstances, showNodes } = this.props;
        const {
            errors,
            blueprintId,
            blueprints,
            blueprintsLoading,
            deploymentId,
            deployments,
            deploymentsLoading,
            nodeId,
            nodeInstanceId,
            nodeInstances,
            nodeInstancesLoading,
            nodes,
            nodesLoading
        } = this.state;
        const { Form } = Stage.Basic;

        return (
            <Form.Group widths="equal">
                {showBlueprints && (
                    <Form.Field error={errors.blueprints}>
                        <Form.Dropdown
                            search
                            selection
                            value={errors.blueprints ? this.getEmptyValueFor('blueprints') : blueprintId}
                            multiple={this.isMultipleSetFor('blueprints')}
                            placeholder={errors.blueprints || 'Blueprint'}
                            options={blueprints}
                            onChange={this.selectBlueprint}
                            name="blueprintId"
                            loading={blueprintsLoading}
                        />
                    </Form.Field>
                )}
                {showDeployments && (
                    <Form.Field error={errors.deployments}>
                        <Form.Dropdown
                            search
                            selection
                            value={errors.deployments ? this.getEmptyValueFor('deployments') : deploymentId}
                            multiple={this.isMultipleSetFor('deployments')}
                            placeholder={errors.deployments || 'Deployment'}
                            options={deployments}
                            onChange={this.selectDeployment}
                            name="deploymentId"
                            loading={deploymentsLoading}
                        />
                    </Form.Field>
                )}
                {showNodes && (
                    <Form.Field error={errors.nodes}>
                        <Form.Dropdown
                            search
                            selection
                            value={errors.nodes ? this.getEmptyValueFor('nodes') : nodeId}
                            multiple={this.isMultipleSetFor('nodes')}
                            placeholder={errors.nodes || 'Node'}
                            options={nodes}
                            onChange={this.selectNode}
                            name="nodeId"
                            loading={nodesLoading}
                        />
                    </Form.Field>
                )}
                {showNodeInstances && (
                    <Form.Field error={errors.nodeInstances}>
                        <Form.Dropdown
                            search
                            selection
                            value={errors.nodeInstances ? this.getEmptyValueFor('nodeInstances') : nodeInstanceId}
                            multiple={this.isMultipleSetFor('nodeInstances')}
                            placeholder={errors.nodeInstances || 'Node Instance'}
                            options={nodeInstances}
                            onChange={this.selectNodeInstance}
                            name="nodeInstanceId"
                            loading={nodeInstancesLoading}
                        />
                    </Form.Field>
                )}
            </Form.Group>
        );
    }
}
