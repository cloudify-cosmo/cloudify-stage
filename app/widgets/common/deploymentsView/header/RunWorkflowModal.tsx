import type { FunctionComponent } from 'react';
import React, { useEffect, useMemo } from 'react';
import { chain, find, capitalize } from 'lodash';
import type { DropdownItemProps } from 'semantic-ui-react';
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

const fetchedWorkflowFields = ['name', 'parameters'] as const;
type FetchedWorkflow = Pick<Workflow, typeof fetchedWorkflowFields[number]>;

interface EnhancedWorkflow extends FetchedWorkflow {
    disabled: boolean;
}

interface RunWorkflowModalProps {
    filterRules: FilterRule[];
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

const tModal = StageUtils.getT(`${i18nPrefix}.header.bulkActions.runWorkflow.modal`);

const getWorkflowOptionText = (workflow: EnhancedWorkflow) => {
    return capitalize(workflow.name.replaceAll('_', ' '));
};

const getWorkflowOptions = (workflows: EnhancedWorkflow[]): DropdownItemProps[] => {
    type OptionsGroupName = 'enabledOptions' | 'disabledOptions';
    type GroupedOptions = Record<OptionsGroupName, DropdownItemProps[] | undefined>;

    const { enabledOptions = [], disabledOptions = [] } = chain(workflows)
        .filter(workflow => !find(workflow.parameters, parameter => parameter.default === undefined))
        .sortBy('name')
        .map(workflow => ({
            text: getWorkflowOptionText(workflow),
            value: workflow.name,
            disabled: workflow.disabled
        }))
        .groupBy((workflow): OptionsGroupName => {
            return workflow.disabled ? 'disabledOptions' : 'enabledOptions';
        })
        .value() as GroupedOptions;

    return [...enabledOptions, ...disabledOptions];
};

const RunWorkflowModal: FunctionComponent<RunWorkflowModalProps> = ({ filterRules, onHide, toolbox }) => {
    const [executionGroupStarted, setExecutionGroupStarted, unsetExecutionGroupStarted] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [workflowId, setWorkflowId, resetWorkflowId] = useResettableState('');
    const [workflows, setWorkflows, resetWorkflows] = useResettableState<EnhancedWorkflow[]>([]);
    const [loadingMessage, setLoadingMessage, turnOffLoading] = useResettableState('');
    const workflowsOptions = useMemo(() => getWorkflowOptions(workflows), [workflows]);

    const searchActions = new SearchActions(toolbox);

    const fetchWorkflows = (common?: boolean) => {
        return searchActions.doListAllWorkflows<keyof FetchedWorkflow>(filterRules, {
            _include: fetchedWorkflowFields.join(','),
            _common_only: common
        });
    };

    const getFilteredWorkflows = (): Promise<EnhancedWorkflow[]> => {
        const fetchRequests = [fetchWorkflows(true), fetchWorkflows()];
        return Promise.all(fetchRequests).then(([commonWorkflows, allWorkflows]) => {
            const filteredWorkflows = allWorkflows.items.map(singleWorkflow => ({
                ...singleWorkflow,
                disabled: !commonWorkflows.items.find(commonWorkflow => commonWorkflow.name === singleWorkflow.name)
            }));
            return filteredWorkflows;
        });
    };

    useEffect(() => {
        clearErrors();
        resetWorkflowId();
        resetWorkflows();
        unsetExecutionGroupStarted();
        setLoadingMessage(tModal('messages.fetchingWorkflows'));

        getFilteredWorkflows().then(setWorkflows).catch(setMessageAsError).finally(turnOffLoading);
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
