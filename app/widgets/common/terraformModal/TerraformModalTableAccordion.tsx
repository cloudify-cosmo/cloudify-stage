import React from 'react';
import type { DynamicTableProps } from '../../../components/common/DynamicTable';
import AccordionSection from '../components/accordion/AccordionSection';

import { DynamicTable } from '../../../components/shared';

type DynamicTableValue = DynamicTableProps['value'];

export interface TerraformModalTableAccordionProps<T extends any[]> {
    value: T;
    onChange: (value: T) => void;
    title: string;
    columns: (Stage.Types.WidgetConfigurationDefinition & { id: keyof T[number] })[];
    toolbox: Stage.Types.WidgetlessToolbox;
    idPrefix: string;
}

export default function TerraformModalTableAccordion<T extends DynamicTableValue>({
    title,
    value,
    onChange,
    columns,
    idPrefix,
    toolbox
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
            />
        </AccordionSection>
    );
}
