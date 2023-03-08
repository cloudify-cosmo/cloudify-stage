import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';

export interface DynamicTableProps
    extends Pick<Stage.Types.CustomConfigurationComponentProps<Record<string, any>[]>, 'name' | 'onChange' | 'value'> {
    columns?: Stage.Types.WidgetConfigurationDefinition[];
    errors?: Record<number, Record<string, any>>;
    [key: string]: any;
}

const DynamicTable: FunctionComponent<DynamicTableProps> = ({
    name,
    value = [],
    onChange,
    columns = [],
    errors,
    ...rest
}) => {
    const { GenericField, Button, Table } = Stage.Basic;
    const translate = Stage.Utils.getT('shared.dynamicTable');

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
                            .map(({ id, label, width, placeHolder, ...columnRest }) => {
                                const error = errors?.[index]?.[id];
                                return (
                                    <Table.Cell key={id} width={width} verticalAlign="top">
                                        <GenericField
                                            label=""
                                            key={id}
                                            index={index}
                                            name={id}
                                            value={val[id]}
                                            rowValues={val}
                                            onChange={handleEditRow(id, index)}
                                            placeholder={placeHolder}
                                            error={error && { content: error, pointing: 'above' }}
                                            {...rest}
                                            {...columnRest}
                                        />
                                    </Table.Cell>
                                );
                            })}
                        <Table.Cell textAlign="right" width={1} verticalAlign="top">
                            <Button
                                basic
                                icon="trash"
                                aria-label={translate('removeButton')}
                                title={translate('removeButton')}
                                onClick={handleRemoveRow(index)}
                            />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={columns.length + 1}>
                        <Button icon="add" content={translate('addButton')} onClick={handleAddRow} />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    );
};

export default DynamicTable;
