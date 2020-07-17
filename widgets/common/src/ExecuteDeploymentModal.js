/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class ExecuteDeploymentModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = ExecuteDeploymentModal.initialState;
    }

    static initialState = {
        errors: {},
        loading: false,
        dryRun: false,
        fileLoading: false,
        force: false,
        queue: false,
        schedule: false,
        scheduledTime: '',
        params: {}
    };

    static propTypes = {
        toolbox: Stage.Common.PropTypes.Toolbox.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.shape({ id: PropTypes.string }),
        deployments: PropTypes.arrayOf(PropTypes.string),
        workflow: PropTypes.shape({ parameters: PropTypes.shape({}) }).isRequired,
        onExecute: PropTypes.func,
        onHide: PropTypes.func.isRequired
    };

    static defaultProps = {
        deployment: {},
        deployments: [],
        onExecute: _.noop
    };

    componentDidUpdate(prevProps) {
        const { open, workflow } = this.props;
        if (!prevProps.open && open) {
            const { InputsUtils } = Stage.Common;
            const params = _.mapValues(_.get(workflow, 'parameters', {}), parameterData =>
                InputsUtils.getInputFieldInitialValue(parameterData.default, parameterData.type)
            );
            this.setState({ ...ExecuteDeploymentModal.initialState, params });
        }
    }

    onApprove() {
        this.setState({ errors: {} }, this.submitExecute);
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    submitExecute() {
        const { deployment, deployments, onExecute, onHide, toolbox, workflow } = this.props;
        const { dryRun, force, params, queue, schedule, scheduledTime } = this.state;
        const { InputsUtils, DeploymentActions } = Stage.Common;
        const errors = {};

        if (!deployment || !workflow) {
            this.setState({ errors: { error: 'Missing workflow or deployment' } });
            return false;
        }

        const inputsWithoutValue = {};
        const workflowParameters = InputsUtils.getInputsToSend(workflow.parameters, params, inputsWithoutValue);
        InputsUtils.addErrors(inputsWithoutValue, errors);

        if (schedule) {
            const scheduledTimeMoment = moment(scheduledTime);
            if (
                !scheduledTimeMoment.isValid() ||
                !_.isEqual(scheduledTimeMoment.format('YYYY-MM-DD HH:mm'), scheduledTime) ||
                scheduledTimeMoment.isBefore(moment())
            ) {
                errors.scheduledTime =
                    'Please provide valid scheduled time (in the future, using format: YYYY-MM-DD HH:mm)';
            }
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        if (_.isFunction(onExecute) && onExecute !== _.noop) {
            const scheduled = schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined;
            onExecute(workflowParameters, force, dryRun, queue, scheduled);
            onHide();
            return true;
        }

        this.setState({ loading: true });
        const actions = new DeploymentActions(toolbox);

        let deploymentsList = deployments;
        if (_.isEmpty(deployments)) {
            deploymentsList = [deployment.id];
        }

        const executePromises = _.map(deploymentsList, deploymentId => {
            const scheduled = schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined;
            return actions
                .doExecute({ id: deploymentId }, workflow, workflowParameters, force, dryRun, queue, scheduled)
                .then(() => {
                    this.setState({ loading: false, errors: {} });
                    onHide();
                    toolbox.getEventBus().trigger('executions:refresh');
                    toolbox.getEventBus().trigger('deployments:refresh');
                });
        });

        return Promise.all(executePromises).catch(err => {
            this.setState({ loading: false, errors: { error: err.message } });
        });
    }

    handleYamlFileChange(file) {
        const { toolbox, workflow } = this.props;
        if (!file) {
            return;
        }

        const { FileActions, InputsUtils } = Stage.Common;
        const actions = new FileActions(toolbox);
        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                const { params: stateParams } = this.state;
                const params = InputsUtils.getUpdatedInputs(workflow.parameters, stateParams, yamlInputs);
                this.setState({ errors: {}, params, fileLoading: false });
            })
            .catch(err => {
                const errorMessage = `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}`;
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    handleInputChange(event, field) {
        const { params } = this.state;
        this.setState({ params: { ...params, ...Stage.Basic.Form.fieldNameValue(field) } });
    }

    render() {
        const { dryRun, errors, fileLoading, force, loading, params, queue, schedule, scheduledTime } = this.state;
        const { deployment, deployments, onHide, open, workflow } = this.props;
        const { ApproveButton, CancelButton, DateInput, Divider, Form, Header, Icon, Modal, Message } = Stage.Basic;
        const { InputsHeader, InputsUtils, YamlFileButton } = Stage.Common;

        const enhancedWorkflow = { name: '', parameters: [], ...workflow };
        const enhancedDeployment = { id: '', ...deployment };
        const deploymentName = !_.isEmpty(deployments)
            ? _.size(deployments) > 1
                ? 'multiple deployments'
                : deployments[0]
            : enhancedDeployment.id;

        return (
            <Modal open={open} onClose={() => onHide()} className="executeWorkflowModal">
                <Modal.Header>
                    <Icon name="cogs" /> Execute workflow {enhancedWorkflow.name}
                    {deploymentName && ` on ${deploymentName}`}
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={loading}
                        errors={errors}
                        scrollToError
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        {!_.isEmpty(enhancedWorkflow.parameters) && (
                            <YamlFileButton
                                onChange={this.handleYamlFileChange.bind(this)}
                                dataType="execution parameters"
                                fileLoading={fileLoading}
                            />
                        )}

                        <InputsHeader header="Parameters" compact />

                        {_.isEmpty(enhancedWorkflow.parameters) && (
                            <Message content="No parameters available for the execution" />
                        )}

                        {InputsUtils.getInputFields(
                            enhancedWorkflow.parameters,
                            this.handleInputChange.bind(this),
                            params,
                            errors
                        )}

                        <Form.Divider>
                            <Header size="tiny">Actions</Header>
                        </Form.Divider>

                        <Form.Field>
                            <Form.Checkbox
                                name="force"
                                toggle
                                label="Force"
                                help='Execute the workflow even if there is an ongoing
                                                 execution for the given deployment.
                                                 You cannot use this option with "Queue".'
                                checked={force}
                                onChange={(event, field) =>
                                    this.setState({ force: field.checked, queue: false, errors: {} })
                                }
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox
                                name="dryRun"
                                toggle
                                label="Dry run"
                                help='If set, no actual operations will be performed.
                                                 Executed tasks will be logged without side effects.
                                                 You cannot use this option with "Queue".'
                                checked={dryRun}
                                onChange={(event, field) =>
                                    this.setState({ dryRun: field.checked, queue: false, errors: {} })
                                }
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox
                                name="queue"
                                toggle
                                label="Queue"
                                help='If set, executions that can`t currently run will
                                                 be queued and run automatically when possible.
                                                 You cannot use this option with "Force" and "Dry run".'
                                checked={queue}
                                onChange={(event, field) =>
                                    this.setState({
                                        queue: field.checked,
                                        force: false,
                                        dryRun: false,
                                        schedule: false,
                                        scheduledTime: '',
                                        errors: {}
                                    })
                                }
                            />
                        </Form.Field>

                        <Form.Field error={!!errors.scheduledTime}>
                            <Form.Checkbox
                                name="schedule"
                                toggle
                                label="Schedule"
                                help='If set, workflow will be executed at specific time (local timezone)
                                                 provided below. You cannot use this option with "Queue".'
                                checked={schedule}
                                onChange={(event, field) =>
                                    this.setState({ schedule: field.checked, queue: false, errors: {} })
                                }
                            />
                            {schedule && <Divider hidden />}
                            {schedule && (
                                <DateInput
                                    name="scheduledTime"
                                    value={scheduledTime}
                                    defaultValue=""
                                    minDate={moment()}
                                    maxDate={moment().add(1, 'Y')}
                                    onChange={(event, field) =>
                                        this.setState({ scheduledTime: field.value, queue: false, errors: {} })
                                    }
                                />
                            )}
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Execute"
                        icon="cogs"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});
