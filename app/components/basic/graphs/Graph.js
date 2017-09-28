/**
 * Created by jakubniezgoda on 16/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import {LineChart, Line, BarChart,  Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,Brush} from 'recharts';
import {format as d3format} from 'd3-format';

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
 * ## Access
 * `Stage.Basic.Graphs.Graph`
 *
 * ## Usage
 *
 * ### Bar chart
 * ![Graph 0](manual/asset/graphs/Graph_0.png)
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
 * ![Graph 1](manual/asset/graphs/Graph_1.png)
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
 * ![Graph 2](manual/asset/graphs/Graph_2.png)
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
 * ![Graph 3](manual/asset/graphs/Graph_3.png)
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
 * ![Graph 4](manual/asset/graphs/Graph_4.png)
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

    /**
     * propTypes
     * @property {object[]} data charts input data (see class description for the format details)
     * @property {string} type graph chart type ({@link Graph.LINE_CHART_TYPE}, {@link Graph.BAR_CHART_TYPE} or {@link Graph.AREA_CHART_TYPE})
     * @property {object[]} charts charts configuration (see class description for format details)
     * @property {string} [xDataKey=Graph.DEFAULT_X_DATA_KEY] X-axis key name, must match key in data object
     * @property {boolean} [showXAxis=true] should show X-axis
     * @property {boolean} [showYAxis=true] should show Y-axis
     * @property {boolean} [showBrush=false] should show brush (zoom)
     * @property {boolean} [showTooltip=true] should show tooltip on line
     * @property {boolean} [showLegend=true] should show legend
     * @property {string} [dataTimeFormat=undefined] input date format, by default not specified
     * @property {string} [xAxisTimeFormat='DD-MM-YYYY HH:mm'] format of X-axis tick label
     * @property {object} [xAxisTick={fontSize:'10px'}] stylesheet for X-axis tick
     * @property {object} [yAxisTick={fontSize:'10px'}] stylesheet for Y-axis tick
     */
    static propTypes = {
        data: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
        charts: PropTypes.array.isRequired,
        xDataKey: PropTypes.string
    };

    static defaultProps = {
        xDataKey: Graph.DEFAULT_X_DATA_KEY,
        showXAxis: true,
        showYAxis: true,
        showBrush: false,
        showTooltip: true,
        showLegend: true,
        dataTimeFormat: undefined,
        xAxisTimeFormat: 'DD-MM-YYYY HH:mm',
        xAxisTick: {fontSize:'10px'},
        yAxisTick: {fontSize:'10px'}
    };

    render () {
        const CHART_COMPONENTS = { [Graph.LINE_CHART_TYPE] : LineChart, [Graph.BAR_CHART_TYPE] : BarChart, [Graph.AREA_CHART_TYPE] : AreaChart};
        const DRAWING_COMPONENTS = { [Graph.LINE_CHART_TYPE] : Line, [Graph.BAR_CHART_TYPE] : Bar, [Graph.AREA_CHART_TYPE] : Area};
        const COLORS = ['#000069', '#28aae1', '#f4773c', '#21ba45', '#af41f4'];

        const VALUE_FORMATTER = d3format('.3s');
        const MARGIN = {top: 5, right: 30, left: 20, bottom: 5};
        const INTERPOLATION_TYPE = 'monotone';
        const STROKE_DASHARRAY = '3 3';


        // Code copied from re-charts GitHub, see: https://github.com/recharts/recharts/issues/184
        const AxisLabel = ({ vertical, x, y, width, height, children, fill }) => {
            const CX = vertical ? x + 20 : x + (width / 2) + 10;
            const CY = vertical ? (height / 2) : y + height + 20;
            const ROTATION = vertical ? `270 ${CX} ${CY}` : 0;
            const STYLE = {fill: fill, stroke: fill};
            return (
                <text x={CX} y={CY} transform={`rotate(${ROTATION})`} textAnchor="middle" style={STYLE}>
                    {children}
                </text>
            );
        };

        let ChartComponent = CHART_COMPONENTS[this.props.type];
        let DrawingComponent = DRAWING_COMPONENTS[this.props.type];

        var chartElements = [];
        var index = 0;
        _.each(_.slice(this.props.charts, 0, Graph.MAX_NUMBER_OF_CHARTS), (chart)  => {
            if (chart.fieldNames) {
                if (this.props.showYAxis) {
                    chartElements.push(
                        <YAxis key={'yaxis'+chart.name}
                               padding={{top:10}}
                               width={chart.axisLabel ? 50 : 25}
                               tickFormatter={VALUE_FORMATTER}
                               tick={this.props.yAxisTick}
                               label={<AxisLabel vertical>{chart.axisLabel}</AxisLabel>} />
                    );
                }

                _.each(chart.fieldNames,(field)=>{
                    var COLOR = COLORS[index++];
                    chartElements.push(
                        <DrawingComponent key={field}
                                          isAnimationActive={false}
                                          name={field}
                                          type={INTERPOLATION_TYPE}
                                          dataKey={field}
                                          stroke={COLOR}
                                          fill={COLOR}
                                          fillOpacity={0.3}
                                          dot={false}/>
                    );
                });

            } else {
                var COLOR = COLORS[index++];
                var STYLE = {stroke: COLOR};

                chartElements.push(
                    <YAxis key={'yaxis'+chart.name}
                           dataKey={chart.name}
                           yAxisId={chart.name}
                           width={50}
                           axisLine={STYLE}
                           tick={STYLE}
                           tickLine={STYLE}
                           tickFormatter={VALUE_FORMATTER}
                           label={<AxisLabel vertical fill={COLOR}>{chart.axisLabel}</AxisLabel>} />
                );

                chartElements.push(
                    <DrawingComponent key={chart.name}
                                      isAnimationActive={false}
                                      name={chart.label}
                                      type={INTERPOLATION_TYPE}
                                      dataKey={chart.name}
                                      stroke={COLOR}
                                      fillOpacity={0.3}
                                      fill={COLOR}
                                      yAxisId={chart.name} />
                );
            }
        });

        var xAxisDataFormatter = (value) => {
            return Stage.Utils.formatLocalTimestamp(value, this.props.xAxisTimeFormat, this.props.dataTimeFormat)
        };

        return (
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={this.props.data} margin={MARGIN}
                                syncId={this.props.syncId}
                                onClick={this.props.onClick}>
                    {chartElements}
                    <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                    {this.props.showXAxis && <XAxis dataKey={this.props.xDataKey} tickFormatter={xAxisDataFormatter} tick={this.props.xAxisTick}/> }
                    {this.props.showTooltip && <Tooltip isAnimationActive={false} formatter={VALUE_FORMATTER} labelFormatter={xAxisDataFormatter}/>}
                    {this.props.showLegend && <Legend />}
                    {this.props.showBrush &&  <Brush />}
                </ChartComponent>
            </ResponsiveContainer>
        );
    }
};
