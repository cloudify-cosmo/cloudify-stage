/**
 * Created by jakubniezgoda on 04/09/2017.
 */

import React, { Component, PropTypes } from 'react';

/**
 * InputDate is a component showing calendar picker using [Semantic-UI-Calendar library](https://github.com/mdehoog/Semantic-UI-Calendar)
 *
 * ## Access
 * `Stage.Basic.Form.InputDate`
 *
 * ## Usage
 * ![InputDate](manual/asset/form/InputDate_0.png)
 *
 * ```
 * <Form.InputDate name='startDate' inline={true} maxDate={new Date()}
 *                 endDate={this.state.endDate} value={this.state.startDate}
 *                 onChange={this._handleCustomInputChange.bind(this)} />
 * ```
 *
 */
export default class InputDate extends Component {

    constructor(props, context) {
        super(props, context);

        this.calendarElement = this._getCalendarSelector(props.name);

        this.state = InputDate.initialState;
    }

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {object} [value='00:00'] variable for input value control (acceptable format: Date())
     * @property {function} [onChange=(function () {});] function called on calendar date change
     * @property {object} [minDate=null] JS Date object with min allowed date on the picker
     * @property {object} [maxDate=null] JS Date object with max allowed date on the picker
     * @property {object} [startDate=null] JS Date object for start range date (used when two InputDate components are used to display date range)
     * @property {object} [endDate=null] JS Date object for end range date (used when two InputDate components are used to display date range)
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

    static initialState = {
        value: null
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props)
            || !_.isEqual(nextState, this.state);
    }

    componentDidMount() {
        this._initializeCalendar();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.startDate && !_.isEqual(this.props.startDate, nextProps.startDate)) {
            this._callCalendarFunction('set startDate', nextProps.startDate);
        }
        if (nextProps.endDate && !_.isEqual(this.props.endDate, nextProps.endDate)) {
            this._callCalendarFunction('set endDate', nextProps.endDate);
        }
        if (!_.isEqual(this.props.value, nextProps.value) && !_.isEqual(nextProps.value, this.state.value)) {
            this._callCalendarFunction('set date', nextProps.value, false, false);
        }
    }

    _callCalendarFunction(behaviorName, arg1, arg2, arg3) {
        $(this.calendarElement).calendar(behaviorName, arg1, arg2, arg3);
    }

    _getCalendarSelector(id) {
        return `#${id}`;
    }

    _initializeCalendar() {
        let _this = this;
        $(this.calendarElement).calendar({
            type: 'date',
            inline: _this.props.inline,
            minDate: _this.props.minDate,
            maxDate: _this.props.maxDate,
            onChange: function (date, text, mode) {
                _this.setState({value: date}, () =>
                    _this.props.onChange(null, {
                        name: _this.props.name,
                        value: date
                    })
                );
            }
        });

        this._callCalendarFunction('set date', this.props.value, false, false);
        if (this.props.startDate) {
            this._callCalendarFunction('set startDate', this.props.startDate);
        }
        if (this.props.endDate) {
            this._callCalendarFunction('set endDate', this.props.endDate);
        }
    }

    render() {
        return (
            <div className="ui calendar" id={this.props.name} />
        );
    }
}
