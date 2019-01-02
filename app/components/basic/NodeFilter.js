/**
 * Created by jakubniezgoda on 05/12/2017.
 */

import PropTypes from 'prop-types';

import React from 'react';
import Form from './form/Form';

/**
 * NodeFilter  - a component showing dropdowns for filtering blueprints, deployments, nodes and nodes instances.
 * Data (list of blueprints, deployments, nodes and node instances) is dynamically fetched from manager.
 *
 * ## Access
 * `Stage.Basic.NodeFilter`
 *
 * ## Usage
 * ![NodeFilter](manual/asset/NodeFilter_0.png)
 *
 * ```
 * let value = {blueprintId: '', deploymentId: '', nodeId: '', nodeInstance: ''}
 * <NodeFilter name='nodeFilter' value={value} />
 * ```
 *
 */
export default class NodeFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = NodeFilter.initialState(props);
        this.toolbox = Stage.Utils.getToolbox(()=>{}, ()=>{}, null);
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
     * @property {string} name name of the field
     * @property {string} value value of the field (object containing the following string valued keys: blueprintId, deploymentId, nodeId, nodeInstanceId)
     * @property {func} [onChange=_.noop] function to be called on value change
     * @property {bool} [allowMultiple=false] if set to true, then it will be allowed to select more than one blueprint, deployment, node and node instance
     * @property {bool} [allowMultipleBlueprints=false] if set to true, then it will be allowed to select more than one blueprint
     * @property {bool} [allowMultipleDeployments=false] if set to true, then it will be allowed to select more than one deployment
     * @property {bool} [allowMultipleNodes=false] if set to true, then it will be allowed to select more than one node
     * @property {bool} [allowMultipleNodeInstances=false] if set to true, then it will be allowed to select more than one node instance
     * @property {array} [allowedBlueprints=null] array specifing allowed blueprints to be selected
     * @property {array} [allowedDeployments=null] array specifing allowed deployments to be selected
     * @property {array} [allowedNodes=null] array specifing allowed nodes to be selected
     * @property {array} [allowedNodeInstances=null] array specifing allowed node instances to be selected
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

    static initialState = (props) => ({
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

    static BASIC_PARAMS = {_include: 'id'};

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
            || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.blueprintId !== this.props.value.blueprintId ||
            prevState.deploymentId !== this.props.value.deploymentId ||
            prevState.nodeId !== this.props.value.nodeId ||
            prevState.nodeInstanceId !== this.props.value.nodeInstanceId)
        {
            this.setState({...NodeFilter.initialState(this.props)});
            this._fetchBlueprints();
            this._fetchDeployments();
            this._fetchNodes();
            this._fetchNodeInstances();
        }
    }

    componentDidMount() {
        this._fetchBlueprints();
        this._fetchDeployments();
        this._fetchNodes();
        this._fetchNodeInstances();
    }

    _fetchData(fetchUrl, params, optionsField) {
        let loading = `${optionsField}Loading`;

        let errors = {...this.state.errors};
        errors[optionsField] = null;
        this.setState({[loading]: true, [optionsField]: [], errors});
        this.toolbox.getManager().doGet(fetchUrl, params)
            .then((data) => {
                let ids = _.chain(data.items || [])
                    .map((item) => item.id)
                    .uniqWith(_.isEqual)
                    .value();
                if (this._isFilteringSetFor(optionsField)) {
                    ids = _.intersection(ids, this._getAllowedOptionsFor(optionsField));
                }

                let options = _.map(ids, (id) => ({text: id, value: id, key: id}));
                if (!this._isMultipleSetFor(optionsField)) {
                    options.unshift({text: '', value: '', key: ''});
                }

                this.setState({[loading]: false, [optionsField]: options});
            })
            .catch((error) => {
                errors[optionsField] = `Data fetching error: ${error.message}`;
                this.setState({[loading]: false, [optionsField]: [], errors});
            });
    }

    _fetchBlueprints() {
        let params = {...NodeFilter.BASIC_PARAMS};
        this._fetchData('/blueprints', params, 'blueprints');
    }

    _fetchDeployments() {
        let params = {...NodeFilter.BASIC_PARAMS};
        if (!_.isEmpty(this.state.blueprintId)) {
            params.blueprint_id = this.state.blueprintId;
        }
        this._fetchData('/deployments', params, 'deployments');
    }

    _fetchNodes() {
        let params = {...NodeFilter.BASIC_PARAMS};
        if (!_.isEmpty(this.state.blueprintId)) {
            params.blueprint_id = this.state.blueprintId;
        }
        if (!_.isEmpty(this.state.deploymentId)) {
            params.deployment_id = this.state.deploymentId;
        }
        this._fetchData('/nodes', params, 'nodes');
    }

    _fetchNodeInstances() {
        let params = {...NodeFilter.BASIC_PARAMS};
        if (!_.isEmpty(this.state.deploymentId)) {
            params.deployment_id = this.state.deploymentId;
        }
        if (!_.isEmpty(this.state.nodeId)) {
            params.node_id = this.state.nodeId;
        }
        this._fetchData('/node-instances', params, 'nodeInstances');
    }

    _handleInputChange(state, event, field, onStateChange) {
        this.setState({...state, [field.name]: field.value}, () => {
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
            })
        });
    }

    _isMultipleSetFor(resourcesName) {
        return this.props.allowMultiple || this.props[`allowMultiple${_.upperFirst(resourcesName)}`];
    }

    _getEmptyValueFor(resourcesName) {
        return this._isMultipleSetFor(resourcesName) ? [] : '';
    };

    _isFilteringSetFor(resourcesName) {
        return !_.isEmpty(this.props[`allowed${_.upperFirst(resourcesName)}`]);
    }

    _getAllowedOptionsFor(resourcesName) {
        return this.props[`allowed${_.upperFirst(resourcesName)}`];
    }

    _selectBlueprint(event, field){
        this._handleInputChange({
            deploymentId: this._getEmptyValueFor('deployments'),
            nodeId: this._getEmptyValueFor('nodes'),
            nodeInstanceId: this._getEmptyValueFor('nodeInstances'),
        }, event, field, () => {
            this._fetchDeployments();
            this._fetchNodes();
            this._fetchNodeInstances();
        });
    }

    _selectDeployment(event, field){
        this._handleInputChange({
            nodeId: this._getEmptyValueFor('nodes'),
            nodeInstanceId: this._getEmptyValueFor('nodeInstances')
        }, event, field, () => {
            this._fetchNodes();
            this._fetchNodeInstances();
        });
    }

    _selectNode(event, field) {
        this._handleInputChange({
            nodeInstanceId: this._getEmptyValueFor('nodeInstances')
        }, event, field, () => {
            this._fetchNodeInstances();
        });
    }

    _selectNodeInstance(event, field) {
        this._handleInputChange({}, event, field);
    }

    render() {
        let errors = this.state.errors;
        let errorMessage = 'Data fetching error';

        return (
            <Form.Group widths='equal'>
                {
                    this.props.showBlueprints &&
                    <Form.Field error={this.state.errors.blueprints}>
                        <Form.Dropdown search selection value={errors.blueprints ? this._getEmptyValueFor('blueprints')  : this.state.blueprintId}
                                       multiple={this._isMultipleSetFor('blueprints')}
                                       placeholder={errors.blueprints || 'Blueprint'}
                                       options={this.state.blueprints} onChange={this._selectBlueprint.bind(this)}
                                       name="blueprintId" loading={this.state.blueprintsLoading} />
                    </Form.Field>
                }
                {
                    this.props.showDeployments &&
                    <Form.Field error={this.state.errors.deployments}>
                        <Form.Dropdown search selection value={errors.deployments ? this._getEmptyValueFor('deployments') : this.state.deploymentId}
                                       multiple={this._isMultipleSetFor('deployments')}
                                       placeholder={errors.deployments || 'Deployment'}
                                       options={this.state.deployments} onChange={this._selectDeployment.bind(this)}
                                       name="deploymentId" loading={this.state.deploymentsLoading} />
                    </Form.Field>
                }
                {
                    this.props.showNodes &&
                    <Form.Field error={this.state.errors.nodes}>
                        <Form.Dropdown search selection value={errors.nodes ? this._getEmptyValueFor('nodes') : this.state.nodeId}
                                       multiple={this._isMultipleSetFor('nodes')}
                                       placeholder={errors.nodes || 'Node'}
                                       options={this.state.nodes} onChange={this._selectNode.bind(this)}
                                       name="nodeId" loading={this.state.nodesLoading} />
                    </Form.Field>
                }
                {
                    this.props.showNodeInstances &&
                    <Form.Field error={this.state.errors.nodeInstances}>
                        <Form.Dropdown search selection value={errors.nodeInstances ? this._getEmptyValueFor('nodeInstances') : this.state.nodeInstanceId}
                                       multiple={this._isMultipleSetFor('nodeInstances')}
                                       placeholder={errors.nodeInstances || 'Node Instance'}
                                       options={this.state.nodeInstances} onChange={this._selectNodeInstance.bind(this)}
                                       name="nodeInstanceId" loading={this.state.nodeInstancesLoading} />
                    </Form.Field>
                }
            </Form.Group>
        );
    }
}
