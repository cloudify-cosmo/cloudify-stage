import type { FunctionComponent } from 'react';
import React, { useEffect, useMemo } from 'react';
import { useBoolean, useErrors, useResettableState } from '../../../../utils/hooks';
import {
    ApproveButton,
    CancelButton,
    Dropdown,
    Form,
    Icon,
    LoadingOverlay,
    Message,
    Modal
} from '../../../../components/basic';
import SearchActions from '../../actions/SearchActions';
import DeploymentGroupsActions from '../../deployments/DeploymentGroupsActions';
import { i18nPrefix } from '../common';
import type { FilterRule } from '../../filters/types';
import { getGroupIdForBatchAction } from './common';
import ExecutionGroupsActions from './ExecutionGroupsActions';
import ExecutionStartedModal from './ExecutionStartedModal';
import type { Workflow } from '../../executeWorkflow';
import StageUtils from '../../../../utils/stageUtils';

interface RunWorkflowModalProps {
    filterRules: FilterRule[];
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

const tModal = StageUtils.getT(`${i18nPrefix}.header.bulkActions.runWorkflow.modal`);

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
    const [executionGroupStarted, setExecutionGroupStarted, unsetExecutionGroupStarted] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [workflowId, setWorkflowId, resetWorkflowId] = useResettableState('');
    const [workflows, setWorkflows, resetWorkflows] = useResettableState<Workflow[]>([]);
    const [loadingMessage, setLoadingMessage, turnOffLoading] = useResettableState('');
    const workflowsOptions = useMemo(() => getWorkflowsOptions(workflows), [workflows]);

    const searchActions = new SearchActions(toolbox);

    useEffect(() => {
        clearErrors();
        resetWorkflowId();
        resetWorkflows();
        unsetExecutionGroupStarted();
        setLoadingMessage(tModal('messages.fetchingWorkflows'));

        searchActions
            .doListAllWorkflows(filterRules)
            .then(data => setWorkflows(data.items))
            .catch(setMessageAsError)
            .finally(turnOffLoading);
    }, []);

    async function runWorkflow() {
        if (!workflowId) {
            setErrors({ error: tModal('errors.noWorkflowError') });
            return;
        }

        try {
            setLoadingMessage(tModal('messages.creatingDeploymentGroup'));
            const groupId = getGroupIdForBatchAction();
            const deploymentGroupsActions = new DeploymentGroupsActions(toolbox);
            await deploymentGroupsActions.doCreate(groupId, { filter_rules: filterRules });

            setLoadingMessage(tModal('messages.startingExecutionGroup'));
            const executionGroupsActions = new ExecutionGroupsActions(toolbox);
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
                <Icon name="cogs" /> {tModal('header')}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {loadingMessage && <LoadingOverlay message={loadingMessage} />}
                    <Form.Field label={tModal('inputs.workflowId.label')} help={tModal('inputs.workflowId.help')}>
                        <Dropdown
                            search
                            selection
                            options={workflowsOptions}
                            onChange={(_event, { value }) => setWorkflowId(value as string)}
                            value={workflowId}
                        />
                    </Form.Field>
                    <Message>{tModal('messages.limitations')}</Message>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} />
                <ApproveButton onClick={runWorkflow} content={tModal('buttons.run')} disabled={!workflowId} />
            </Modal.Actions>
        </Modal>
    );
};
export default RunWorkflowModal;
