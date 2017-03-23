/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class InputDate extends Component {

    static propTypes = {
        placeholder: PropTypes.string,
        name: PropTypes.string,
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

    _refreshCalendar(params) {
        var self = this;
        $(this.refs.calendarObj).calendar({
            ampm: false,
            onChange: (date, text)=> self.props.onChange(date, {type: "date", name: self.props.name, value: text, date}),
            formatter:{
                date:(date, settings)=> {
                    if (!date)
                        return '';

                    return moment(date).format("DD-MM-YYYY");
                }
            },
            minDate: self.props.minDate,
            maxDate: self.props.maxDate,
            ...params
        });
    }

    componentDidMount() {
        this._refreshCalendar();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.minDate !== this.props.minDate ||
            nextProps.maxDate !== this.props.maxDate)
        {
            let params = {};
            if (moment(nextProps.minDate).isValid()) {
                params.minDate = nextProps.minDate;
            }
            if (moment(nextProps.maxDate).isValid()) {
                params.maxDate = nextProps.maxDate;
            }
            if (!_.isEmpty(params)) {
                this._refreshCalendar(params);
            }
        }
    }

    render() {
        return (
            <div className="ui calendar" ref="calendarObj">
                <div className="ui input fluid right icon">
                    <i className="calendar icon"></i>
                    <input type="text" placeholder={this.props.placeholder} name={this.props.name} value={this.props.value}/>
                </div>
            </div>
        );
    }
}
