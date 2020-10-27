/**
 * Created by jakubniezgoda on 16/03/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

/**
 * Graph is a component to present data in form of line or bar charts.
 * Up to {@link Graph.MAX_NUMBER_OF_CHARTS} charts can be displayed within one Graph component.
 *
 * Data (data prop) is an array in the following format:
 * ```
 * [
 *     {
 *          <xDataKey>: <X data value 1>,
 *          <y1DataKey>: <Y1 data value 1>,
 *          <y2DataKey>: <Y2 data value 1>,
 *          <y3DataKey>: <Y3 data value 1>
 *     },
 *     {
 *          <xDataKey>: <X data value 2>,
 *          <y1DataKey>: <Y1 data value 2>,
 *          <y2DataKey>: <Y2 data value 2>,
 *          <y3DataKey>: <Y3 data value 2>
 *     },
 *     ...
 * ]
 * ```
 *
 * Chart configuration (charts prop) is an array in the following format:
 * ```
 * [
 *      {
 *           name: <y1DataKey>,
 *           label: <Chart1Label>,
 *           axisLabel: <Chart1AxisLabel>,
 *      },
 *      {
 *           name: <y1DataKey>,
 *           label: <Chart1Label>,
 *           axisLabel: <Chart1AxisLabel>,
 *      },
 *      ...
 * ]
 * ```
 * Up to {@link Graph.MAX_NUMBER_OF_CHARTS} charts can be defined in charts configuration array.
 *
 * ## Usage
 *
 * ### Bar chart
 *
 * ```
 * let data = [
 *     {time: '10:00', value: 300},
 *     {time: '11:00', value: 100},
 *     {time: '12:00', value: 80},
 *     {time: '13:00', value: 40},
 *     {time: '14:00', value: 30}
 * ];
 * return (<Graph dataTimeFormat='HH:mm' charts={[{name:'value', label:'Number of fruits', axisLabel:''}]} data={data} type={Graph.BAR_CHART_TYPE} />);
 * ```
 *
 * ### Line chart
 *
 * ```
 * let data = [
 *      {time: '17:30', value: 1},
 *      {time: '17:40', value: 2},
 *      {time: '17:50', value: 1},
 *      {time: '18:00', value: 3},
 *      {time: '18:10', value: 5},
 *      {time: '18:20', value: 8},
 *      {time: '18:30', value: 5}
 * ];
 * return (<Graph dataTimeFormat='HH:mm' charts={[{name:'value', label:'CPU load'}]} data={data} type={Graph.LINE_CHART_TYPE} />);
 * ```
 *
 * ### Area chart
 *
 * ```
 * let data = [
 *      {time: '17:30', value: 1},
 *      {time: '17:40', value: 2},
 *      {time: '17:50', value: 1},
 *      {time: '18:00', value: 3},
 *      {time: '18:10', value: 5},
 *      {time: '18:20', value: 8},
 *      {time: '18:30', value: 5}
 * ];
 * return (<Graph charts={[{name:'value', label='CPU load'}]} data={data} type={Graph.AREA_CHART_TYPE} />);
 * ```
 *
 *
 * ### Line chart - multi-charts, one Y-axis per chart
 *
 * ```
 * let data = [
 *      {cpu_total_system: 3.5,
 *       loadavg_processes_running: 3.071428571428572,
 *       memory_MemFree: 146003090.2857143,
 *       time: "2017-09-26 11:00:00"},
 *      ...
 * ];
 *
 * let charts = [
 *      {name: "cpu_total_system", label: "CPU - System [%]", axisLabel:""},
 *      {name: "memory_MemFree", label: "Memory - Free [Bytes]", axisLabel:""},
 *      {name: "loadavg_processes_running", label: "Load [%]", axisLabel:""}
 * ]
 *
 * return (<Graph charts={charts} data={data} type={Graph.LINE_CHART_TYPE} />);
 * ```
 *
 * ### Line chart - multi-charts, one Y-axis
 *
 * ```
 * let data = [
 *      {cpu_total_system: 3.5,
 *       cpu_total_user: 5.23,
 *       loadavg_processes_running: 3.071428571428572,
 *       time: "2017-09-26 11:20:00"},
 *      ...
 * ];
 *
 * let charts = [
 *      {name: "metrics", label: "metrics", axisLabel:"", fieldNames: ["cpu_total_system","cpu_total_user","loadavg_processes_running"]}
 * ]
 *
 * return (<Graph charts={charts} data={data} type={Graph.LINE_CHART_TYPE} />);
 * ```
 */
export default class Graph extends Component {
    /**
     * default X-axis data key
     */
    static DEFAULT_X_DATA_KEY = 'time';

