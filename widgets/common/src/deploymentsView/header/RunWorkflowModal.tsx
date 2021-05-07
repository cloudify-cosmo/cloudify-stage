import type { FunctionComponent } from 'react';
import { useEffect, useMemo } from 'react';
import { i18nPrefix } from '../common';
import { FilterRule } from '../../filters/types';
import GoToExecutionsPageButton from './GoToExecutionsPageButton';
import { getGroupIdForBatchAction } from './common';

interface RunWorkflowModalProps {
    filterRules: FilterRule[];
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

const RunWorkflowModal: FunctionComponent<RunWorkflowModalProps> = ({ filterRules, onHide, toolbox }) => {
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
    const [loadingMessage, setLoadingMessage, turnOffLoading] = useResettableState('');
    const workflowsOptions = useMemo(() => getWorkflowsOptions(workflows), [workflows]);

    const searchActions = new Stage.Common.SearchActions(toolbox);

    useEffect(() => {
        clearErrors();
        resetWorkflowId();
        resetWorkflows();
        unsetExecutionGroupStarted();
        setLoadingMessage(modalT('messages.fetchingWorkflows'));

        searchActions
            .doListWorkflows(filterRules)
            .then((data: WorkflowsResponse) => setWorkflows(data.items))
            .catch(setMessageAsError)
            .finally(turnOffLoading);
    }, []);

    async function runWorkflow() {
        if (!workflowId) {
            setErrors({ error: modalT('errors.noWorkflowError') });
            return;
        }

        try {
            setLoadingMessage(modalT('messages.creatingDeploymentGroup'));
            const groupId = getGroupIdForBatchAction();
            const deploymentGroupsActions = new Stage.Common.DeploymentGroupsActions(toolbox);
            await deploymentGroupsActions.doCreate(groupId, { filter_rules: filterRules });

            setLoadingMessage(modalT('messages.startingExecutionGroup'));
            const executionGroupsActions = new Stage.Common.ExecutionGroupsActions(toolbox);
            await executionGroupsActions.doStart(workflowId, groupId);

            toolbox.getEventBus().trigger('deployments:refresh');
            toolbox.getEventBus().trigger('executions:refresh');
            setExecutionGroupStarted();
        } catch (error) {
            setMessageAsError(error);
        }

        turnOffLoading();
    }

    return (
        <Modal open onClose={onHide}>
            <Modal.Header>
                <Icon name="cogs" /> {modalT('header')}
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
                        <GoToExecutionsPageButton toolbox={toolbox} />
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
