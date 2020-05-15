/**
 * NodeFilter  - a component showing dropdowns for filtering blueprints, deployments, nodes and nodes instances.
 * Data (list of blueprints, deployments, nodes and node instances) is dynamically fetched from manager.
 */
export default class NodeFilter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = NodeFilter.initialState(props);
    }

    /*
     *
     */
    static EMPTY_VALUE = {
        blueprintId: '',
        deploymentId: '',
        nodeId: '',
        nodeInstanceId: ''
    };

    /**
     * propTypes
     *
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
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.shape({
            blueprintId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
            deploymentId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
            nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
            nodeInstanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
        }).isRequired,
        toolbox: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        allowMultiple: PropTypes.bool,
        allowMultipleBlueprints: PropTypes.bool,
        allowMultipleDeployments: PropTypes.bool,
        allowMultipleNodes: PropTypes.bool,
        allowMultipleNodeInstances: PropTypes.bool,
        allowedBlueprints: PropTypes.array,
        allowedDeployments: PropTypes.array,
        allowedNodes: PropTypes.array,
        allowedNodeInstances: PropTypes.array,
        showBlueprints: PropTypes.bool,
        showDeployments: PropTypes.bool,
        showNodes: PropTypes.bool,
        showNodeInstances: PropTypes.bool
    };

    static defaultProps = {
        onChange: _.noop,
        allowMultiple: false,
        allowMultipleBlueprints: false,
        allowMultipleDeployments: false,
        allowMultipleNode: false,
        allowMultipleNodes: false,
        allowedBlueprints: null,
        allowedDeployments: null,
        allowedNode: null,
        allowedNodes: null,
        showBlueprints: true,
        showDeployments: true,
        showNodes: true,
        showNodeInstances: true
    };

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

    static BASIC_PARAMS = { _include: 'id' };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.blueprintId !== this.props.value.blueprintId ||
            prevState.deploymentId !== this.props.value.deploymentId ||
            prevState.nodeId !== this.props.value.nodeId ||
            prevState.nodeInstanceId !== this.props.value.nodeInstanceId
        ) {
            this.setState({ ...NodeFilter.initialState(this.props) });
            this.fetchBlueprints();
            this.fetchDeployments();
            this.fetchNodes();
            this.fetchNodeInstances();
        }
    }

    componentDidMount() {
        this.fetchBlueprints();
        this.fetchDeployments();
        this.fetchNodes();
        this.fetchNodeInstances();
    }

    fetchData(fetchUrl, params, optionsField) {
        const loading = `${optionsField}Loading`;

        const errors = { ...this.state.errors };
        errors[optionsField] = null;
        this.setState({ [loading]: true, [optionsField]: [], errors });
        this.props.toolbox
            .getManager()
            .doGet(fetchUrl, params)
            .then(data => {
                let ids = _.chain(data.items || [])
                    .map(item => item.id)
                    .uniqWith(_.isEqual)
                    .value();
                if (this.isFilteringSetFor(optionsField)) {
                    ids = _.intersection(ids, this.getAllowedOptionsFor(optionsField));
                }

                const options = _.map(ids, id => ({ text: id, value: id, key: id }));
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
        const params = { ...NodeFilter.BASIC_PARAMS };
        if (!_.isEmpty(this.state.blueprintId)) {
            params.blueprint_id = this.state.blueprintId;
        }
        this.fetchData('/deployments', params, 'deployments');
    }

    fetchNodes() {
        const params = { ...NodeFilter.BASIC_PARAMS };
        if (!_.isEmpty(this.state.blueprintId)) {
            params.blueprint_id = this.state.blueprintId;
        }
        if (!_.isEmpty(this.state.deploymentId)) {
            params.deployment_id = this.state.deploymentId;
        }
        this.fetchData('/nodes', params, 'nodes');
    }

    fetchNodeInstances() {
        const params = { ...NodeFilter.BASIC_PARAMS };
        if (!_.isEmpty(this.state.deploymentId)) {
            params.deployment_id = this.state.deploymentId;
        }
        if (!_.isEmpty(this.state.nodeId)) {
            params.node_id = this.state.nodeId;
        }
        this.fetchData('/node-instances', params, 'nodeInstances');
    }

    handleInputChange(state, event, field, onStateChange) {
        this.setState({ ...state, [field.name]: field.value }, () => {
            if (_.isFunction(onStateChange)) {
                onStateChange();
            }
            this.props.onChange(event, {
                name: this.props.name,
                value: {
                    blueprintId: this.state.blueprintId,
                    deploymentId: this.state.deploymentId,
                    nodeId: this.state.nodeId,
                    nodeInstanceId: this.state.nodeInstanceId
                }
            });
        });
    }

    isMultipleSetFor(resourcesName) {
        return this.props.allowMultiple || this.props[`allowMultiple${_.upperFirst(resourcesName)}`];
    }

    getEmptyValueFor(resourcesName) {
        return this.isMultipleSetFor(resourcesName) ? [] : '';
    }

    isFilteringSetFor(resourcesName) {
        return !_.isEmpty(this.props[`allowed${_.upperFirst(resourcesName)}`]);
    }

    getAllowedOptionsFor(resourcesName) {
        return this.props[`allowed${_.upperFirst(resourcesName)}`];
    }

    selectBlueprint(event, field) {
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
    }

    selectDeployment(event, field) {
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
    }

    selectNode(event, field) {
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
    }

    selectNodeInstance(event, field) {
        this.handleInputChange({}, event, field);
    }

    render() {
        const { errors } = this.state;
        const { Form } = Stage.Basic;

        return (
            <Form.Group widths="equal">
                {this.props.showBlueprints && (
                    <Form.Field error={this.state.errors.blueprints}>
                        <Form.Dropdown
                            search
                            selection
                            value={errors.blueprints ? this.getEmptyValueFor('blueprints') : this.state.blueprintId}
                            multiple={this.isMultipleSetFor('blueprints')}
                            placeholder={errors.blueprints || 'Blueprint'}
                            options={this.state.blueprints}
                            onChange={this.selectBlueprint.bind(this)}
                            name="blueprintId"
                            loading={this.state.blueprintsLoading}
                        />
                    </Form.Field>
                )}
                {this.props.showDeployments && (
                    <Form.Field error={this.state.errors.deployments}>
                        <Form.Dropdown
                            search
                            selection
                            value={errors.deployments ? this.getEmptyValueFor('deployments') : this.state.deploymentId}
                            multiple={this.isMultipleSetFor('deployments')}
                            placeholder={errors.deployments || 'Deployment'}
                            options={this.state.deployments}
                            onChange={this.selectDeployment.bind(this)}
                            name="deploymentId"
                            loading={this.state.deploymentsLoading}
                        />
                    </Form.Field>
                )}
                {this.props.showNodes && (
                    <Form.Field error={this.state.errors.nodes}>
                        <Form.Dropdown
                            search
                            selection
                            value={errors.nodes ? this.getEmptyValueFor('nodes') : this.state.nodeId}
                            multiple={this.isMultipleSetFor('nodes')}
                            placeholder={errors.nodes || 'Node'}
                            options={this.state.nodes}
                            onChange={this.selectNode.bind(this)}
                            name="nodeId"
                            loading={this.state.nodesLoading}
                        />
                    </Form.Field>
                )}
                {this.props.showNodeInstances && (
                    <Form.Field error={this.state.errors.nodeInstances}>
                        <Form.Dropdown
                            search
                            selection
                            value={
                                errors.nodeInstances
                                    ? this.getEmptyValueFor('nodeInstances')
                                    : this.state.nodeInstanceId
                            }
                            multiple={this.isMultipleSetFor('nodeInstances')}
                            placeholder={errors.nodeInstances || 'Node Instance'}
                            options={this.state.nodeInstances}
                            onChange={this.selectNodeInstance.bind(this)}
                            name="nodeInstanceId"
                            loading={this.state.nodeInstancesLoading}
                        />
                    </Form.Field>
                )}
            </Form.Group>
        );
    }
}

Stage.defineCommon({
    name: 'NodeFilter',
    common: NodeFilter
});
