/**
 * Created by jakub.niezgoda on 05/10/2018.
 */

import Consts from './consts';

export default class ValidateAgentsModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = ValidateAgentsModal.initialState(props);
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
            installMethods: _.isNil(props.installMethods) ? [] : _.castArray(props.installMethods)
        };
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
                ...ValidateAgentsModal.initialState(this.props),
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
        const {
            executionId,
            nodeFilter: { deploymentId }
        } = this.state;

        onHide();
        toolbox.drillDown(widget, 'execution', { deploymentId, executionId }, `Validate Agents on ${deploymentId}`);
    }

    submitExecute() {
        const { toolbox } = this.props;
        const { nodeFilter, installMethods } = this.state;
        if (!nodeFilter.deploymentId) {
            this.setState({ errors: { error: 'Provide deployment in Nodes filter' } });
            return false;
        }

        this.setState({ loading: true });
        const params = {
            node_ids: !_.isEmpty(nodeFilter.nodeId) ? nodeFilter.nodeId : undefined,
            node_instance_ids: !_.isEmpty(nodeFilter.nodeInstanceId) ? nodeFilter.nodeInstanceId : undefined,
            install_methods: !_.isEmpty(installMethods) ? installMethods : undefined
        };

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doExecute({ id: nodeFilter.deploymentId }, { name: 'validate_agents' }, params, false)
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
            nodeFilter
        } = this.state;
        const { onHide, open, toolbox } = this.props;
        const { ApproveButton, Button, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;
        const { NodeFilter } = Stage.Common;

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="checkmark" /> Validate agents
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
                            </>
                        )}

                        <Message
                            success
                            header="Execution started"
                            content="Agents validation has been started. Click 'Show Status and Logs' button to see details."
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
                            content="Validate"
                            icon="checkmark"
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
