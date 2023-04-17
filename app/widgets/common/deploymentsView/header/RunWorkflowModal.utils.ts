import { chain, capitalize, map } from 'lodash';
import type { DropdownItemProps } from 'semantic-ui-react';
import type { FetchedWorkflow, EnhancedWorkflow, SimplifiedWorkflowParameter } from './RunWorkflowModal.types';

const getWorkflowOptionText = (workflow: EnhancedWorkflow) => {
    return capitalize(workflow.name.replaceAll('_', ' '));
};

export const getWorkflowOptions = (workflows: EnhancedWorkflow[]): DropdownItemProps[] => {
    type OptionsGroupName = 'enabledOptions' | 'disabledOptions';
    type GroupedOptions = Partial<Record<OptionsGroupName, DropdownItemProps[]>>;

    const { enabledOptions = [], disabledOptions = [] } = chain(workflows)
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
    return map(workflowParameters, (parameterFields, parameterName) => {
        return {
            ...parameterFields,
            name: parameterName,
            required: parameterFields.default === undefined
        };
    });
};

const filterSupportedWorkflowParameters = (
    workflowParameters: EnhancedWorkflow['parameters']
): EnhancedWorkflow['parameters'] => {
    const supportedParameterTypes = ['string', 'integer', 'float', 'boolean', 'list', 'textarea', undefined];

    const filteredWorkflowParameters = workflowParameters.filter(
        parameter => parameter.type === undefined || supportedParameterTypes.includes(parameter.type)
    );

    return filteredWorkflowParameters;
};

export const initializeWorkflowParameters = (
    workflowParameters: FetchedWorkflow['parameters']
): SimplifiedWorkflowParameter[] => {
    const mappedParameters = mapFetchedWorkflowParameters(workflowParameters);
    return filterSupportedWorkflowParameters(mappedParameters);
};
