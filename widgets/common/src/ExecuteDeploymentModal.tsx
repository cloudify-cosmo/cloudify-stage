// @ts-nocheck File not migrated fully to TS
import { createInstallFunction, isWorkflowName, getWorkflowName } from './deployModal/execution';
import GenericInstall from './deployModal/GenericInstall';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

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

    const submitExecute = createInstallFunction({
        setLoading,
        toolbox,
        workflow,
        baseWorkflowParams,
        userWorkflowParams,
        schedule,
        scheduledTime,
        force,
        dryRun,
        queue,
        deploymentId,
        setErrors,
        unsetLoading,
        clearErrors,
        onExecute,
        onHide
    });

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

    const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;

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

    function createChangeEvent(fieldName: string) {
        return (event, field) => {
            switch (fieldName) {
                case 'force':
                    setForce(field.checked);
                    break;
                case 'dryRun':
                    setDryRun(field.checked);
                    break;
                case 'queue':
                    clearForce();
                    clearDryRun();
                    clearSchedule();
                    clearScheduleTime();
                    clearErrors();
                    setQueue(field.checked);
                    break;
                case 'schedule':
                    setSchedule(field.checked);
                    break;
                case 'scheduledTime':
                    setScheduledTime(field.value);
                    break;
                default:
                    break;
            }
        };
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
                    <GenericInstall
                        baseWorkflowParams={baseWorkflowParams}
                        userWorkflowParams={userWorkflowParams}
                        handleYamlFileChange={handleYamlFileChange}
                        handleExecuteInputChange={handleInputChange}
                        fileLoading={isFileLoading}
                        errors={errors}
                        showInstallOptions={!hideOptions}
                        force={force}
                        dryRun={dryRun}
                        queue={queue}
                        schedule={schedule}
                        scheduledTime={scheduledTime}
                        createChangeEvent={createChangeEvent}
                    />
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
        PropTypes.string
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

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});
