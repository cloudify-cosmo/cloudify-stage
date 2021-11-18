import React, { ComponentProps, FunctionComponent } from 'react';

interface KeyValueEditorProps
    extends Pick<
        Stage.Types.CustomConfigurationComponentProps<Partial<Record<string, any>>[]>,
        'name' | 'onChange' | 'value'
    > {
    columns?: Stage.Types.WidgetConfigurationDefinition[];
}

const DynamicTable: FunctionComponent<KeyValueEditorProps> = ({ name, value = [], onChange, columns = [] }) => {
    const { GenericField, Input, Button, Table } = Stage.Basic;
    const t = Stage.Utils.getT('shared.dynamicTable');

    const handleEditRow = (key: string, index: number): ComponentProps<typeof Input>['onChange'] => (event, data) => {
        onChange(event, {
            name,
            value: [...value.slice(0, index), { ...value[index], [key]: data.value }, ...value.slice(index + 1)]
        });
    };
    const handleRemoveRow = (index: number): ComponentProps<typeof Button>['onClick'] => event => {
        onChange(event, {
            name,
            value: [...value.slice(0, index), ...value.slice(index + 1)]
        });
    };
    const handleAddRow: ComponentProps<typeof Button>['onClick'] = event => {
        onChange(event, {
            name,
            value: [...value, Object.fromEntries(columns.map(column => [column.id, '']))]
        });
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    {columns
                        .filter(column => !column.hidden)
                        .map(column => (
                            <Table.HeaderCell key={column.id}>{column.label}</Table.HeaderCell>
                        ))}
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {value.map((val, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Table.Row key={index}>
                        {columns
                            .filter(column => !column.hidden)
                            .map(column => (
                                <Table.Cell key={column.id}>
                                    <GenericField
                                        label=""
                                        component={column.component}
                                        default={column.default}
                                        items={column.items}
                                        min={column.min}
                                        max={column.max}
                                        type={column.type}
                                        key={column.id}
                                        name={column.id}
                                        value={val[column.id]}
                                        onChange={handleEditRow(column.id, index)}
                                    />
                                </Table.Cell>
                            ))}
                        <Table.Cell textAlign="right" width={1}>
                            <Button
                                basic
                                icon="trash"
                                aria-label={t('removeButton')}
                                title={t('removeButton')}
                                onClick={handleRemoveRow(index)}
                            />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={columns.length + 1}>
                        <Button icon="add" content={t('addButton')} onClick={handleAddRow} />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    );
};

export default DynamicTable;
