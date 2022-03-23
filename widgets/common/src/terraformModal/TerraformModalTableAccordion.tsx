import React from 'react';
import type { DynamicTableProps } from '../../../../app/components/shared/DynamicTable';

const { DynamicTable } = Stage.Shared;
type DynamicTableValue = DynamicTableProps['value'];

export interface TerraformModalTableAccordionProps<T extends any[]> {
    value: T;
    onChange: (value: T) => void;
    title: string;
    columns: (Stage.Types.WidgetConfigurationDefinition & { id: keyof T[number] })[];
    toolbox: Stage.Types.WidgetlessToolbox;
}

export default function TerraformModalTableAccordion<T extends DynamicTableValue>({
    title,
    value,
    onChange,
    columns,
    toolbox
}: TerraformModalTableAccordionProps<T>) {
    const { Section } = Stage.Common.Components.Accordion;
    return (
        <Section title={title}>
            <DynamicTable
                widgetlessToolbox={toolbox}
                name=""
                value={value}
                onChange={(_event, field) => onChange(field.value as T)}
                columns={columns}
            />
        </Section>
    );
}
