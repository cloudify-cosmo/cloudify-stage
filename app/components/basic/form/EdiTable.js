/**
 * Created by jakubniezgoda on 24/07/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import GenericField from './GenericField';
import Popup from '../Popup';

/**
 * EdiTable is a component used in forms to get tabular data input
 *
 * ## Access
 * `Stage.Basic.Form.Table`
 *
 * ## Usage
 * ![EdiTable](manual/asset/form/EdiTable_0.png)
 * ```
 * <EdiTable name="editableTable" type={GenericField.EDITABLE_TABLE_TYPE}
 *           label="EDITABLE_TABLE_TYPE"
 *           columns={[
 *             {name: "metric", label: 'Metric', default: "", type: Stage.Basic.GenericField.EDITABLE_LIST_TYPE, description: "Name of the metric to be presented on the graph",
 *              items: ["", "cpu_total_system", "cpu_total_user", "memory_MemFree", "memory_SwapFree", "loadavg_processes_running"]},
 *             {name: 'label', label: 'Label', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Chart label"},
 *             {name: 'unit', label: 'Unit', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Chart data unit"}
 *           ]}
 *           rows={3} />
 * ```
 *
 */
export default class EdiTable extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = EdiTable.initialState(props);
    }

    /**
     * propTypes
     *
     * @property {string} name name of the table
     * @property {number} rows number of rows in table
     * @property {object[]} columns rows configuration (see usage example for format details)
     * @property {object} [value] serialized value of the whole table
     * @property {Function} [onChange=()=>{}] function called on input value change
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        rows: PropTypes.number.isRequired,
        columns: PropTypes.array.isRequired,
        value: PropTypes.object,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: {},
        onChange: () => {}
    };

    static initialState = props => {
        const fields = [];

        for (let rowIndex = 0; rowIndex < props.rows; rowIndex++) {
            fields[rowIndex] = {};
            for (let columnIndex = 0; columnIndex < props.columns.length; columnIndex++) {
                const columnName = props.columns[columnIndex].name;
                fields[rowIndex][columnName] =
                    props.value && props.value[rowIndex] ? props.value[rowIndex][columnName] : '';
            }
        }

        return { fields };
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
            JSON.stringify(this.state) !== JSON.stringify(nextState)
        );
    }

    componentDidUpdate(prevProps) {
        if (
            JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value) ||
            prevProps.rows !== this.props.rows
        ) {
            this.setState(EdiTable.initialState(this.props));
        }
    }

    _handleInputChange(proxy, field) {
        const [row, column] = _.split(field.name, '|');
        const value = GenericField.formatValue(
            field.genericType,
            field.genericType === GenericField.BOOLEAN_TYPE ? field.checked : field.value
        );

        // Component state update
        const fields = { ...this.state.fields, [row]: { ...this.state.fields[row], [column]: value } };
        this.setState({ fields });

        // Serialize table data
        const ediTableField = {
            name: this.props.name,
            genericType: GenericField.EDITABLE_TABLE_TYPE,
            value: fields
        };

        // Parent component update
        this.props.onChange(proxy, ediTableField);
    }

    render() {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        {this.props.rows > 1 && (
                            <Table.HeaderCell key="-1" textAlign="center">
                                No.
                            </Table.HeaderCell>
                        )}
                        {_.map(this.props.columns, (column, index) => (
                            <Table.HeaderCell key={index} textAlign="center">
                                <label>
                                    {column.label}&nbsp;
                                    {column.description && (
                                        <Popup>
                                            <Popup.Trigger>
                                                <Icon name="help circle" />
                                            </Popup.Trigger>
                                            {column.description}
                                        </Popup>
                                    )}
                                </label>
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {_.times(this.props.rows, index => (
                        <Table.Row key={index}>
                            {this.props.rows > 1 && (
                                <Table.Cell key={`${index}|no`} textAlign="center">
                                    {index + 1}
                                </Table.Cell>
                            )}
                            {_.map(this.props.columns, column => (
                                <Table.Cell key={`${index}|${column.name}`}>
                                    <GenericField
                                        {...column}
                                        type={column.type}
                                        description=""
                                        label=""
                                        name={`${index}|${column.name}`}
                                        value={this.state.fields[index][column.name]}
                                        onChange={this._handleInputChange.bind(this)}
                                    />
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}
