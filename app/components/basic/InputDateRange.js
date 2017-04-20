/**
 * Created by jakubniezgoda on 05/04/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class InputDateRange extends Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func,
        minDate: PropTypes.object,
        maxDate: PropTypes.object
    };

    static defaultProps = {
        onChange: ()=>{},
        minDate: null,
        maxDate: null
    };

    _refreshCalendar() {
        let self = this;
        let dateRangePickerElement = 'input[name=' + self.props.name + ']';

        $(dateRangePickerElement).daterangepicker({
            timePicker: true,
            timePickerIncrement: 5,
            timePicker12Hour: false,
            minDate: self.props.minDate,
            maxDate: self.props.maxDate,
            format: 'DD-MM-YYYY HH:mm',
            ranges: {
                'Last 15 Minutes': [moment().subtract(15, 'minutes'), moment()],
                'Last Hour': [moment().subtract(1, 'hours'), moment()],
                'Last Day': [moment().subtract(1, 'days'), moment()],
            },
            value: self.props.value
        });
        $(dateRangePickerElement).on('apply.daterangepicker', (event, picker) => {
            let field = {name: self.props.name, startDate: picker.startDate, endDate: picker.endDate, value: $(dateRangePickerElement).val()};
            self.props.onChange(picker, field);
        });
    }

    componentDidMount() {
        this._refreshCalendar();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this._refreshCalendar();
        }
    }

    render() {
        return (
            <div className="ui calendar">
                <div className="ui input fluid right icon">
                    <i className="calendar icon"></i>
                    <input type="text" placeholder={this.props.placeholder} name={this.props.name} value={this.props.value} />
                </div>
            </div>
        );
    }
}
