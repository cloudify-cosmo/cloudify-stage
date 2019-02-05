/**
 * Created by jakub.niezgoda on 09/10/2018.
 */

import Consts from './consts';

export default class InstallAgentsModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = InstallAgentsModal.initialState(props);
    }

    static initialState = (props) => {
        return {
            allowedDeployments: null,
            allowedNodes: null,
            allowedNodeInstances: null,
            loading: false,
            executionId: '',
            executionStarted: false,
            errors: {},
            
            nodeFilter: {
                blueprintId: '',
                deploymentId: _.isArray(props.deploymentId) ? props.deploymentId[0] : (props.deploymentId || ''),
                nodeId: _.isNil(props.nodeId) ? [] : _.castArray(props.nodeId),
                nodeInstanceId: _.isNil(props.nodeInstanceId) ? [] : _.castArray(props.nodeInstanceId)
            },
            installMethods: _.isNil(props.installMethods) ? [] : _.castArray(props.installMethods),
            stopOldAgent: false,
            managerIp: '',
            managerCertificate: ''
        }
    };

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,

        agents: PropTypes.array,
        blueprintId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        deploymentId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        nodeInstanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        installMethods: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    };

    static defaultProps = {
        agents: [],
        blueprintId: '',
        deploymentId: '',
        nodeId: [],
        nodeInstanceId: [],
        installMethods: []
    };

    componentDidUpdate(prevProps) {
        if (this.props.open && !prevProps.open) {
            let allowedDeployments = _.chain(this.props.agents).map((agent) => agent.deployment).uniq().value();
            let allowedNodes = _.chain(this.props.agents).map((agent) => agent.node).uniq().value();
            let allowedNodeInstances = _.chain(this.props.agents).map((agent) => agent.id).uniq().value();
            this.setState({...InstallAgentsModal.initialState(this.props), allowedDeployments, allowedNodes, allowedNodeInstances});
        }
    }

    onApprove() {
        this.submitExecute();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    onShowExecutionStatus() {
        const deploymentId = this.state.nodeFilter.deploymentId;
        const executionId = this.state.executionId;
        this.props.onHide();
        this.props.toolbox.drillDown(this.props.widget, 'execution', {deploymentId, executionId},
                                     `Install New Agents on ${deploymentId}`);
    }

    submitExecute () {
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
            stop_old_agent: this.state.stopOldAgent,
            manager_ip: !_.isEmpty(this.state.managerIp) ? this.state.managerIp : undefined,
            manager_certificate: !_.isEmpty(this.state.managerCertificate) ? this.state.managerCertificate : undefined,
        };
        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doExecute({id: nodeFilter.deploymentId}, {name: 'install_new_agents'}, params, false).then((data) => {
            this.setState({loading: false, errors: {}, executionStarted: true, executionId: data.id});
        }).catch((err)=>{
            this.setState({loading: false, errors: {error: err.message}});
        })
    }

    handleInputChange(event, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {ApproveButton, Button, CancelButton, Form, Icon, Message, Modal, NodeFilter} = Stage.Basic;

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
                <Modal.Header>
                    <Icon name="download"/> Install new agents
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors} success={this.state.executionStarted}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        {
                            !this.state.executionStarted &&
                            <React.Fragment>
                                <Form.Field label='Nodes filter' required
                                            help='Filter agents by deployment, nodes and node instances. Filtering turned off when none selected.'>
                                    <NodeFilter name='nodeFilter' value={this.state.nodeFilter}
                                                showBlueprints={false} allowMultipleNodes allowMultipleNodeInstances
                                                allowedDeployments={this.state.allowedDeployments}
                                                allowedNodes={this.state.allowedNodes}
                                                allowedNodeInstances={this.state.allowedNodeInstances}
                                                onChange={this.handleInputChange.bind(this)} />
                                </Form.Field>

                                <Form.Field label='Install Methods filter'
                                            help='Filter agents by install methods. Filtering turned off when none selected.'>
                                    <Form.Dropdown name='installMethods' multiple selection options={Consts.installMethodsOptions}
                                                   value={this.state.installMethods} onChange={this.handleInputChange.bind(this)}/>
                                </Form.Field>

                                <Form.Field label='Manager IP'
                                            help="The private IP of the current leader (master) Manager.
                                          This IP is used to connect to the Manager's RabbitMQ.
                                          Relevant only in HA cluster.">
                                    <Form.Input name='managerIp' value={this.state.managerIp}
                                                onChange={this.handleInputChange.bind(this)} />
                                </Form.Field>

                                <Form.Field label='Manager Certificate'
                                            help="A path to a file containing the SSL certificate
                                          of the current leader Manager. The certificate
                                          is available on the Manager:
                                          /etc/cloudify/ssl/cloudify_internal_ca_cert.pem">
                                    <Form.Input name='managerCertificate' value={this.state.managerCertificate}
                                                onChange={this.handleInputChange.bind(this)} />
                                </Form.Field>

                                <Form.Field help='If set, after installing the new agent the old agent
                                          (that is connected to the old Cloudify Manager) will be stopped.
                                          *IMPORTANT* if the deployment has monitoring with auto-healing configured,
                                          you need to disable it first'>
                                    <Form.Checkbox label='Stop old agent' toggle name='stopOldAgent'
                                                   checked={this.state.stopOldAgent} onChange={this.handleInputChange.bind(this)} />
                                </Form.Field>
                            </React.Fragment>
                        }

                        <Message success header='Execution started'
                                 content="New agents installation has been started. Click 'Show Status and Logs' button to see details." />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton content={this.state.executionStarted ? 'Close' : undefined}
                                  onClick={this.onCancel.bind(this)}
                                  disabled={this.state.loading} />
                    {
                        !this.state.executionStarted &&
                        <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading}
                                       content="Install" icon="download" color="green"/>
                    }
                    {
                        this.state.executionStarted &&
                        <Button content="Show Status and Logs" icon="file text" color="green"
                                onClick={this.onShowExecutionStatus.bind(this)} />
                    }
                </Modal.Actions>
            </Modal>
        );
    }
};