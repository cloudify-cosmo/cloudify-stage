/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class InputDate extends Component {

    static propTypes = {
        placeholder: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func
    };

    static defaultProps = {
        onChange: ()=>{}
    };

    componentDidMount() {
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
            }
        });
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
