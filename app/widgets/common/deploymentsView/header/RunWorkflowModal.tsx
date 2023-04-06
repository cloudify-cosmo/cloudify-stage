import type { FunctionComponent } from 'react';
import React, { useEffect, useMemo } from 'react';
import { chain, find, capitalize } from 'lodash';
import type { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import { useBoolean, useErrors, useInputs, useResettableState } from '../../../../utils/hooks';
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
import InputField from '../../inputs/InputField';
import type { Input } from '../../inputs/types';

const fetchedWorkflowFields = ['name', 'parameters'] as const;
type FetchedWorkflow = Pick<Workflow, typeof fetchedWorkflowFields[number]>;

type SimplifiedWorkflowParameter = FetchedWorkflow['parameters'] & {
    name: string;
};

interface EnhancedWorkflow extends Omit<FetchedWorkflow, 'parameters'> {
    disabled: boolean;
    parameters: SimplifiedWorkflowParameter[];
}

export interface RunWorkflowModalProps {
    filterRules: FilterRule[];
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
    deploymentsCount: number;
}

const tModal = StageUtils.getT(`${i18nPrefix}.header.bulkActions.runWorkflow.modal`);

// TODO Norbert: Extract some functions to a separated file

const getWorkflowOptionText = (workflow: EnhancedWorkflow) => {
    return capitalize(workflow.name.replaceAll('_', ' '));
};

const getWorkflowOptions = (workflows: EnhancedWorkflow[]): DropdownItemProps[] => {
    type OptionsGroupName = 'enabledOptions' | 'disabledOptions';
    type GroupedOptions = Partial<Record<OptionsGroupName, DropdownItemProps[]>>;

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

const mapFetchedWorkflowParameters = (
    workflowParameters: FetchedWorkflow['parameters']
): SimplifiedWorkflowParameter[] => {
    const mappedWorkflowParameters = Object.keys(workflowParameters).map(workflowParameterName => {
        const workflowParameter = workflowParameters[workflowParameterName];
        const simplifiedWorkflowParameter = {
            ...workflowParameter,
            name: workflowParameterName
        } as SimplifiedWorkflowParameter;
        return simplifiedWorkflowParameter;
    });

    return mappedWorkflowParameters;
};

const filterSupportedWorkflowParameters = (
    workflowParameters: EnhancedWorkflow['parameters']
): EnhancedWorkflow['parameters'] => {
    const supportedParameterTypes = ['string', 'integer', 'float', 'boolean', 'list', 'textarea'];

    const filteredWorkflowParameters = workflowParameters.filter(
        parameter => parameter.type === undefined || supportedParameterTypes.includes(parameter.type as string)
    );

    return filteredWorkflowParameters;
};

// TODO Norbert: Add form validation (Ensure that form states are being cleared between selecting workflow

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
    const [parametersInputs, setParametersInputs, resetParametersInputs] = useInputs<Record<string, unknown>>({});

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
                // TODO Norbert: Make it more robust and developer friendly
                // TODO Norbert: Add note to PR about the reason behind doing mapping first (from performance POV it's not the best) - the reason is DX and not having a need of doing additional, complicated Array.prototype.reduce operations
                parameters: filterSupportedWorkflowParameters(mapFetchedWorkflowParameters(singleWorkflow.parameters))
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
        if (!selectedWorkflow) {
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
            await executionGroupsActions.doStart(groupId, selectedWorkflow.name, parametersInputs);

            toolbox.getEventBus().trigger('deployments:refresh').trigger('executions:refresh');
            setExecutionGroupStarted();
        } catch (error) {
            setMessageAsError(error);
        }

        turnOffLoading();
    }

    const initializeParametersInputs = () => {
        const defaultParametersData = selectedWorkflow?.parameters.reduce((parameters, parameter) => {
            parameters[parameter.name] = parameter.default;
            return parameters;
        }, {} as Record<string, unknown>);

        setParametersInputs(defaultParametersData);
    };

    const handleSelectWorkflow: DropdownProps['onChange'] = (_event, { value: workflowName }) => {
        setSelectedWorkflow(workflows.find(workflow => workflow.name === workflowName));
    };

    useEffect(() => {
        // TODO: Handle inputs reset - both state updates below are being executed as a batch and because of that the reset is not taking place
        resetParametersInputs();
        initializeParametersInputs();
    }, [selectedWorkflow]);

    useEffect(() => {
        // eslint-disable-next-line
        console.log(parametersInputs);
    }, [parametersInputs]);

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
                                <Form.Field label={parameters.name} key={parameters.name}>
                                    <InputField
                                        onChange={setParametersInputs}
                                        toolbox={toolbox}
                                        // TODO Norbert: Handle form error validations
                                        error={false}
                                        value={parametersInputs[parameters.name]}
                                        input={{
                                            type: parameters.type as Input['type'],
                                            name: parameters.name,
                                            display: {},
                                            constraints: [],
                                            default: parameters.default
                                        }}
                                        // TODO Norbert: Get to know what condition should be applied to determine if input field should be required
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
