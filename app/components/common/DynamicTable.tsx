import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';

export interface DynamicTableProps
    extends Pick<Stage.Types.CustomConfigurationComponentProps<Record<string, any>[]>, 'name' | 'onChange' | 'value'> {
    columns?: Stage.Types.WidgetConfigurationDefinition[];
    [key: string]: any;
}

const DynamicTable: FunctionComponent<DynamicTableProps> = ({ name, value = [], onChange, columns = [], ...rest }) => {
    const { GenericField, Button, Table } = Stage.Basic;
    const t = Stage.Utils.getT('shared.dynamicTable');

    const handleEditRow =
        (key: string, index: number): ComponentProps<typeof GenericField>['onChange'] =>
        (event, data) => {
            onChange(event, {
                name,
                value: [...value.slice(0, index), { ...value[index], [key]: data.value }, ...value.slice(index + 1)]
            });
        };
    const handleRemoveRow =
        (index: number): ComponentProps<typeof Button>['onClick'] =>
        event => {
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
        <Table compact basic>
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
                            .map(({ id, label, width, placeHolder, ...columnRest }) => (
                                <Table.Cell key={id} width={width}>
                                    <GenericField
                                        label=""
                                        key={id}
                                        index={index}
                                        name={id}
                                        value={val[id]}
                                        rowValues={val}
                                        onChange={handleEditRow(id, index)}
                                        placeholder={placeHolder}
                                        {...rest}
                                        {...columnRest}
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
