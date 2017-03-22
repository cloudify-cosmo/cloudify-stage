/**
 * Created by jakubniezgoda on 16/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

export default class Graph extends Component {

    static DEFAULT_X_DATA_KEY = 'time';
    static LINE_CHART_TYPE = 'line';
    static BAR_CHART_TYPE = 'bar';

    static propTypes = {
        data: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
        yDataKey: PropTypes.string.isRequired,
        xDataKey: PropTypes.string,
        label: PropTypes.string
    };

    static defaultProps = {
        xDataKey: Graph.DEFAULT_X_DATA_KEY
    };

    render () {
        const MARGIN = {top: 5, right: 30, left: 20, bottom: 5};
        const COLOR = "#8884d8";
        const INTERPOLATION_TYPE = "monotone";
        const STROKE_DASHARRAY = "3 3";

        let label = this.props.label || this.props.yDataKey;

        return (
            <ResponsiveContainer width="100%" height="100%">
                {
                    this.props.type == Graph.LINE_CHART_TYPE
                    ?
                        <LineChart data={this.props.data}
                                   margin={MARGIN}>
                            <XAxis dataKey={this.props.xDataKey} />
                            <YAxis />
                            <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                            <Tooltip />
                            <Legend />
                            <Line isAnimationActive={false} name={label} type={INTERPOLATION_TYPE}
                                  dataKey={this.props.yDataKey} stroke={COLOR} />
                        </LineChart>
                    :
                        <BarChart data={this.props.data}
                                  margin={MARGIN}>
                            <XAxis dataKey={this.props.xDataKey} />
                            <YAxis />
                            <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                            <Tooltip />
                            <Legend />
                            <Bar isAnimationActive={false} name={label}
                                 dataKey={this.props.yDataKey} fill={COLOR} />
                        </BarChart>
                }
            </ResponsiveContainer>
        );
    }
};
