import React from 'react';
import TerraformModalAccordion from './TerraformModalAccordion';

const { DynamicTable } = Stage.Shared;
type DynamicTableProps = React.ComponentProps<typeof DynamicTable>;
type ValueType = DynamicTableProps['value'];

interface TerraformModalTableAccordionProps {
    value: ValueType;
    onChange: (value: ValueType) => void;
    title: string;
    columns: DynamicTableProps['columns'];
    toolbox: Stage.Types.WidgetlessToolbox;
}

export default function TerraformModalTableAccordion({
    title,
    value,
    onChange,
    columns,
    toolbox
}: TerraformModalTableAccordionProps) {
    return (
        <TerraformModalAccordion title={title}>
            <DynamicTable
                widgetlessToolbox={toolbox}
                name=""
                value={value}
                onChange={(_event, field) => onChange(field.value)}
                columns={columns}
            />
        </TerraformModalAccordion>
    );
}
