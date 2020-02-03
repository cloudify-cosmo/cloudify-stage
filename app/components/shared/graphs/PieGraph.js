/**
 * Created by jakubniezgoda on 18/05/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';

/**
 * PieGraph is a component to present data in form of pie chart
 *
 * Data is array in the following format:
 * ```
 * [
 *     {
 *          name: <string name of pie section 1, eg. 'Apples'>,
 *          color: <HTML color value 1, eg. '#45dd22'>,
 *          value: <numeric value of section 1, eg. 5>
 *     },
 *     {
 *          name: <string name of pie section 2, eg. 'Oranges'>,
 *          color: <HTML color value 2, eg. '#45dd22'>,
 *          value: <numeric value of section 2, eg. 10>
 *     },
 *     ...
 * ]
 * ```
 *
 * ## Usage
 *
 * ```
 * let formattedData = [
 *      {name: 'Started',     color: '#21ba45', value: 2},
 *      {name: 'In progress', color: '#fbbd08', value: 5},
 *      {name: 'Warning',     color: '#f2711c', value: 3},
 *      {name: 'Error',       color: '#db2828', value: 8}
 * ];
 *
 * return (<PieGraph data={formattedData} />);
 * ```
 */
export default class PieGraph extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * propTypes
     *
     * @property {object[]} data graph input data
     */
    static propTypes = {
        data: PropTypes.array.isRequired
    };

    render() {
        const { data } = this.props;

        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie dataKey="value" data={data} labelLine label isAnimationActive={false} cx="40%">
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        );
    }
}
