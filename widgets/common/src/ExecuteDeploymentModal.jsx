function isWorkflowName(workflow) {
    return _.isString(workflow);
}

function getWorkflowName(workflow) {
    return isWorkflowName(workflow) ? workflow : workflow.name;
}

export default function ExecuteDeploymentModal({
    deploymentId,
    deployments,
    onExecute,
    onHide,
    toolbox,
    workflow,
    open
}) {
    const {
        i18n,
        Hooks: { useErrors, useBoolean, useOpenProp, useInput, useResettableState }
    } = Stage;
    const { useEffect } = React;

    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [dryRun, setDryRun, clearDryRun] = useInput(false);
    const [isFileLoading, setFileLoading, unsetFileLoading] = useBoolean();
    const [force, setForce, clearForce] = useInput(false);
    const [queue, setQueue, clearQueue] = useInput(false);
    const [schedule, setSchedule, clearSchedule] = useInput(false);
    const [scheduledTime, setScheduledTime, clearScheduleTime] = useInput('');
    const [baseWorkflowParams, setBaseWorkflowParams, resetBaseWorkflowParams] = useResettableState({});
    const [userWorkflowParams, setUserWorkflowParams, resetUserWorkflowParams] = useResettableState({});

    const workflowName = getWorkflowName(workflow);

    function setWorkflowParams(workflowResource) {
        const { InputsUtils } = Stage.Common;
        setBaseWorkflowParams(workflowResource.parameters);
        setUserWorkflowParams(
            _.mapValues(workflowResource.parameters, parameterData =>
                InputsUtils.getInputFieldInitialValue(parameterData.default, parameterData.type)
            )
        );
    }

    useOpenProp(open, () => {
        const { DeploymentActions } = Stage.Common;

        clearErrors();
        unsetLoading();
        clearDryRun();
        unsetFileLoading();
        clearForce();
        clearQueue();
        clearSchedule();
        clearScheduleTime();
        resetUserWorkflowParams();
        resetBaseWorkflowParams();

        const actions = new DeploymentActions(toolbox);
        if (isWorkflowName(workflow)) {
            setLoading();
            actions
                // FIXME: Once RD-1353 is implemented, { _include: ['worflows'] } should be passed as params to doGet
                .doGet({ id: deploymentId })
                .then(({ workflows }) => {
                    const selectedWorkflow = _.find(workflows, { name: workflowName });

                    if (selectedWorkflow) {
                        setWorkflowParams(selectedWorkflow);
                    } else {
                        setErrors(
                            i18n.t('widgets.common.deployments.executeModal.workflowError', {
                                deploymentId,
                                workflowName
                            })
                        );
                    }
                })
                .catch(setMessageAsError)
                .finally(unsetLoading);
        } else {
            setWorkflowParams(workflow);
        }
    });

    useEffect(() => {
        clearQueue();
        clearErrors();
    }, [dryRun, force, schedule, scheduledTime]);

    function submitExecute() {
        const { InputsUtils, DeploymentActions } = Stage.Common;
        const validationErrors = {};

        const name = getWorkflowName(workflow);
        if (!name) {
            setErrors(i18n.t('widgets.common.deployments.executeModal.missingWorkflow'));
            return false;
        }

        const inputsWithoutValue = {};
        const workflowParameters = InputsUtils.getInputsToSend(
            baseWorkflowParams,
            userWorkflowParams,
            inputsWithoutValue
        );
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

        let deploymentsList = deployments;
        if (_.isEmpty(deployments)) {
            deploymentsList = _.compact([deploymentId]);
        }

        if (_.isEmpty(deploymentsList)) {
            setErrors(i18n.t('widgets.common.deployments.executeModal.missingDeployment'));
            return false;
        }

        setLoading();
        const actions = new DeploymentActions(toolbox);

        const executePromises = _.map(deploymentsList, id => {
            const scheduled = schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined;
            return actions.doExecute({ id }, { name }, workflowParameters, force, dryRun, queue, scheduled).then(() => {
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
                setUserWorkflowParams(InputsUtils.getUpdatedInputs(baseWorkflowParams, userWorkflowParams, yamlInputs));
            })
            .catch(err =>
                setErrors({ yamlFile: `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}` })
            )
            .finally(unsetFileLoading);
    }

    function handleInputChange(event, field) {
        setUserWorkflowParams({ ...userWorkflowParams, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    const { ApproveButton, CancelButton, DateInput, Divider, Form, Header, Icon, Modal, Message } = Stage.Basic;
    const { InputsHeader, InputsUtils, YamlFileButton } = Stage.Common;

    let deploymentName;
    if (!_.isEmpty(deployments)) {
        if (_.size(deployments) > 1) {
            deploymentName = 'multiple deployments';
        } else {
            [deploymentName] = deployments;
        }
    } else {
        deploymentName = deploymentId;
    }

    return (
        <Modal open={open} onClose={() => onHide()} className="executeWorkflowModal">
            <Modal.Header>
                <Icon name="cogs" /> Execute workflow {workflowName}
                {deploymentName && ` on ${deploymentName}`}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    {!_.isEmpty(baseWorkflowParams) && (
                        <YamlFileButton
                            onChange={handleYamlFileChange}
                            dataType="execution parameters"
                            fileLoading={isFileLoading}
                        />
                    )}

                    <InputsHeader header="Parameters" compact />

                    {_.isEmpty(baseWorkflowParams) && <Message content="No parameters available for the execution" />}

                    {InputsUtils.getInputFields(baseWorkflowParams, handleInputChange, userWorkflowParams, errors)}

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
    deploymentId: (props, propName, componentName) => {
        const { [propName]: deploymentId, workflow } = props;

        if (_.isString(workflow) && !(_.isString(deploymentId) && deploymentId)) {
            return new Error(
                `Invalid prop \`deploymentId\` supplied to \`${componentName}\`. ` +
                    `When \`workflow\` prop is specified as a string, \`deploymentId\` must be provided. ` +
                    `Validation failed.`
            );
        }
        return null;
    },
    deployments: PropTypes.arrayOf(PropTypes.string),
    workflow: PropTypes.oneOfType([
        PropTypes.shape({ name: PropTypes.string, parameters: PropTypes.shape({}) }),
        PropTypes.string
    ]).isRequired,
    onExecute: PropTypes.func,
    onHide: PropTypes.func.isRequired
};
ExecuteDeploymentModal.defaultProps = {
    deploymentId: '',
    deployments: [],
    onExecute: _.noop
};

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});
