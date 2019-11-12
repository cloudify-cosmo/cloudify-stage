/**
 * Created by jakubniezgoda on 04/09/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
     *
     * @property {string} name name of the field
     * @property {object} [value=null] MomentJS object with date to be selected on the picker
     * @property {Function} [onChange=(function () {});] function (selectedDateMoment, {name, value}) called on calendar date change
     * @property {object} [minDate=undefined] MomentJS object with min allowed date on the picker
     * @property {object} [maxDate=undefined] MomentJS object with max allowed date on the picker
     * @property {object} [startDate=undefined] MomentJS object for start range date (used when two InputDate components are used to display date range)
     * @property {object} [endDate=undefined] MomentJS object for end range date (used when two InputDate components are used to display date range)
     * @property {string} [timeIntervals=60] interval (in minutes) between time options
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
        onChange: PropTypes.func,
        minDate: PropTypes.object,
        maxDate: PropTypes.object,
        startDate: PropTypes.object,
        endDate: PropTypes.object,
        timeIntervals: PropTypes.number
    };

    static defaultProps = {
        value: null,
        onChange: () => {},
        minDate: undefined,
        maxDate: undefined,
        startDate: undefined,
        endDate: undefined,
        timeIntervals: 60
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
    }

    _handleSelectedDateChange(date) {
        return this.props.onChange(date, { name: this.props.name, value: date });
    }

    getMinMaxTime(minMaxDate, defaultValue) {
        const value = this.props.value || moment();
        if (!!minMaxDate && minMaxDate.isSame(value, 'day')) {
            return minMaxDate;
        }
        return defaultValue;
    }

    getMinTime() {
        return this.getMinMaxTime(this.props.minDate, moment().startOf('day'));
    }

    getMaxTime() {
        return this.getMinMaxTime(this.props.maxDate, moment().endOf('day'));
    }

    render() {
        return (
            <DatePicker
                selected={this.props.value}
                onChange={this._handleSelectedDateChange.bind(this)}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                minTime={this.getMinTime()}
                maxTime={this.getMaxTime()}
                timeFormat="HH:mm"
                showTimeSelect
                timeIntervals={this.props.timeIntervals}
                inline
                calendarClassName="input-time-filter"
                fixedHeight
            />
        );
    }
}
