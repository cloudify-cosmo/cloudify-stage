import { ComponentProps } from 'react';

export type OnChange = (event: Event, field: typeof Stage.Basic.UnsafelyTypedFormField) => void;
export type OnDropdownChange = ComponentProps<typeof Stage.Basic.Dropdown>['onChange'];
export type OnCheckboxChange = ComponentProps<typeof Stage.Basic.Checkbox>['onChange'];

export type Workflow = {
    name: string;
    parameters: Record<string, { description?: string; default?: any; type?: any }>;
    plugin: string;
};

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
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | Record<string, string | number | boolean>
    | null
    | undefined
>;
