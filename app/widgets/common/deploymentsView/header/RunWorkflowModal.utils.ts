import { chain, capitalize, map, find } from 'lodash';
import type { DropdownItemProps } from 'semantic-ui-react';
import type { FetchedWorkflow, EnhancedWorkflow, SimplifiedWorkflowParameter } from './RunWorkflowModal.types';

const supportedParameterTypes = ['string', 'integer', 'float', 'boolean', 'list', 'textarea', undefined];

const getWorkflowOptionText = (workflow: EnhancedWorkflow) => {
    return capitalize(workflow.name.replaceAll('_', ' '));
};

const isParameterRequired = (parameter: FetchedWorkflow['parameters'][string]) => {
    return parameter.default === undefined;
};

export const getWorkflowOptions = (workflows: EnhancedWorkflow[]): DropdownItemProps[] => {
    type OptionsGroupName = 'enabledOptions' | 'disabledOptions';
    type GroupedOptions = Partial<Record<OptionsGroupName, DropdownItemProps[]>>;

    const { enabledOptions = [], disabledOptions = [] } = chain(workflows)
        .filter(
            workflow =>
                !find(workflow.parameters, parameter => {
                    const parameterIsRequiredButNotSupported =
                        isParameterRequired(parameter) && !supportedParameterTypes.includes(parameter.type);

                    return parameterIsRequiredButNotSupported;
                })
        )
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
    return map(workflowParameters, (parameterFields, parameterName) => ({
        ...parameterFields,
        name: parameterName,
        required: isParameterRequired(parameterFields)
    }));
};

const filterSupportedWorkflowParameters = (
    workflowParameters: EnhancedWorkflow['parameters']
): EnhancedWorkflow['parameters'] => {
    const filteredWorkflowParameters = workflowParameters.filter(parameter =>
        supportedParameterTypes.includes(parameter.type)
    );

    return filteredWorkflowParameters;
};

export const initializeWorkflowParameters = (
    workflowParameters: FetchedWorkflow['parameters']
): SimplifiedWorkflowParameter[] => {
    const mappedParameters = mapFetchedWorkflowParameters(workflowParameters);
    return filterSupportedWorkflowParameters(mappedParameters);
};
