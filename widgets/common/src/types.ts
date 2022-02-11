import { ComponentProps } from 'react';

export type DropdownValue = string | string[] | null;

export type OnChange = (event: Event, field: typeof Stage.Basic.Form.Field) => void;
export type OnDropdownChange = ComponentProps<typeof Stage.Basic.Dropdown>['onChange'];
export type OnCheckboxChange = ComponentProps<typeof Stage.Basic.Checkbox>['onChange'];

export type Workflow = {
    name: string;
    parameters: Record<string, { description?: string; default?: any; type?: any }>;
    plugin: string;
};

export type Field = { name: string; value: unknown; type: string; checked?: string | undefined };
