import type { FunctionComponent } from 'react';
import { useEffect, useMemo } from 'react';
import { i18nPrefix } from '../common';
import { FilterRule } from '../../filters/types';
import { getGroupIdForBatchAction } from './common';
import ExecutionStartedModal from './ExecutionStartedModal';
import type { Workflow } from '../../executeWorkflow';

interface RunWorkflowModalProps {
    filterRules: FilterRule[];
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

type WorkflowsResponse = Stage.Types.PaginatedResponse<Workflow>;

const modalT = Stage.Utils.getT(`${i18nPrefix}.header.bulkActions.runWorkflow.modal`);

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
    const { ApproveButton, CancelButton, Dropdown, Icon, LoadingOverlay, Message, Modal, Form } = Stage.Basic;
    // @ts-expect-error DynamicDropdown is not converted to TS yet
    const { DynamicDropdown } = Stage.Common;
    const { useBoolean, useErrors, useResettableState } = Stage.Hooks;

    const [executionGroupStarted, setExecutionGroupStarted, unsetExecutionGroupStarted] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [workflowId, setWorkflowId, resetWorkflowId] = useResettableState('');
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
            .doListAllWorkflows(filterRules)
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
            await executionGroupsActions.doStart(groupId, workflowId);

            toolbox.getEventBus().trigger('deployments:refresh').trigger('executions:refresh');
            setExecutionGroupStarted();
        } catch (error) {
            setMessageAsError(error);
        }

        turnOffLoading();
    }

    return executionGroupStarted ? (
        <ExecutionStartedModal toolbox={toolbox} onClose={onHide} />
    ) : (
        <Modal open onClose={onHide}>
            <Modal.Header>
                <Icon name="cogs" /> {modalT('header')}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {loadingMessage && <LoadingOverlay message={loadingMessage} />}
                    <Form.Field label={modalT('inputs.workflowId.label')} help={modalT('inputs.workflowId.help')}>
                        <Dropdown
                            search
                            selection
                            options={workflowsOptions}
                            onChange={(_event, { value }) => setWorkflowId(value as string)}
                            value={workflowId}
                        />
                    </Form.Field>
                    <Message>{modalT('messages.limitations')}</Message>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} />
                <ApproveButton
                    onClick={runWorkflow}
                    color="green"
                    content={modalT('buttons.run')}
                    disabled={!workflowId}
                />
            </Modal.Actions>
        </Modal>
    );
};
export default RunWorkflowModal;
