/**
 * Created by jakub.niezgoda on 05/10/2018.
 */

import PropTypes from 'prop-types';
import Consts from './consts';

export default class ValidateAgentsModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = ValidateAgentsModal.initialState(props);
    }

    static initialState = (props) => {
        return {
            errors: {},
            loading: false,
            nodeFilter: {
                blueprintId: '',
                deploymentId: _.isArray(props.deploymentId) ? props.deploymentId[0] : (props.deploymentId || ''),
                nodeId: _.isNil(props.nodeId) ? [] : _.castArray(props.nodeId),
                nodeInstanceId: _.isNil(props.nodeInstanceId) ? [] : _.castArray(props.nodeInstanceId)
            },
            installMethods: _.isNil(props.installMethods) ? [] : _.castArray(props.installMethods),
            allowedDeployments: null,
            allowedNodes: null,
            allowedNodeInstances: null
        }
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        blueprintId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        deploymentId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        nodeInstanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        installMethods: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        agents: PropTypes.array,
        onHide: PropTypes.func.isRequired
    };

    static defaultProps = {
        blueprintId: '',
        deploymentId: '',
        nodeId: [],
        nodeInstanceId: [],
        installMethods: [],
        agents: []
    };

    componentDidUpdate(prevProps) {
        if (this.props.open && !prevProps.open) {
            let allowedDeployments = _.chain(this.props.agents).map((agent) => agent.deployment).uniq().value();
            let allowedNodes = _.chain(this.props.agents).map((agent) => agent.node).uniq().value();
            let allowedNodeInstances = _.chain(this.props.agents).map((agent) => agent.id).uniq().value();
            this.setState({...ValidateAgentsModal.initialState(this.props), allowedDeployments, allowedNodes, allowedNodeInstances});
        }
    }

    onApprove () {
        this._submitExecute();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _submitExecute () {
        const nodeFilter = this.state.nodeFilter;
        if (!nodeFilter.deploymentId) {
            this.setState({errors: {error: 'Provide deployment in Nodes filter'}});
            return false;
        }

        this.setState({loading: true});
        let params = {
            node_ids: !_.isEmpty(nodeFilter.nodeId) ? nodeFilter.nodeId : undefined,
            node_instance_ids: !_.isEmpty(nodeFilter.nodeInstanceId) ? nodeFilter.nodeInstanceId : undefined,
            install_methods: !_.isEmpty(this.state.installMethods) ? this.state.installMethods : undefined,
        };
        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doExecute({id: nodeFilter.deploymentId}, {name: 'validate_agents'}, params, false).then(() => {
            this.setState({loading: false, errors: {}});
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
        }).catch((err)=>{
            this.setState({loading: false, errors: {error: err.message}});
        })
    }

    handleInputChange(event, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {ApproveButton, CancelButton, Form, Icon, Modal, NodeFilter} = Stage.Basic;

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
                <Modal.Header>
                    <Icon name="checkmark"/> Validate agents
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field label='Nodes filter'
                                    help='Filter agents by deployment, nodes and node instances. Filtering turned off when none selected.'>
                            <NodeFilter name='nodeFilter' value={this.state.nodeFilter}
                                        showBlueprints={false} allowMultipleNodes allowMultipleNodeInstances
                                        allowedDeployments={this.state.allowedDeployments}
                                        allowedNodes={this.state.allowedNodes}
                                        allowedNodeInstances={this.state.allowedNodeInstances}
                                        onChange={this.handleInputChange.bind(this)} />
                        </Form.Field>

                        <Form.Field label='Install methods filter'
                                    help='Filter agents by install methods. Filtering turned off when none selected.'>
                            <Form.Dropdown name='installMethods' multiple selection options={Consts.installMethodsOptions}
                                           value={this.state.installMethods} onChange={this.handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Validate" icon="checkmark" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};