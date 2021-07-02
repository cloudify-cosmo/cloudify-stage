// @ts-nocheck File not migrated fully to TS
/**
 * NodeFilter  - a component showing dropdowns for filtering blueprints, deployments, nodes and nodes instances.
 * Data (list of blueprints, deployments, nodes and node instances) is dynamically fetched from manager.
 */
export default class NodeFilter extends React.Component {
    static EMPTY_VALUE = {
        blueprintId: '',
        deploymentId: '',
        nodeId: '',
        nodeInstanceId: ''
    };

    static BASIC_PARAMS = { _include: 'id' };

    static DEPLOYMENT_PARAMS = { _include: 'id,display_name' };

    static initialState = props => ({
        blueprints: [],
        deployments: [],
        nodes: [],
        nodeInstances: [],
        blueprintId: props.value.blueprintId,
        deploymentId: props.value.deploymentId,
        nodeId: props.value.nodeId,
        nodeInstanceId: props.value.nodeInstanceId,
        errors: {}
    });

    constructor(props, context) {
        super(props, context);

        this.state = NodeFilter.initialState(props);
    }

    componentDidMount() {
        this.fetchBlueprints();
        this.fetchDeployments();
        this.fetchNodes();
        this.fetchNodeInstances();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    handleInputChange(state, event, field, onStateChange) {
        const { name, onChange } = this.props;
        this.setState({ ...state, [field.name]: field.value }, () => {
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

    getEmptyValueFor(resourcesName) {
        return this.isMultipleSetFor(resourcesName) ? [] : '';
    }

    getAllowedOptionsFor(resourcesName) {
        const { [`allowed${_.upperFirst(resourcesName)}`]: allowedOptions } = this.props;
        return allowedOptions;
    }

    selectBlueprint = (event, field) => {
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

    selectDeployment = (event, field) => {
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

    selectNode = (event, field) => {
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

    selectNodeInstance = (event, field) => {
        this.handleInputChange({}, event, field);
    };

    fetchData(fetchUrl, params, optionsField) {
        const { toolbox } = this.props;
        const { errors: stateErrors } = this.state;

        const loading = `${optionsField}Loading`;
        const errors = { ...stateErrors };
        errors[optionsField] = null;
        this.setState({ [loading]: true, [optionsField]: [], errors });

        toolbox
            .getManager()
            .doGet(fetchUrl, { params })
            .then(data => {
                let additionalOptions = [];

                if (this.isFilteringSetFor(optionsField)) {
                    additionalOptions = this.getAllowedOptionsFor(optionsField);
                }

                const options: Stage.Basic.Dropdown.Item.DropdownItemProps[] = Object.entries(
                    (data.items || []).reduce((result: Record<string, string>, item) => {
                        result[item.id] = item.display_name || item.id;

                        return result;
                    }, {})
                )
                    .map(([id, displayName]) => ({
                        value: id,
                        text: id === displayName ? displayName : `${displayName} (${id})`,
                        key: id
                    }))
                    .concat(additionalOptions.map(item => ({ value: item, text: item, key: item })));

                if (!this.isMultipleSetFor(optionsField)) {
                    options.unshift({ text: '', value: '', key: '' });
                }

                this.setState({ [loading]: false, [optionsField]: options });
            })
            .catch(error => {
                errors[optionsField] = `Data fetching error: ${error.message}`;
                this.setState({ [loading]: false, [optionsField]: [], errors });
            });
    }

    fetchBlueprints() {
        const params = { ...NodeFilter.BASIC_PARAMS };
        this.fetchData('/blueprints', params, 'blueprints');
    }

    fetchDeployments() {
        const { blueprintId } = this.state;
        const params = { ...NodeFilter.DEPLOYMENT_PARAMS };
        if (!_.isEmpty(blueprintId)) {
            params.blueprint_id = blueprintId;
        }
        this.fetchData('/deployments', params, 'deployments');
    }

    fetchNodes() {
        const { blueprintId, deploymentId } = this.state;
        const params = { ...NodeFilter.BASIC_PARAMS };
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
        const params = { ...NodeFilter.BASIC_PARAMS };
        if (!_.isEmpty(deploymentId)) {
            params.deployment_id = deploymentId;
        }
        if (!_.isEmpty(nodeId)) {
            params.node_id = nodeId;
        }
        this.fetchData('/node-instances', params, 'nodeInstances');
    }

    isMultipleSetFor(resourcesName) {
        const { allowMultiple, [`allowMultiple${_.upperFirst(resourcesName)}`]: resourceAllowMultiple } = this.props;
        return allowMultiple || resourceAllowMultiple;
    }

    isFilteringSetFor(resourcesName) {
        const { [`allowed${_.upperFirst(resourcesName)}`]: allowedOptions } = this.props;
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

/**
 * @property {string} name name of the field
 * @property {string} value value of the field (object containing the following string valued keys: blueprintId, deploymentId, nodeId, nodeInstanceId)
 * @property {object} toolbox Toolbox object
 * @property {func} [onChange=_.noop] function to be called on value change
 * @property {bool} [allowMultiple=false] if set to true, then it will be allowed to select more than one blueprint, deployment, node and node instance
 * @property {bool} [allowMultipleBlueprints=false] if set to true, then it will be allowed to select more than one blueprint
 * @property {bool} [allowMultipleDeployments=false] if set to true, then it will be allowed to select more than one deployment
 * @property {bool} [allowMultipleNodes=false] if set to true, then it will be allowed to select more than one node
 * @property {bool} [allowMultipleNodeInstances=false] if set to true, then it will be allowed to select more than one node instance
 * @property {Array} [allowedBlueprints=null] array specifing allowed blueprints to be selected
 * @property {Array} [allowedDeployments=null] array specifing allowed deployments to be selected
 * @property {Array} [allowedNodes=null] array specifing allowed nodes to be selected
 * @property {Array} [allowedNodeInstances=null] array specifing allowed node instances to be selected
 * @property {bool} [showBlueprints=true] if set to false, then it will be not allowed to select blueprint
 * @property {bool} [showDeployments=true] if set to false, then it will be not allowed to select deployment
 * @property {bool} [showNodes=true] if set to false, then it will be not allowed to select node
 * @property {bool} [showNodeInstances=true] if set to false, then it will be not allowed to select node instance
 */
NodeFilter.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({
        blueprintId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
        deploymentId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
        nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
        nodeInstanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    onChange: PropTypes.func,
    allowMultiple: PropTypes.bool,
    allowMultipleBlueprints: PropTypes.bool,
    allowMultipleDeployments: PropTypes.bool,
    allowMultipleNodes: PropTypes.bool,
    allowMultipleNodeInstances: PropTypes.bool,
    allowedBlueprints: PropTypes.arrayOf(PropTypes.string),
    allowedDeployments: PropTypes.arrayOf(PropTypes.string),
    allowedNodes: PropTypes.arrayOf(PropTypes.string),
    allowedNodeInstances: PropTypes.arrayOf(PropTypes.string),
    showBlueprints: PropTypes.bool,
    showDeployments: PropTypes.bool,
    showNodes: PropTypes.bool,
    showNodeInstances: PropTypes.bool
};

NodeFilter.defaultProps = {
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

Stage.defineCommon({
    name: 'NodeFilter',
    common: NodeFilter
});
