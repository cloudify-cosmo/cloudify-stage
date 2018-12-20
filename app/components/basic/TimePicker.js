/**
 * Created by jakubniezgoda on 20/12/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {Button, Form, Popup} from './index';

/**
 * TimePicker is a component showing datetime picker
 *
 *
 * ## Access
 * `Stage.Basic.TimePicker`
 *
 * ## Usage
 * ![TimePicker](manual/asset/TimePicker_0.png)
 *
 * ```
 * <TimePicker name='scheduledTime' value={this.state.scheduledTime} defaultValue=''
 *             minDate={moment()} maxDate={moment().add(1, 'Y')}
 *             onChange={(event, field) => this.setState({scheduledTime: field.value, queue: false})} />
 * ```
 *
 */
export default class TimePicker extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = TimePicker.initialState;
    }

    static TIME_FORMAT = 'HH:mm';
    static DATE_FORMAT = 'YYYY-MM-DD';
    static DATETIME_FORMAT = `${TimePicker.DATE_FORMAT} ${TimePicker.TIME_FORMAT}`;

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {object} defaultValue string data value to be set when Reset button is clicked
     * @property {object} value string data value
     * @property {string} [placaholder=''] input field placeholder
     * @property {number} [timeIntervals=5] time interval between available time options (in minutes)
     * @property {object} [minDate=undefined] moment object for minimal date available in picker
     * @property {object} [maxDate=undefined] moment object for maximal date available in picker
     * @property {function} [onChange=(function (event, data) {});] function called on data picker change
     */
    static propTypes = {
        defaultValue: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,

        minDate: PropTypes.object,
        maxDate: PropTypes.object,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        timeIntervals: PropTypes.number
    };

    static defaultProps = {
        minDate: undefined,
        maxDate: undefined,
        onChange: _.noop,
        placeholder: TimePicker.DATETIME_FORMAT,
        timeIntervals: 5
    };

    static initialState = {
        dateError: false,
        dateValue: null,
        dirty: false,
        isOpen: false
    };

    static getDateString(momentDate) {
        return moment(momentDate).format(TimePicker.DATETIME_FORMAT);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== TimePicker.getDateString(prevState.dateValue)) {
            return TimePicker.getDateState(prevState.dateValue, nextProps.value);
        } else {
            return null;
        }
    }

    static getDateState(currentMomentDate, newStringDate) {
        return _.isEmpty(newStringDate)
            ? {dateError: false, dateValue: undefined}
            : moment(newStringDate).isValid()
                ? {dateError: false, dateValue: currentMomentDate}
                : {dateError: true, dateValue: undefined};
    }

    handleDataPickerChange(proxy, field) {
        const value = TimePicker.getDateString(field.value);
        this.setState({dirty: !_.isEqual(value, this.props.defaultValue), dateValue: field.value, dateError: false});
        this.props.onChange(proxy, {name: this.props.name, value});
    }

    handleInputChange(proxy, field) {
        this.props.onChange(proxy, {name: this.props.name, value: field.value});
        this.setState(TimePicker.getDateState(this.state.dateValue, field.value));
    }

    handleResetButtonClick(proxy) {
        this.props.onChange(proxy, {name: this.props.name, value: this.props.defaultValue});
        this.setState({dirty: false, ...TimePicker.getDateState(this.state.dateValue, this.props.defaultValue)});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
            || !_.isEqual(this.state, nextState);
    }

    render () {
        return (
            <Popup hoverable flowing onClose={() => this.setState({isOpen: false})} open={this.state.isOpen} position='top right'>
                <Popup.Trigger>
                    <Form.Input name='value' value={this.props.value} placeholder={this.props.placeholder} fluid action error={this.state.dateError}
                                onChange={this.handleInputChange.bind(this)} onClick={() => this.setState({isOpen: false})}>
                        <input />
                        <Button onClick={() => this.setState({isOpen: true})} icon='calendar' />
                        <Button onClick={this.handleResetButtonClick.bind(this)} icon="cancel" disabled={!this.state.dirty}/>
                    </Form.Input>
                </Popup.Trigger>

                <Form.InputDate name='dateValue' value={this.state.dateValue}
                                onChange={this.handleDataPickerChange.bind(this)}
                                minDate={this.props.minDate} maxDate={this.props.maxDate}
                                timeIntervals={this.props.timeIntervals} />
            </Popup>
        );
    }
}
