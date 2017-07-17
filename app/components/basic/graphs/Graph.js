/**
 * Created by jakubniezgoda on 16/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
let d3Format = require("d3-format");

/**
 * Graph is a component to present data in form of line or bar chart
 *
 * Data is array in the following format:
 * ```
 * [
 *     {
 *          <xDataKey>: <X data value 1>,
 *          <yDataKay>: <Y data value 1>,
 *     },
 *     {
 *          <xDataKey>: <X data value 2>,
 *          <yDataKay>: <Y data value 2>,
 *     },
 *     ...
 * ]
 * ```
 *
 * ## Usage
 *
 * ### Bar chart
 * ![Graph 0](manual/asset/graphs/Graph_0.png)
 *
 * ```
 * let data1 = [
 *      {name: 'Oranges', value: 300},
 *      {name: 'Apples', value: 100},
 *      {name: 'Grapes', value: 80},
 *      {name: 'Pineapples', value: 40},
 *      {name: 'Watermelons', value: 30}
 * ];
 * return (<Graph xDataKey='name' yDataKey='value' data={data1} label='Number of fruits' type={Graph.BAR_CHART_TYPE} />);
 * ```
 *
 * ### Line chart
 * ![Graph 1](manual/asset/graphs/Graph_1.png)
 *
 * ```
 * let data2 = [
 *      {time: '17:30', value: 1},
 *      {time: '17:40', value: 2},
 *      {time: '17:50', value: 1},
 *      {time: '18:00', value: 3},
 *      {time: '18:10', value: 5},
 *      {time: '18:20', value: 8},
 *      {time: '18:30', value: 5}
 * ];
 * return (<Graph yDataKey='value' data={data2} label='CPU load' type={Graph.LINE_CHART_TYPE} />);
 * ```
 */
export default class Graph extends Component {

    /**
     *
     */
    static DEFAULT_X_DATA_KEY = 'time';
    /**
     *
     */
    static LINE_CHART_TYPE = 'line';
    /**
     *
     */
    static BAR_CHART_TYPE = 'bar';

    /**
     * propTypes
     * @property {object[]} data graph input data
     * @property {string} type graph chart type ({@link Graph.LINE_CHART_TYPE} or {@link Graph.BAR_CHART_TYPE})
     * @property {string} yDataKey Y-axis key name, must match key in data object
     * @property {string} [yDataUnit=''] Y-axis unit, shown on the left side of the graph
     * @property {string} [xDataKey=Graph.DEFAULT_X_DATA_KEY] X-axis key name, must match key in data object
     * @property {string} [label=this.props.yDataKey] graph label, shown under the graph
     */
    static propTypes = {
        data: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
        yDataKey: PropTypes.string.isRequired,
        yDataUnit: PropTypes.string,
        xDataKey: PropTypes.string,
        label: PropTypes.string
    };

    static defaultProps = {
        yDataUnit: '',
        xDataKey: Graph.DEFAULT_X_DATA_KEY,
        label: ''
    };

    render () {
        const MARGIN = {top: 5, right: 30, left: 20, bottom: 5};
        const COLOR = "#8884d8";
        const INTERPOLATION_TYPE = "monotone";
        const STROKE_DASHARRAY = "3 3";

        let valueFormatter = d3Format.format('.3s');
        let label = this.props.label || this.props.yDataKey;

        // Code copied from re-charts GitHub, see: https://github.com/recharts/recharts/issues/184
        const AxisLabel = ({ vertical, x, y, width, height, children }) => {
            const CX = vertical ? x : x + (width / 2);
            const CY = vertical ? (height / 2) + y : y + height;
            const ROTATION = vertical ? `270 ${CX} ${CY}` : 0;
            return (
                <text x={CX} y={CY} transform={`rotate(${ROTATION})`} textAnchor="middle">
                    {children}
                </text>
            );
        };

        return (
            <ResponsiveContainer width="100%" height="100%">
                {
                    this.props.type == Graph.LINE_CHART_TYPE
                    ?
                        <LineChart data={this.props.data}
                                   margin={MARGIN}>
                            <XAxis dataKey={this.props.xDataKey} />
                            <YAxis tickFormatter={valueFormatter} label={<AxisLabel vertical>{this.props.yDataUnit}</AxisLabel>} />
                            <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                            <Tooltip formatter={valueFormatter} />
                            <Legend />
                            <Line isAnimationActive={false} name={label} type={INTERPOLATION_TYPE}
                                  dataKey={this.props.yDataKey} stroke={COLOR} />
                        </LineChart>
                    :
                        <BarChart data={this.props.data}
                                  margin={MARGIN}>
                            <XAxis dataKey={this.props.xDataKey} />
                            <YAxis tickFormatter={valueFormatter} label={<AxisLabel vertical>{this.props.yDataUnit}</AxisLabel>} />
                            <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                            <Tooltip formatter={valueFormatter} />
                            <Legend />
                            <Bar isAnimationActive={false} name={label}
                                 dataKey={this.props.yDataKey} fill={COLOR} />
                        </BarChart>
                }
            </ResponsiveContainer>
        );
    }
};
