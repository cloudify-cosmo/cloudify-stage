/**
 * Created by jakub.niezgoda on 09/10/2018.
 */

import Consts from './consts';
import AgentsPropType from './props/AgentsPropType';

export default class InstallAgentsModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = InstallAgentsModal.initialState(props);
    }

    static initialState = props => {
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
                deploymentId: _.isArray(props.deploymentId) ? props.deploymentId[0] : props.deploymentId || '',
                nodeId: _.isNil(props.nodeId) ? [] : _.castArray(props.nodeId),
                nodeInstanceId: _.isNil(props.nodeInstanceId) ? [] : _.castArray(props.nodeInstanceId)
            },
            installMethods: _.isNil(props.installMethods) ? [] : _.castArray(props.installMethods),
            stopOldAgent: false,
            managerIp: '',
            managerCertificate: ''
        };
    };

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: Stage.PropTypes.Toolbox.isRequired,
        widget: Stage.PropTypes.Widget.isRequired,

        agents: AgentsPropType,
        // eslint-disable-next-line react/no-unused-prop-types
        deploymentId: Stage.PropTypes.StringOrArray,
        // eslint-disable-next-line react/no-unused-prop-types
        nodeId: Stage.PropTypes.StringOrArray,
        // eslint-disable-next-line react/no-unused-prop-types
        nodeInstanceId: Stage.PropTypes.StringOrArray,
        // eslint-disable-next-line react/no-unused-prop-types
        installMethods: Stage.PropTypes.StringOrArray
    };

    static defaultProps = {
        agents: [],
        deploymentId: '',
        nodeId: [],
        nodeInstanceId: [],
        installMethods: []
    };

    componentDidUpdate(prevProps) {
        const { agents, open } = this.props;
        if (open && !prevProps.open) {
            const allowedDeployments = _.chain(agents)
                .map(agent => agent.deployment)
                .uniq()
                .value();
            const allowedNodes = _.chain(agents)
                .map(agent => agent.node)
                .uniq()
                .value();
            const allowedNodeInstances = _.chain(agents)
                .map(agent => agent.id)
                .uniq()
                .value();
            this.setState({
                ...InstallAgentsModal.initialState(this.props),
                allowedDeployments,
                allowedNodes,
                allowedNodeInstances
            });
        }
    }

    onApprove() {
        this.submitExecute();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    onShowExecutionStatus() {
        const { onHide, toolbox, widget } = this.props;
        const { executionId, nodeFilter } = this.state;
        const { deploymentId } = nodeFilter;

        onHide();
        toolbox.drillDown(widget, 'execution', { deploymentId, executionId }, `Install New Agents on ${deploymentId}`);
    }

    submitExecute() {
        const { toolbox } = this.props;
        const { nodeFilter, installMethods, managerCertificate, managerIp, stopOldAgent } = this.state;
        if (!nodeFilter.deploymentId) {
            this.setState({ errors: { error: 'Provide deployment in Nodes filter' } });
            return false;
        }

        this.setState({ loading: true });
        const params = {
            node_ids: !_.isEmpty(nodeFilter.nodeId) ? nodeFilter.nodeId : undefined,
            node_instance_ids: !_.isEmpty(nodeFilter.nodeInstanceId) ? nodeFilter.nodeInstanceId : undefined,
            install_methods: !_.isEmpty(installMethods) ? installMethods : undefined,
            stop_old_agent: stopOldAgent,
            manager_ip: !_.isEmpty(managerIp) ? managerIp : undefined,
            manager_certificate: !_.isEmpty(managerCertificate) ? managerCertificate : undefined
        };

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doExecute({ id: nodeFilter.deploymentId }, { name: 'install_new_agents' }, params, false)
            .then(data => {
                this.setState({ loading: false, errors: {}, executionStarted: true, executionId: data.id });
            })
            .catch(err => {
                this.setState({ loading: false, errors: { error: err.message } });
            });
    }

    handleInputChange(event, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const {
            allowedDeployments,
            allowedNodeInstances,
            allowedNodes,
            errors,
            executionStarted,
            installMethods,
            loading,
            managerCertificate,
            managerIp,
            nodeFilter,
            stopOldAgent
        } = this.state;
        const { onHide, open, toolbox } = this.props;
        const { ApproveButton, Button, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;
        const { NodeFilter } = Stage.Common;

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="download" /> Install new agents
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={loading}
                        errors={errors}
                        success={executionStarted}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        {!executionStarted && (
                            <>
                                <Form.Field
                                    label="Nodes filter"
                                    required
                                    help="Filter agents by deployment, nodes and node instances. Filtering turned off when none selected."
                                >
                                    <NodeFilter
                                        name="nodeFilter"
                                        value={nodeFilter}
                                        showBlueprints={false}
                                        allowMultipleNodes
                                        allowMultipleNodeInstances
                                        allowedDeployments={allowedDeployments}
                                        allowedNodes={allowedNodes}
                                        allowedNodeInstances={allowedNodeInstances}
                                        onChange={this.handleInputChange.bind(this)}
                                        toolbox={toolbox}
                                    />
                                </Form.Field>

                                <Form.Field
                                    label="Install Methods filter"
                                    help="Filter agents by install methods. Filtering turned off when none selected."
                                >
                                    <Form.Dropdown
                                        name="installMethods"
                                        multiple
                                        selection
                                        options={Consts.installMethodsOptions}
                                        value={installMethods}
                                        onChange={this.handleInputChange.bind(this)}
                                    />
                                </Form.Field>

                                <Form.Field
                                    label="Manager IP"
                                    help="The private IP of the current leader (master) Manager.
                                          This IP is used to connect to the Manager's RabbitMQ.
                                          Relevant only in HA cluster."
                                >
                                    <Form.Input
                                        name="managerIp"
                                        value={managerIp}
                                        onChange={this.handleInputChange.bind(this)}
                                    />
                                </Form.Field>

                                <Form.Field
                                    label="Manager Certificate"
                                    help="A path to a file containing the SSL certificate
                                          of the current leader Manager. The certificate
                                          is available on the Manager:
                                          /etc/cloudify/ssl/cloudify_internal_ca_cert.pem"
                                >
                                    <Form.Input
                                        name="managerCertificate"
                                        value={managerCertificate}
                                        onChange={this.handleInputChange.bind(this)}
                                    />
                                </Form.Field>

                                <Form.Field
                                    help="If set, after installing the new agent the old agent
                                          (that is connected to the old Cloudify Manager) will be stopped.
                                          *IMPORTANT* if the deployment has monitoring with auto-healing configured,
                                          you need to disable it first"
                                >
                                    <Form.Checkbox
                                        label="Stop old agent"
                                        toggle
                                        name="stopOldAgent"
                                        checked={stopOldAgent}
                                        onChange={this.handleInputChange.bind(this)}
                                    />
                                </Form.Field>
                            </>
                        )}

                        <Message
                            success
                            header="Execution started"
                            content="New agents installation has been started. Click 'Show Status and Logs' button to see details."
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton
                        content={executionStarted ? 'Close' : undefined}
                        onClick={this.onCancel.bind(this)}
                        disabled={loading}
                    />
                    {!executionStarted && (
                        <ApproveButton
                            onClick={this.onApprove.bind(this)}
                            disabled={loading}
                            content="Install"
                            icon="download"
                            color="green"
                        />
                    )}
                    {executionStarted && (
                        <Button
                            content="Show Status and Logs"
                            icon="file text"
                            color="green"
                            onClick={this.onShowExecutionStatus.bind(this)}
                        />
                    )}
                </Modal.Actions>
            </Modal>
        );
    }
}
