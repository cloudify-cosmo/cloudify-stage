/**
 * Created by jakubniezgoda on 18/05/2017.
 */

import React, { Component, PropTypes } from 'react';
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
 * ## Access
 * `Stage.Basic.Graphs.PieGraph`
 *
 * ## Usage
 *
 * ![PieGraph](manual/asset/graphs/PieGraph_0.png)
 *
 * ```
 * let formattedData = [
 *      {name: 'Started',     color: '#21ba45', value: 2},
 *      {name: 'In progress', color: '#fbbd08', value: 5},
 *      {name: 'Warning',     color: '#f2711c', value: 3},
 *      {name: 'Error',       color: '#db2828', value: 8}
 * ];
 *
 * return (<PieGraph widget={widget} data={formattedData} toolbox={toolbox} />);
 * ```
 */
export default class PieGraph extends Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
        };
    }

    /**
     * propTypes
     * @property {object} widget Widget object
     * @property {object[]} data graph input data
     * @property {object} toolbox Toolbox object
     */
    static propTypes = {
        widget: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
        toolbox: PropTypes.object.isRequired
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