    /**
     * line chart
     */
    static LINE_CHART_TYPE = 'line';

    /**
     * bar chart
     */
    static BAR_CHART_TYPE = 'bar';

    /**
     * area chart
     */
    static AREA_CHART_TYPE = 'area';

    /**
     * maximum number of charts
     */
    static MAX_NUMBER_OF_CHARTS = 5;

    render() {
        const {
            charts,
            data,
            onClick,
            showLegend,
            syncId,
            tooltipFormatter,
            type,
            xDataKey,
            yAxisAllowDecimals,
            yAxisDataFormatter
        } = this.props;
        const CHART_COMPONENTS = {
            [Graph.LINE_CHART_TYPE]: LineChart,
            [Graph.BAR_CHART_TYPE]: BarChart,
            [Graph.AREA_CHART_TYPE]: AreaChart
        };
        const DRAWING_COMPONENTS = {
            [Graph.LINE_CHART_TYPE]: Line,
            [Graph.BAR_CHART_TYPE]: Bar,
            [Graph.AREA_CHART_TYPE]: Area
        };
        const COLORS = ['#000069', '#28aae1', '#f4773c', '#21ba45', '#af41f4'];

        const MARGIN = { top: 5, right: 30, left: 20, bottom: 5 };
        const INTERPOLATION_TYPE = 'monotone';
        const STROKE_DASHARRAY = '3 3';

        const ChartComponent = CHART_COMPONENTS[type];
        const DrawingComponent = DRAWING_COMPONENTS[type];

        const chartElements = [];
        let index = 0;
        _.each(_.slice(charts, 0, Graph.MAX_NUMBER_OF_CHARTS), chart => {
            const COLOR = COLORS[index];
            const STYLE = { stroke: COLOR };
            index += 1;

            const yaxisComponent = (
                <YAxis
                    key={`yaxis${chart.name}`}
                    dataKey={chart.name}
                    yAxisId={chart.name}
                    axisLine={STYLE}
                    width={30}
                    allowDecimals={yAxisAllowDecimals}
                    tickFormatter={yAxisDataFormatter}
                />
            );
            chartElements.push(yaxisComponent);
            chartElements.push(
                <DrawingComponent
                    key={chart.name}
                    isAnimationActive={false}
                    name={chart.label}
                    type={INTERPOLATION_TYPE}
                    dataKey={chart.name}
                    stroke={COLOR}
                    fillOpacity={0.3}
                    fill={COLOR}
                    yAxisId={chart.name}
                />
            );
        });

        return (
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={data} margin={MARGIN} syncId={syncId} onClick={onClick}>
                    {chartElements}
                    <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                    <XAxis dataKey={xDataKey} />
                    <Tooltip isAnimationActive={false} formatter={tooltipFormatter} cursor={false} />
                    {showLegend && <Legend />}
                </ChartComponent>
            </ResponsiveContainer>
        );
    }
}

Graph.propTypes = {
    /**
     * charts configuration (see class description for format details)
     */
    charts: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            label: PropTypes.string,
            axisLabel: PropTypes.string
        })
    ).isRequired,

    /**
     * data charts input data (see class description for the format details)
     */
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

    /**
     * graph chart type ({@link Graph.LINE_CHART_TYPE}, {@link Graph.BAR_CHART_TYPE} or {@link Graph.AREA_CHART_TYPE})
     */
    type: PropTypes.string.isRequired,

    /**
     * function to be called on graph click
     */
    onClick: PropTypes.func,

    /**
     * should show legend
     */
    showLegend: PropTypes.bool,

    /**
     * syncId to sync tooltip position (see recharts documentation for details)
     */
    syncId: PropTypes.string,

    /**
     * callback function to format the text of the tooltip
     */
    tooltipFormatter: PropTypes.func,

    /**
     * stylesheet for X-axis tick
     */
    xAxisTick: PropTypes.shape({}),

    /**
     * X-axis key name, must match key in data object
     */
    xDataKey: PropTypes.string,

    /**
     * whether to allow decimals in Y-axis tick
     */
    yAxisAllowDecimals: PropTypes.bool,

    /**
     * format of Y-axis tick label
     */
    yAxisDataFormatter: PropTypes.func,

    /**
     * stylesheet for Y-axis tick
     */
    yAxisTick: PropTypes.shape({})
};

Graph.defaultProps = {
    onClick: _.noop,
    showLegend: true,
    syncId: '',
    tooltipFormatter: _.noop,
    xAxisTick: { fontSize: '10px' },
    xDataKey: Graph.DEFAULT_X_DATA_KEY,
    yAxisAllowDecimals: true,
    yAxisDataFormatter: _.noop,
    yAxisTick: { fontSize: '10px' }
};
