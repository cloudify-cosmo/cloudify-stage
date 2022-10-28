import type { ComponentProps } from 'react';

export type OnDropdownChange = ComponentProps<typeof Stage.Basic.Dropdown>['onChange'];
export type OnCheckboxChange = ComponentProps<typeof Stage.Basic.Checkbox>['onChange'];

export type Workflow = {
    name: string;
    parameters: Record<string, { description?: string; default?: any; type?: any }>;
    plugin: string;
    // eslint-disable-next-line camelcase
    is_available: boolean;
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
