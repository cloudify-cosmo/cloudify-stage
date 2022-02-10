// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';
import type { Workflow, InstallWorkflowOptions, WorkflowParameters, OnChange, OnCheckboxChange } from './types';
import ExecuteWorkflowInputs from './ExecuteWorkflowInputs';
import { executeWorkflow, isWorkflowName, getWorkflowName } from './common';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

interface ExecuteWorkflowModalProps {
    deploymentId?: string;
    deploymentName?: string;
    deployments?: string[];
    hideOptions?: boolean;
    onExecute?: (workflowParameters: WorkflowParameters, workflowOptions: InstallWorkflowOptions) => void;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
    workflow: Workflow | string | null;
    open: boolean;
}

const ExecuteWorkflowModal: FunctionComponent<ExecuteWorkflowModalProps> = ({
    deploymentId = '',
    deploymentName,
    deployments = [],
    hideOptions = false,
    onExecute = _.noop,
    onHide,
    toolbox,
    workflow,
    open
}) => {
    if (_.isString(workflow) && !(_.isString(deploymentId) && deploymentId)) {
        throw Error(
            `Invalid prop \`deploymentId\` supplied to \`ExecuteWorkflowModal\`. ` +
                `When \`workflow\` prop is specified as a string, \`deploymentId\` must be provided. ` +
                `Validation failed.`
        );
    }

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

    function setWorkflowParams(workflowResource: Workflow) {
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
                    const selectedWorkflow: Workflow = _.find(workflows, { name: workflowName });

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

    function onApprove() {
        clearErrors();
        executeWorkflow({
            deploymentsList,
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
            setErrors,
            unsetLoading,
            clearErrors,
            onExecute,
            onHide
        });
    }

    function handleYamlFileChange(file: File) {
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

    const clearErrorsAndQueue = () => {
        clearErrors();
        clearQueue();
    };

    const onForceChange: OnCheckboxChange = (event, field) => {
        clearErrorsAndQueue();
        setForce(field.checked);
    };
    const onDryRunChange: OnCheckboxChange = (event, field) => {
        clearErrorsAndQueue();
        setDryRun(field.checked);
    };
    const onQueueChange: OnCheckboxChange = (event, field) => {
        clearForce();
        clearDryRun();
        clearSchedule();
        clearScheduleTime();
        clearErrors();
        setQueue(field.checked);
    };
    const onScheduleChange: OnCheckboxChange = (event, field) => {
        clearErrorsAndQueue();
        setSchedule(field.checked);
    };
    const onScheduledTimeChange: OnChange = (event, field) => {
        clearErrorsAndQueue();
        setScheduledTime(field.value);
    };

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
                    <ExecuteWorkflowInputs
                        baseWorkflowInputs={baseWorkflowParams}
                        userWorkflowInputsState={userWorkflowParams}
                        onYamlFileChange={handleYamlFileChange}
                        onWorkflowInputChange={handleInputChange}
                        fileLoading={isFileLoading}
                        errors={errors}
                        showInstallOptions={!hideOptions}
                        force={force}
                        dryRun={dryRun}
                        queue={queue}
                        schedule={schedule}
                        scheduledTime={scheduledTime}
                        onForceChange={onForceChange}
                        onDryRunChange={onDryRunChange}
                        onQueueChange={onQueueChange}
                        onScheduleChange={onScheduleChange}
                        onScheduledTimeChange={onScheduledTimeChange}
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
};

declare global {
    namespace Stage.Common {
        export { ExecuteWorkflowModal };
    }
}

Stage.defineCommon({
    name: 'ExecuteWorkflowModal',
    common: ExecuteWorkflowModal
});

export default ExecuteWorkflowModal;
