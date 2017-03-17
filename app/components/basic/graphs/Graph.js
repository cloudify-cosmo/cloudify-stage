/**
 * Created by jakubniezgoda on 13/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Charts, ChartContainer, ChartRow, Resizable, YAxis, LineChart, BarChart } from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';

export default class Graph extends Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            tracker: null,
            width: 0,
            height: 200,
        }
    };

    static propTypes = {
        data: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        column: PropTypes.string.isRequired,
        min: PropTypes.number,
        max: PropTypes.number
    };

    static defaultProps = {

    };

    static LINE_CHART_TYPE = 'line';
    static BAR_CHART_TYPE = 'bar';

    componentDidMount() {
        let elementResizeDetector = require('element-resize-detector')();
        let _this = this;

        elementResizeDetector.listenTo(this.refs.container, (element) => {
            _this.setState({
                width: element.offsetWidth
            })
        });
    }

    handleTrackerChanged(t) {
        this.setState({tracker: t});
    }

    render () {
        let timeseries = new TimeSeries(this.props.data);
        let min = _.isEmpty(this.props.min) ? timeseries.min(this.props.column) : this.props.min;
        let max = _.isEmpty(this.props.max) ? timeseries.max(this.props.column) : this.props.max;

        let {Label} = Stage.Basic;

        return (
            <div ref="container">
                {
                    !_.isNull(this.state.tracker) ? <Label>{_.toString(moment(this.state.tracker).format("YYYY-MM-DD HH:mm:ss"))}</Label> : <Label>No tracker</Label>
                }
                <ChartContainer timeRange={timeseries.timerange()}
                                /*trackerPosition={this.state.tracker}
                                onTrackerChanged={this.handleTrackerChanged.bind(this)}*/
                                width={this.state.width}>
                    <ChartRow height={this.state.height}>
                        <YAxis id={this.props.column} label={this.props.label} min={min} max={max} width="50" type="linear"/>
                        <Charts>
                            {
                                this.props.type === Graph.LINE_CHART_TYPE
                                ? <LineChart axis={this.props.column} columns={[this.props.column]} series={timeseries}/>
                                : <BarChart axis={this.props.column} spacing={1} columns={[this.props.column]} series={timeseries}/>
                            }
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </div>
        );
    }
};
