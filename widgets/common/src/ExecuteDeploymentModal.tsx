// @ts-nocheck File not migrated fully to TS
function isWorkflowName(workflow) {
    return typeof workflow === 'string';
}

function getWorkflowName(workflow) {
    return isWorkflowName(workflow) ? workflow : workflow.name;
}

const t = Stage.Utils.getT('widgets.common.deployments.executeModal');

function renderActionCheckbox(name, checked, onChange) {
    const { Checkbox } = Stage.Basic.Form;
    return (
        <Checkbox
            name={name}
            toggle
            label={t(`actions.${name}.label`)}
            help={t(`actions.${name}.help`)}
            checked={checked}
            onChange={onChange}
        />
    );
}

function renderActionField(name, checked, onChange) {
    const { Field } = Stage.Basic.Form;
    return <Field>{renderActionCheckbox(name, checked, onChange)}</Field>;
}

export default function ExecuteDeploymentModal({
    deploymentId,
    deploymentName,
    deployments,
    hideOptions,
    onExecute,
    onHide,
    toolbox,
    workflow,
    open
}) {
    const {
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
                .doGetWorkflows(deploymentId)
                .then(({ workflows }) => {
                    const selectedWorkflow = _.find(workflows, { name: workflowName });

                    if (selectedWorkflow) {
                        setWorkflowParams(selectedWorkflow);
                    } else {
                        setErrors(
                            t('errors.workflowError', {
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

    const deploymentsList: string[] = _.isEmpty(deployments) ? _.compact([deploymentId]) : deployments;

    function submitExecute() {
        const { InputsUtils, DeploymentActions } = Stage.Common;
        const validationErrors = {};

        const name = getWorkflowName(workflow);
        if (!name) {
            setErrors(t('errors.missingWorkflow'));
            return false;
        }

        const inputsWithoutValue = InputsUtils.getInputsWithoutValues(baseWorkflowParams, userWorkflowParams);
        InputsUtils.addErrors(inputsWithoutValue, validationErrors);

        if (schedule) {
            const scheduledTimeMoment = moment(scheduledTime);
            if (
                !scheduledTimeMoment.isValid() ||
                !_.isEqual(scheduledTimeMoment.format('YYYY-MM-DD HH:mm'), scheduledTime) ||
                scheduledTimeMoment.isBefore(moment())
            ) {
                validationErrors.scheduledTime = t('errors.scheduleTimeError');
            }
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return false;
        }

        const workflowParameters = InputsUtils.getInputsMap(baseWorkflowParams, userWorkflowParams);

        if (_.isFunction(onExecute) && onExecute !== _.noop) {
            onExecute(workflowParameters, {
                force,
                dryRun,
                queue,
                scheduledTime: schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined
            });
            onHide();
            return true;
        }

        if (_.isEmpty(deploymentsList)) {
            setErrors(t('errors.missingDeployment'));
            return false;
        }

        setLoading();
        const actions = new DeploymentActions(toolbox);

        const executePromises = _.map(deploymentsList, id => {
            return actions
                .doExecute(id, name, workflowParameters, {
                    force,
                    dryRun,
                    queue,
                    scheduledTime: schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined
                })
                .then(() => {
                    // State updates should be done before calling `onHide` to avoid React errors:
                    // "Warning: Can't perform a React state update on an unmounted component"
                    unsetLoading();
                    clearErrors();
                    onHide();
                    toolbox.getEventBus().trigger('executions:refresh');
                    // NOTE: pass id to keep the current deployment selected
                    toolbox.getEventBus().trigger('deployments:refresh', id);
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
                setErrors({ yamlFile: t('errors.yamlFileError', { message: _.isString(err) ? err : err.message }) })
            )
            .finally(unsetFileLoading);
    }

    function handleInputChange(event, field) {
        setUserWorkflowParams({ ...userWorkflowParams, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    const { ApproveButton, CancelButton, DateInput, Divider, Form, Header, Icon, Modal, Message } = Stage.Basic;
    const { InputsHeader, InputsUtils, YamlFileButton } = Stage.Common;

    let headerKey = 'header.';
    if (!_.isEmpty(deploymentsList)) {
        if (_.size(deploymentsList) > 1) {
            headerKey += 'multipleDeployments';
        } else if (deploymentName) {
            headerKey += 'singleNamedDeployemnt';
        } else {
            headerKey += 'singleDeployemnt';
        }
    } else {
        headerKey += 'noDeployment';
    }

    return (
        <Modal open={open} onClose={onHide} className="executeWorkflowModal">
            <Modal.Header>
                <Icon name="cogs" />{' '}
                {t(headerKey, {
                    workflowName,
                    deploymentName: Stage.Utils.formatDisplayName({
                        id: _.head(deploymentsList),
                        displayName: deploymentName
                    })
                })}
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

                    <InputsHeader header={t('paramsHeader')} compact />

                    {_.isEmpty(baseWorkflowParams) && <Message content={t('noParams')} />}

                    {InputsUtils.getInputFields(baseWorkflowParams, handleInputChange, userWorkflowParams, errors)}

                    {!hideOptions && (
                        <>
                            <Form.Divider>
                                <Header size="tiny">{t('actionsHeader')}</Header>
                            </Form.Divider>

                            {renderActionField('force', force, (event, field) => setForce(field.checked))}
                            {renderActionField('dryRun', dryRun, (event, field) => setDryRun(field.checked))}
                            {renderActionField('queue', queue, (event, field) => {
                                setQueue(field.checked);
                                clearForce();
                                clearDryRun();
                                clearSchedule();
                                clearScheduleTime();
                                clearErrors();
                            })}

                            <Form.Field error={!!errors.scheduledTime}>
                                {renderActionCheckbox('schedule', schedule, (event, field) =>
                                    setSchedule(field.checked)
                                )}
                                {schedule && (
                                    <>
                                        <Divider hidden />
                                        <DateInput
                                            name="scheduledTime"
                                            value={scheduledTime}
                                            defaultValue=""
                                            minDate={moment()}
                                            maxDate={moment().add(1, 'Y')}
                                            onChange={(event, field) => setScheduledTime(field.value)}
                                        />
                                    </>
                                )}
                            </Form.Field>
                        </>
                    )}
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton
                    onClick={onApprove}
                    disabled={isLoading}
                    content={t('execute')}
                    icon="cogs"
                    color="green"
                />
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
    deploymentName: PropTypes.string,
    deployments: PropTypes.arrayOf(PropTypes.string),
    workflow: PropTypes.oneOfType([
        PropTypes.shape({ name: PropTypes.string, parameters: PropTypes.shape({}) }),
        PropTypes.string,
        PropTypes.oneOf([null])
    ]).isRequired,
    onExecute: PropTypes.func,
    onHide: PropTypes.func.isRequired,
    hideOptions: PropTypes.bool
};
ExecuteDeploymentModal.defaultProps = {
    deploymentId: '',
    deployments: [],
    hideOptions: false,
    onExecute: _.noop
};

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { ExecuteDeploymentModal };
    }
}

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});
