/**
 * Created by jakubniezgoda on 04/09/2017.
 */

import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/Form.css';

/**
 * InputDate is a component showing calendar picker using [react-datepicker library](https://github.com/Hacker0x01/react-datepicker)
 *
 * ## Access
 * `Stage.Basic.Form.InputDate`
 *
 * ## Usage
 * ![InputDate](manual/asset/form/InputDate_0.png)
 *
 * ```
 * <Form.InputDate name='endDate' value={this.state.endDate}
 *                 onChange={this._handleCustomInputChange.bind(this)}
 *                 startDate={this.state.startDate}
 *                 endDate={this.state.endDate}
 *                 maxDate={moment()} />
 * ```
 *
 */
export default class InputDate extends Component {

    constructor(props, context) {
        super(props, context);
    }

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {object} [value=null] MomentJS object with date to be selected on the picker
     * @property {function} [onChange=(function () {});] function (selectedDateMoment, {name, value}) called on calendar date change
     * @property {object} [minDate=null] MomentJS object with min allowed date on the picker
     * @property {object} [maxDate=null] MomentJS object with max allowed date on the picker
     * @property {object} [startDate=null] MomentJS object for start range date (used when two InputDate components are used to display date range)
     * @property {object} [endDate=null] MomentJS object for end range date (used when two InputDate components are used to display date range)
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
        onChange: PropTypes.func,
        minDate: PropTypes.object,
        maxDate: PropTypes.object,
        startDate: PropTypes.object,
        endDate: PropTypes.object
    };

    static defaultProps = {
        value: null,
        onChange: ()=>{},
        minDate: null,
        maxDate: null,
        startDate: null,
        endDate: null
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props)
            || !_.isEqual(nextState, this.state);
    }

    _handleSelectedDateChange(date) {
        return this.props.onChange(date, {name: this.props.name, value: date});
    }

    render() {
        return (
            <DatePicker
                selected={this.props.value}
                onChange={this._handleSelectedDateChange.bind(this)}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                maxDate={this.props.maxDate}
                showTimeSelect
                timeIntervals={60}
                inline
                calendarClassName="input-time-filter"/>
        );
    }
}
