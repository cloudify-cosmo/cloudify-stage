import { identity } from 'lodash';
import React from 'react';
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
import type { XAxisProps, YAxisProps } from 'recharts';
import type { CategoricalChartProps } from 'recharts/types/chart/generateCategoricalChart';

export interface GraphProps {
    /**
     * charts configuration (see class description for format details)
     */
    charts: {
        name: string;
        label: string;
        axisLabel: string;
    }[];

    /**
     * data charts input data (see class description for the format details)
     */
    data: Record<string, unknown>[];

    /**
     * graph chart type ({@link Graph.LINE_CHART_TYPE}, {@link Graph.BAR_CHART_TYPE} or {@link Graph.AREA_CHART_TYPE})
     */
    type: typeof Graph.LINE_CHART_TYPE | typeof Graph.BAR_CHART_TYPE | typeof Graph.AREA_CHART_TYPE;

    /**
     * function to be called on graph click
     */
    onClick: React.ComponentProps<typeof LineChart | typeof BarChart | typeof AreaChart>['onClick'];

    /**
     * should show legend
     */
    showLegend?: boolean;

    /**
     * syncId to sync tooltip position (see recharts documentation for details)
     */
    syncId?: CategoricalChartProps['syncId'];

    /**
     * X-axis key name, must match key in data object
     */
    xDataKey?: XAxisProps['dataKey'];

    /**
     * whether to allow decimals in Y-axis tick
     */
    yAxisAllowDecimals?: boolean;

    /**
     * format of Y-axis tick label
     */
    yAxisDataFormatter?: YAxisProps['tickFormatter'];
}

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
 * See {@link test/cypress/components/Graph_spec.tsx}
 *
 */
export default class Graph extends React.Component<GraphProps> {
    /**
     * default X-axis data key
     */
    static DEFAULT_X_DATA_KEY = 'time';

    /**
     * line chart
     */
    static LINE_CHART_TYPE = 'line' as const;

    /**
     * bar chart
     */
    static BAR_CHART_TYPE = 'bar' as const;

    /**
     * area chart
     */
    static AREA_CHART_TYPE = 'area' as const;

    /**
     * maximum number of charts
     */
    static MAX_NUMBER_OF_CHARTS = 5;

    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        onClick: _.noop,
        showLegend: true,
        syncId: '',
        xDataKey: Graph.DEFAULT_X_DATA_KEY,
        yAxisAllowDecimals: true,
        yAxisDataFormatter: identity
    };

    render() {
        const { charts, data, onClick, showLegend, syncId, type, xDataKey, yAxisAllowDecimals, yAxisDataFormatter } =
            this.props;
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

        const chartElements: JSX.Element[] = [];
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
                // @ts-ignore There's invalid typing in recharts as it works properly
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
                    <Tooltip isAnimationActive={false} cursor={false} />
                    {showLegend && <Legend />}
                </ChartComponent>
            </ResponsiveContainer>
        );
    }
}
