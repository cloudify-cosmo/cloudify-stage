import type { FunctionComponent } from 'react';
import React, { useEffect, useMemo } from 'react';
import { isEmpty } from 'lodash';
import type { DropdownProps } from 'semantic-ui-react';
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
import StageUtils from '../../../../utils/stageUtils';
import InputField from '../../inputs/InputField';
import type { Input } from '../../inputs/types';
import useParametersInputs from './useParametersInputs';
import { initializeWorkflowParameters, getWorkflowOptions } from './RunWorkflowModal.utils';
import { fetchedWorkflowFields } from './RunWorkflowModal.consts';
import type { EnhancedWorkflow, FetchedWorkflow } from './RunWorkflowModal.types';

export interface RunWorkflowModalProps {
    filterRules: FilterRule[];
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
    deploymentsCount: number;
}

const tModal = StageUtils.getT(`${i18nPrefix}.header.bulkActions.runWorkflow.modal`);

const RunWorkflowModal: FunctionComponent<RunWorkflowModalProps> = ({
    filterRules,
    onHide,
    toolbox,
    deploymentsCount
}) => {
    const [executionGroupStarted, setExecutionGroupStarted, unsetExecutionGroupStarted] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [selectedWorkflow, setSelectedWorkflow, resetSelectedWorkflow] = useResettableState<
        EnhancedWorkflow | undefined
    >(undefined);
    const [workflows, setWorkflows, resetWorkflows] = useResettableState<EnhancedWorkflow[]>([]);
    const [loadingMessage, setLoadingMessage, turnOffLoading] = useResettableState('');
    const [parametersInputs, setParametersInputs, resetParametersInputs] = useParametersInputs();

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
                disabled: !commonWorkflows.items.find(commonWorkflow => commonWorkflow.name === singleWorkflow.name),
                parameters: initializeWorkflowParameters(singleWorkflow.parameters)
            }));
            return filteredWorkflows;
        });
    };

    useEffect(() => {
        clearErrors();
        resetSelectedWorkflow();
        resetParametersInputs();
        resetWorkflows();
        unsetExecutionGroupStarted();
        setLoadingMessage(tModal('messages.fetchingWorkflows'));

        getFilteredWorkflows().then(setWorkflows).catch(setMessageAsError).finally(turnOffLoading);
    }, []);

    async function runWorkflow() {
        const validationErrors: Record<string, string> = {};

        if (!selectedWorkflow) {
            validationErrors.error = tModal('errors.noWorkflowError');
        }

        if (selectedWorkflow) {
            const requiredParameters = selectedWorkflow.parameters.filter(parameter => parameter.required);

            requiredParameters.forEach(parameter => {
                const parameterValue = parametersInputs[parameter.name];
                if (isEmpty(parameterValue)) {
                    validationErrors[parameter.name] = tModal('errors.noParameterValue', {
                        parameter: parameter.name
                    });
                }
            });
        }

        if (!isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        try {
            clearErrors();
            setLoadingMessage(tModal('messages.creatingDeploymentGroup'));
            const groupId = getGroupIdForBatchAction();
            const deploymentGroupsActions = new DeploymentGroupsActions(toolbox);
            await deploymentGroupsActions.doCreate(groupId, { filter_rules: filterRules });

            setLoadingMessage(tModal('messages.startingExecutionGroup'));
            const executionGroupsActions = new ExecutionGroupsActions(toolbox);
            await executionGroupsActions.doStart(groupId, selectedWorkflow!.name, parametersInputs);

            toolbox.getEventBus().trigger('deployments:refresh').trigger('executions:refresh');
            setExecutionGroupStarted();
        } catch (error) {
            setMessageAsError(error);
        }

        turnOffLoading();
    }

    const initializeParametersInputs = () => {
        const defaultParametersData = selectedWorkflow?.parameters
            ? selectedWorkflow.parameters.reduce((parameters, parameter) => {
                  parameters[parameter.name] = parameter.default;
                  return parameters;
              }, {} as Record<string, unknown>)
            : {};

        resetParametersInputs(defaultParametersData);
    };

    const handleSelectWorkflow: DropdownProps['onChange'] = (_event, { value: workflowName }) => {
        setSelectedWorkflow(workflows.find(workflow => workflow.name === workflowName));
    };

    useEffect(() => {
        initializeParametersInputs();
    }, [selectedWorkflow]);

    return executionGroupStarted ? (
        <ExecutionStartedModal toolbox={toolbox} onClose={onHide} />
    ) : (
        <Modal open onClose={onHide}>
            <Modal.Header>
                <Icon name="cogs" />{' '}
                {tModal('header', {
                    deploymentsCount
                })}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {loadingMessage && <LoadingOverlay message={loadingMessage} />}
                    <Form.Field label={tModal('inputs.workflowId.label')} help={tModal('inputs.workflowId.help')}>
                        <Dropdown
                            search
                            selection
                            options={workflowsOptions}
                            onChange={handleSelectWorkflow}
                            value={selectedWorkflow?.name}
                        />
                    </Form.Field>
                    {selectedWorkflow &&
                        selectedWorkflow.parameters.map(parameters => {
                            return (
                                <Form.Field
                                    label={parameters.name}
                                    key={parameters.name}
                                    required={parameters.required}
                                    error={errors[parameters.name]}
                                >
                                    <InputField
                                        onChange={setParametersInputs}
                                        toolbox={toolbox}
                                        error={!!errors[parameters.name]}
                                        value={parametersInputs[parameters.name]}
                                        input={{
                                            type: parameters.type as Input['type'],
                                            name: parameters.name,
                                            display: {},
                                            constraints: [],
                                            default: parameters.default
                                        }}
                                    />
                                </Form.Field>
                            );
                        })}
                    <Message>{tModal('messages.limitations')}</Message>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} />
                <ApproveButton onClick={runWorkflow} content={tModal('buttons.run')} disabled={!selectedWorkflow} />
            </Modal.Actions>
        </Modal>
    );
};
export default RunWorkflowModal;
