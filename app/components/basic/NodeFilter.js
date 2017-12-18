/**
 * Created by jakubniezgoda on 05/12/2017.
 */

import React, { PropTypes } from 'react';
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
    }

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {string} value value of the field (object containing the following string valued keys: blueprintId, deploymentId, nodeId, nodeInstanceId)
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.shape({
            blueprintId: PropTypes.string.isRequired,
            deploymentId: PropTypes.string.isRequired,
            nodeId: PropTypes.string.isRequired,
            nodeInstanceId: PropTypes.string.isRequired
        }).isRequired
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

    componentWillReceiveProps(nextProps) {
        if (this.state.blueprintId !== nextProps.value.blueprintId ||
            this.state.deploymentId !== nextProps.value.deploymentId ||
            this.state.nodeId !== nextProps.value.nodeId ||
            this.state.nodeInstanceId !== nextProps.value.nodeInstanceId)
        {
            this.setState({...NodeFilter.initialState(nextProps)});
            this._fetchBlueprints();
            this._fetchDeployments();
            this._fetchNodes();
            this._fetchNodeInstances();
        }
    }

    componentWillMount() {
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
                let parsedData = _.chain(data.items || {})
                                  .map((item) => ({text: item.id, value: item.id, key: item.id}))
                                  .unshift({text: '', value: '', key: ''})
                                  .uniqWith(_.isEqual)
                                  .value();
                this.setState({[loading]: false, [optionsField]: parsedData});
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
        };
        if (!_.isEmpty(this.state.deploymentId)) {
            params.deployment_id = this.state.deploymentId;
        };
        this._fetchData('/nodes', params, 'nodes');
    }

    _fetchNodeInstances() {
        let params = {...NodeFilter.BASIC_PARAMS};
        if (!_.isEmpty(this.state.deploymentId)) {
            params.deployment_id = this.state.deploymentId;
        };
        if (!_.isEmpty(this.state.nodeId)) {
            params.node_id = this.state.nodeId;
        };
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

    _selectBlueprint(event, field){
        this._handleInputChange({deploymentId: '', nodeId: '', nodeInstanceId: ''}, event, field, () => {
            this._fetchDeployments();
            this._fetchNodes();
            this._fetchNodeInstances();
        });
    }

    _selectDeployment(event, field){
        this._handleInputChange({nodeId: '', nodeInstanceId: ''}, event, field, () => {
            this._fetchNodes();
            this._fetchNodeInstances();
        });
    }

    _selectNode(event, field) {
        this._handleInputChange({nodeInstanceId: ''}, event, field, () => {
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
                <Form.Field error={this.state.errors.blueprints}>
                    <Form.Dropdown search selection value={errors.blueprints ? '' : this.state.blueprintId}
                                   placeholder={errors.blueprints || 'Blueprint'}
                                   options={this.state.blueprints} onChange={this._selectBlueprint.bind(this)}
                                   name="blueprintId" loading={this.state.blueprintsLoading} />
                </Form.Field>
                <Form.Field error={this.state.errors.deployments}>
                    <Form.Dropdown search selection value={errors.deployments ? '' : this.state.deploymentId}
                                   placeholder={errors.deployments || 'Deployment'}
                                   options={this.state.deployments} onChange={this._selectDeployment.bind(this)}
                                   name="deploymentId" loading={this.state.deploymentsLoading} />
                </Form.Field>
                <Form.Field error={this.state.errors.nodes}>
                    <Form.Dropdown search selection value={errors.nodes ? '' : this.state.nodeId}
                                   placeholder={errors.nodes || 'Node'}
                                   options={this.state.nodes} onChange={this._selectNode.bind(this)}
                                   name="nodeId" loading={this.state.nodesLoading} />
                </Form.Field>
                <Form.Field error={this.state.errors.nodeInstances}>
                    <Form.Dropdown search selection value={errors.nodeInstances ? '' : this.state.nodeInstanceId}
                                   placeholder={errors.nodeInstances || 'Node Instance'}
                                   options={this.state.nodeInstances} onChange={this._selectNodeInstance.bind(this)}
                                   name="nodeInstanceId" loading={this.state.nodeInstancesLoading} />
                </Form.Field>
            </Form.Group>
        );
    }
}
