/**
 * Created by jakubniezgoda on 16/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

export default class RechartGraph extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        xDataKey: PropTypes.string.isRequired,
        yDataKey: PropTypes.string.isRequired,
        min: PropTypes.number,
        max: PropTypes.number
    };

    static defaultProps = {

    };

    static LINE_CHART_TYPE = 'line';
    static BAR_CHART_TYPE = 'bar';

    render () {
        const MARGIN = {top: 5, right: 30, left: 20, bottom: 5};
        const COLOR = "#8884d8";
        const INTERPOLATION_TYPE = "monotone";
        const STROKE_DASHARRAY = "3 3";

        return (
            <ResponsiveContainer width="100%" height="100%">
                {
                    this.props.type == RechartGraph.LINE_CHART_TYPE
                    ?
                        <LineChart data={this.props.data}
                                   margin={MARGIN}>
                            <XAxis dataKey={this.props.xDataKey} />
                            <YAxis />
                            <CartesianGrid strokeDasharray={STROKE_DASHARRAY} />
                            <Tooltip />
                            <Legend />
                            <Line isAnimationActiveBoolean={false} name={this.props.label} type={INTERPOLATION_TYPE}
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
                            <Bar isAnimationActiveBoolean={false} name={this.props.label}
                                 dataKey={this.props.yDataKey} fill={COLOR} />
                        </BarChart>
                }
            </ResponsiveContainer>
        );
    }
};
