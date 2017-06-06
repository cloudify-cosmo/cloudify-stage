/**
 * Created by jakubniezgoda on 18/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';

export default class PieGraph extends Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
        };
    }

    static propTypes = {
        data: PropTypes.array.isRequired
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    render() {
        let data = this.props.data;

        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} labelLine={true} label={true} cx="40%">
                        {
                            data.map((entry, index) => <Cell fill={entry.color}/>)
                        }
                    </Pie>
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        );
    }
};
