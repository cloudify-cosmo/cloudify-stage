/**
 * Created by jakubniezgoda on 05/09/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Table, Dropdown} from 'semantic-ui-react';

/**
 * InputTime is a component showing time picker in form of hours/minutes input field
 *
 * ## Access
 * `Stage.Basic.Form.InputTime`
 *
 * ## Usage
 * ![InputTime](manual/asset/form/InputTime_0.png)
 *
 * ```
 * <Form.InputTime name='startTime' value={this.state.startTime} />
 * ```
 *
 */
export default class InputTime extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = InputTime.initialState;
    }

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {string} [value='00:00'] variable for input value control (acceptable format: 'HH:mm')
     * @property {function} [onChange=(function () {});] function called on hours/minutes input change
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: '00:00',
        onChange: ()=>{}
    };

    static initialState = {
        hours: '00',
        minutes: '00'
    };

    static generateOptions = (start, end, step, padding) => {
        return _.range(start, end, step).map(num => {
            let value = _.padStart(num, padding, '0');
            return { key: value, text: value, value: value };
        });
    }
    static HOURS_OPTIONS = InputTime.generateOptions(0, 24, 1, 2);
    static MINUTES_OPTIONS = InputTime.generateOptions(0, 60, 1, 2);

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props)
            || !_.isEqual(nextState, this.state);
    }

    componentDidMount() {
        this._parseAndSetState(this.props.value);
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.value, this.props.value)) {
            this._parseAndSetState(nextProps.value);
        }
    }

    _handleDropdownChange(event, field) {
        this.setState({[field.name]: field.value}, () =>
            this.props.onChange(event, {
                name: this.props.name,
                value: `${this.state.hours}:${this.state.minutes}`
            })
        );
    }

    _parseAndSetState(value) {
        let [hours, minutes] = _.split(value, ':');
        this.setState({hours, minutes});
    }

    render() {
        return (
            <Table compact basic='very'>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell textAlign='left'>
                            <Dropdown selection options={InputTime.HOURS_OPTIONS} name='hours' fluid
                                      value={this.state.hours} onChange={this._handleDropdownChange.bind(this)} />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            :
                        </Table.Cell>
                        <Table.Cell textAlign='right'>
                            <Dropdown selection options={InputTime.MINUTES_OPTIONS} name='minutes' fluid
                                      value={this.state.minutes} onChange={this._handleDropdownChange.bind(this)} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    }
}
