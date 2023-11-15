import React from 'react';
import type { DynamicTableProps, DynamicTableValue } from 'cloudify-ui-components';
import { AccordionSection } from 'cloudify-ui-components';

import { DynamicTable } from '../../../components/shared';

export interface TerraformModalTableAccordionProps<T extends any[]> {
    value: T;
    onChange: (value: T) => void;
    title: string;
    columns: (Stage.Types.WidgetConfigurationDefinition & { id: keyof T[number] })[];
    toolbox: Stage.Types.WidgetlessToolbox;
    idPrefix: string;
    errors: Record<string, DynamicTableProps['errors']>;
}

export default function TerraformModalTableAccordion<T extends DynamicTableValue>({
    title,
    value,
    onChange,
    columns,
    idPrefix,
    toolbox,
    errors
}: TerraformModalTableAccordionProps<T>) {
    return (
        <AccordionSection title={title}>
            <DynamicTable
                widgetlessToolbox={toolbox}
                name=""
                idPrefix={idPrefix}
                value={value}
                onChange={(_event, field) => onChange(field.value as T)}
                columns={columns}
                errors={errors[idPrefix]}
            />
        </AccordionSection>
    );
}
