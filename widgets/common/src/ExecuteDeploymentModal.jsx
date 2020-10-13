/**
 * Created by kinneretzin on 19/10/2016.
 */

export default function ExecuteDeploymentModal({
    deployment,
    deployments,
    onExecute,
    onHide,
    toolbox,
    workflow,
    open
}) {
    const { useErrors, useBoolean, useOpenProp, useInput } = Stage.Hooks;
    const { useState, useEffect } = React;

    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [dryRun, setDryRun, clearDryRun] = useInput(false);
    const [isFileLoading, setFileLoading, unsetFileLoading] = useBoolean();
    const [force, setForce, clearForce] = useInput(false);
    const [queue, setQueue, clearQueue] = useInput(false);
    const [schedule, setSchedule, clearSchedule] = useInput(false);
    const [scheduledTime, setScheduledTime, clearScheduleTime] = useInput('');
    const [params, setParams] = useState({});

    useOpenProp(open, () => {
        const { InputsUtils } = Stage.Common;

        clearErrors();
        unsetLoading();
        clearDryRun();
        unsetFileLoading();
        clearForce();
        clearQueue();
        clearSchedule();
        clearScheduleTime();
        setParams(
            _.mapValues(_.get(workflow, 'parameters', {}), parameterData =>
                InputsUtils.getInputFieldInitialValue(parameterData.default, parameterData.type)
            )
        );
    });

    useEffect(() => {
        clearQueue();
        clearErrors();
    }, [dryRun, force, schedule, scheduledTime]);

    function submitExecute() {
        const { InputsUtils, DeploymentActions } = Stage.Common;
        const validationErrors = {};

        if (!deployment || !workflow) {
            setErrors({ error: 'Missing workflow or deployment' });
            return false;
        }

        const inputsWithoutValue = {};
        const workflowParameters = InputsUtils.getInputsToSend(workflow.parameters, params, inputsWithoutValue);
        InputsUtils.addErrors(inputsWithoutValue, validationErrors);

        if (schedule) {
            const scheduledTimeMoment = moment(scheduledTime);
            if (
                !scheduledTimeMoment.isValid() ||
                !_.isEqual(scheduledTimeMoment.format('YYYY-MM-DD HH:mm'), scheduledTime) ||
                scheduledTimeMoment.isBefore(moment())
            ) {
                validationErrors.scheduledTime =
                    'Please provide valid scheduled time (in the future, using format: YYYY-MM-DD HH:mm)';
            }
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return false;
        }

        if (_.isFunction(onExecute) && onExecute !== _.noop) {
            const scheduled = schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined;
            onExecute(workflowParameters, force, dryRun, queue, scheduled);
            onHide();
            return true;
        }

        setLoading();
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
                    unsetLoading();
                    clearErrors();
                    onHide();
                    toolbox.getEventBus().trigger('executions:refresh');
                    toolbox.getEventBus().trigger('deployments:refresh');
                });
        });

        return Promise.all(executePromises).catch(err => {
            unsetLoading();
            setMessageAsError(err);
        });
    }

    function onApprove() {
        clearErrors();
        submitExecute();
    }

    function handleYamlFileChange(file) {
        if (!file) {
            return;
        }

        const { FileActions, InputsUtils } = Stage.Common;
        const actions = new FileActions(toolbox);
        setFileLoading();

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                clearErrors();
                setParams(InputsUtils.getUpdatedInputs(workflow.parameters, params, yamlInputs));
            })
            .catch(err =>
                setErrors({ yamlFile: `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}` })
            )
            .finally(unsetFileLoading);
    }

    function handleInputChange(event, field) {
        setParams({ ...params, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    const { ApproveButton, CancelButton, DateInput, Divider, Form, Header, Icon, Modal, Message } = Stage.Basic;
    const { InputsHeader, InputsUtils, YamlFileButton } = Stage.Common;

    const enhancedWorkflow = { name: '', parameters: [], ...workflow };
    const enhancedDeployment = { id: '', ...deployment };
    let deploymentName;
    if (!_.isEmpty(deployments)) {
        if (_.size(deployments) > 1) {
            deploymentName = 'multiple deployments';
        } else {
            [deploymentName] = deployments;
        }
    } else {
        deploymentName = enhancedDeployment.id;
    }

    return (
        <Modal open={open} onClose={() => onHide()} className="executeWorkflowModal">
            <Modal.Header>
                <Icon name="cogs" /> Execute workflow {enhancedWorkflow.name}
                {deploymentName && ` on ${deploymentName}`}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    {!_.isEmpty(enhancedWorkflow.parameters) && (
                        <YamlFileButton
                            onChange={handleYamlFileChange}
                            dataType="execution parameters"
                            fileLoading={isFileLoading}
                        />
                    )}

                    <InputsHeader header="Parameters" compact />

                    {_.isEmpty(enhancedWorkflow.parameters) && (
                        <Message content="No parameters available for the execution" />
                    )}

                    {InputsUtils.getInputFields(enhancedWorkflow.parameters, handleInputChange, params, errors)}

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
                            onChange={(event, field) => setForce(field.checked)}
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
                            onChange={(event, field) => setDryRun(field.checked)}
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
                            onChange={(event, field) => {
                                setQueue(field.checked);
                                clearForce();
                                clearDryRun();
                                clearSchedule();
                                clearScheduleTime();
                                clearErrors();
                            }}
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
                            onChange={(event, field) => setSchedule(field.checked)}
                        />
                        {schedule && <Divider hidden />}
                        {schedule && (
                            <DateInput
                                name="scheduledTime"
                                value={scheduledTime}
                                defaultValue=""
                                minDate={moment()}
                                maxDate={moment().add(1, 'Y')}
                                onChange={(event, field) => setScheduledTime(field.value)}
                            />
                        )}
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={onApprove} disabled={isLoading} content="Execute" icon="cogs" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

ExecuteDeploymentModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    open: PropTypes.bool.isRequired,
    deployment: PropTypes.shape({ id: PropTypes.string }),
    deployments: PropTypes.arrayOf(PropTypes.string),
    workflow: PropTypes.shape({ parameters: PropTypes.shape({}) }).isRequired,
    onExecute: PropTypes.func,
    onHide: PropTypes.func.isRequired
};

ExecuteDeploymentModal.defaultProps = {
    deployment: {},
    deployments: [],
    onExecute: _.noop
};

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});
