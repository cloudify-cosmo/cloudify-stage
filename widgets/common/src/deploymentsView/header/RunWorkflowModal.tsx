import type { FunctionComponent } from 'react';
import { useEffect, useMemo } from 'react';
import { i18nPrefix } from '../common';

interface RunWorkflowModalProps {
    filterId: string | undefined;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

type Workflow = {
    name: string;
    parameters: Record<string, { description?: string; default?: any; type?: any }>;
    plugin: string;
};
type WorkflowsResponse = Stage.Types.PaginatedResponse<Workflow>;

const modalT = (key: string, params?: Record<string, string | undefined>) =>
    Stage.i18n.t(`${i18nPrefix}.header.bulkActions.runWorkflow.modal.${key}`, params);
const getWorkflowsOptions = (workflows: Workflow[]) => {
    return _.chain(workflows)
        .sortBy('name')
        .filter(workflow => !_.find(workflow.parameters, parameter => parameter.default === undefined))
        .map(workflow => ({
            text: _.capitalize(_.upperCase(workflow.name)),
            value: workflow.name
        }))
        .value();
};

const RunWorkflowModal: FunctionComponent<RunWorkflowModalProps> = ({ filterId, onHide, toolbox }) => {
    const {
        ApproveButton,
        CancelButton,
        Dropdown,
        Icon,
        LoadingOverlay,
        Message,
        Modal,
        UnsafelyTypedForm,
        UnsafelyTypedFormField
    } = Stage.Basic;
    // @ts-ignore Property 'DynamicDropdown' does not exist on type 'typeof Common'
    const { DynamicDropdown } = Stage.Common;
    const { useBoolean, useErrors, useResettableState } = Stage.Hooks;

    const [executionGroupStarted, setExecutionGroupStarted, unsetExecutionGroupStarted] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [workflowId, setWorkflowId, resetWorkflowId] = useResettableState<string>('');
    const [workflows, setWorkflows, resetWorkflows] = useResettableState<Workflow[]>([]);
    const [loadingMessage, setLoadingMessage, resetLoadingMessage] = useResettableState('');
    const workflowsOptions = useMemo(() => getWorkflowsOptions(workflows), [workflows]);

    useEffect(() => {
        clearErrors();
        resetWorkflowId();
        resetWorkflows();
        unsetExecutionGroupStarted();
        setLoadingMessage(modalT('messages.fetchingWorkflows'));

        toolbox
            .getManager()
            .doGet('/workflows', {
                _filter_id: filterId
            })
            .then((data: WorkflowsResponse) => setWorkflows(data.items))
            .catch(setMessageAsError)
            .finally(resetLoadingMessage);
    }, [filterId]);

    function runWorkflow() {
        if (!workflowId) {
            setErrors({ error: modalT('errors.noWorkflowError') });
            return;
        }

        setLoadingMessage(modalT('messages.creatingDeploymentGroup'));
        const deploymentGroupsActions = new Stage.Common.DeploymentGroupsActions(toolbox);
        const groupId = `BATCH_ACTION_${new Date().toISOString()}`;

        deploymentGroupsActions.doCreate(groupId, filterId!).then(_deploymentGroup => {
            setLoadingMessage(modalT('messages.startingExecutionGroup'));
            const executionGroupsActions = new Stage.Common.ExecutionGroupsActions(toolbox);

            return executionGroupsActions.doStart(workflowId!, groupId).then(_executionGroup => {
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
                resetLoadingMessage();
                setExecutionGroupStarted();
            });
        });
    }

    function goToExecutionsPage() {
        toolbox.goToPage('executions', {});
    }

    return (
        <Modal open onClose={onHide}>
            <Modal.Header>
                <Icon name="cogs" /> {modalT('header', { filterId })}
            </Modal.Header>

            <Modal.Content>
                <UnsafelyTypedForm errors={errors} onErrorsDismiss={clearErrors}>
                    {loadingMessage && <LoadingOverlay message={loadingMessage} />}
                    {executionGroupStarted ? (
                        <Message positive>{modalT('messages.executionGroupStarted')}</Message>
                    ) : (
                        <>
                            <UnsafelyTypedFormField
                                label={modalT('inputs.workflowId.label')}
                                help={modalT('inputs.workflowId.help')}
                            >
                                <Dropdown
                                    selection
                                    options={workflowsOptions}
                                    onChange={(_event, { value }) => setWorkflowId(value as string)}
                                    value={workflowId}
                                />
                            </UnsafelyTypedFormField>
                            <Message>{modalT('messages.limitations')}</Message>
                        </>
                    )}
                </UnsafelyTypedForm>
            </Modal.Content>

            <Modal.Actions>
                {executionGroupStarted ? (
                    <>
                        <CancelButton onClick={onHide} content={modalT('buttons.close')} />
                        <ApproveButton
                            onClick={goToExecutionsPage}
                            color="green"
                            content={modalT('buttons.goToExecutionsPage')}
                        />
                    </>
                ) : (
                    <>
                        <CancelButton onClick={onHide} />
                        <ApproveButton
                            onClick={runWorkflow}
                            color="green"
                            content={modalT('buttons.run')}
                            disabled={!workflowId}
                        />
                    </>
                )}
            </Modal.Actions>
        </Modal>
    );
};
export default RunWorkflowModal;
