import { ComponentProps } from 'react';

export type OnDateInputChange = (event: Event, field: { name?: string; value?: string }) => void; // DateInput has props any, so it is impossible to use ComponentProps<typeof Stage.Basic.DateInput>['onChange'];
export type OnDropdownChange = ComponentProps<typeof Stage.Basic.Dropdown>['onChange'];
export type OnCheckboxChange = ComponentProps<typeof Stage.Basic.Checkbox>['onChange'];

export type Workflow = {
    name: string;
    parameters: Record<string, { description?: string; default?: any; type?: any }>;
    plugin: string;
};

export type WorkflowParameters = Record<string, string>;
export type WorkflowOptions = { force: boolean; dryRun: boolean; queue: boolean; scheduledTime: string };

export type BaseWorkflowInputs = Record<
    string,
    {
        type?: string;
        default?: string;
        constraints?: {
            pattern: string;
        }[];
    }
>;

export type UserWorkflowInputsState = Record<
    string,
    undefined | boolean | number | string | (boolean | number | string)[]
>;

export type Errors = string | Record<string, string>;
