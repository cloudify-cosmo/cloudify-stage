import React, { ComponentProps, FunctionComponent } from 'react';

interface KeyValueEditorProps
    extends Pick<
        Stage.Types.CustomConfigurationComponentProps<Partial<Record<string, any>>[]>,
        'name' | 'onChange' | 'value'
    > {
    columns: Stage.Types.WidgetConfigurationDefinition[];
}

const DynamicTable: FunctionComponent<KeyValueEditorProps> = ({ name, value = [], onChange, columns = [] }) => {
    const { GenericField, Input, Button, Icon, Table } = Stage.Basic;

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
                        <Table.Cell textAlign="center">
                            <Button icon onClick={handleRemoveRow(index)}>
                                <Icon name="minus" />
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={columns.length + 1} textAlign="center">
                        <Button icon onClick={handleAddRow}>
                            <Icon name="plus" />
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    );
};

export default DynamicTable;
