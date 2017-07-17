/**
 * Created by kinneretzin on 14/02/2017.
 */

import React, { Component, PropTypes } from 'react';

function deg2rad(deg) {
    return deg * Math.PI / 180;
}

/**
 * Gauge is a component to present value in graphical form
 *
 * ## Access
 * `Stage.Basic.Graphs.Gauge`
 *
 * ## Usage
 *
 * ### Gauge with default angles
 * ![Gauge 0](manual/asset/graphs/Gauge_0.png)
 *
 * ```
 * <Gauge value={10} min={0} max={20} high={15} low={5} />
 * ```
 *
 * ### Gauge with defined angles and value below low marker
 * ![Gauge 1](manual/asset/graphs/Gauge_1.png)
 *
 * ```
 * <Gauge minAngle={-90} maxAngle={0} value={3} min={0} max={20} high={15} low={5} />
 * ```
 *
 * ### Gauge with defined angles and value above high marker
 * ![Gauge 2](manual/asset/graphs/Gauge_2.png)
 *
 * ```
 * <Gauge minAngle={-45} maxAngle={90} value={18} min={0} max={20} high={15} low={5} />
 * ```
 *
 */
export default class Gauge extends Component {

    /**
     * propTypes
     * @property {number} value actual value to be marked on the gauge
     * @property {number} min minimal value to be presented
     * @property {number} max maximum value to be presented
     * @property {number} [high] value above which the colour of the gauge bar changes to green
     * @property {number} [low] value below which the colour of the gauge bar changes to red
     * @property {number} [minAngle=-90] minimum angle of the gauge chart, associated with minimum value
     * @property {number} [maxAngle=90] maximum angle of the gauge chart, associated with maximum value
     */
    static propTypes = {
        value: PropTypes.number.isRequired,
        min : PropTypes.number.isRequired,
        max : PropTypes.number.isRequired,
        high : PropTypes.number,
        low : PropTypes.number,
        minAngle: PropTypes.number,
        maxAngle: PropTypes.number
    };

    static defaultProps = {
        minAngle: -90,
        maxAngle: 90
    };

    _buildProps (svgComponent) {
        var width = svgComponent.clientWidth;
        var height = svgComponent.clientHeight;

        // Calc radius
        var radius = width/2;
        if (height < radius) {
            radius = height;
        }

        radius *=0.93; // Leave room for the last tick that goes under the graph

        var range = this.props.maxAngle - this.props.minAngle;

        // Calculate ring size
        var ringWidth = radius * 0.4;

        var valueRange = this.props.max - this.props.min;

        var valRatio = (this.props.value - this.props.min) / valueRange;
        valRatio = valRatio < 0 ? 0 : (valRatio > 1 ? 1 : valRatio);


        var isHigh = this.props.high  && this.props.value > this.props.high;
        var isLow = this.props.low && this.props.value < this.props.low;

        var textSize = (radius - ringWidth) * 0.8;
        var tickTextSize = ringWidth * 0.15 ;
        var arcPadding = tickTextSize;

        return {
            radius,
            range,
            ringWidth,
            valueRange,
            valRatio,
            isHigh,
            isLow,
            arcPadding,
            value:this.props.value,
            minAngle:this.props.minAngle,
            maxAngle: this.props.maxAngle,
            ticksNumber:7,
            minValue : this.props.min,
            maxValue: this.props.max,
            textSize,
            tickTextSize
        }
    }

    componentDidMount() {
        this._initGauge(this.refs.svg);
        $(window).resize(()=>this._initGauge(this.refs.svg));
    }

    componentWillUnmount() {
        $(window).off('resize');
    }

    componentDidUpdate() {
        setTimeout(()=>{
            this._initGauge(this.refs.svg);
        },100);
    }

    _initGauge (svgComponent) {

        if (svgComponent === null) return;

        var opts = this._buildProps(svgComponent);

        var svg = d3.select(svgComponent);

        // First clear everything
        svg.selectAll('*').remove();


        // Make sure the svg width contains the gauge and it only (so there wont be some widths mess up)
        svg.attr('width',opts.radius*2);

        // Define the 2 arcs (one for the filled area and one for the non-filled area
        var arcBackground = d3.svg.arc()
            .innerRadius(opts.radius - opts.ringWidth - opts.arcPadding)
            .outerRadius(opts.radius - opts.arcPadding)
            .startAngle(deg2rad(opts.minAngle + opts.valRatio*opts.range))
            .endAngle(deg2rad(opts.maxAngle));

        var arcValue = d3.svg.arc()
            .innerRadius(opts.radius - opts.ringWidth - opts.arcPadding)
            .outerRadius(opts.radius - opts.arcPadding)
            .startAngle(deg2rad(opts.minAngle))
            .endAngle(deg2rad(opts.minAngle + opts.valRatio*opts.range));

        // Create the arcs container
        var arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate('+opts.radius +','+ opts.radius +')');

        // Draw the arcs
        arcs.append('path')
            .attr('class','arcBackground backgroundColor')
            .attr('d',arcBackground);

        arcs.append('path')
            .attr('class','arcValue')
            .classed('highColor',opts.isHigh)
            .classed('lowColor',opts.isLow)
            .classed('okColor', !opts.isLow && !opts.isHigh)
            .attr('d',arcValue);

        // Draw the ticks
         var scale = d3.scale.linear()
         .range([0,1])
         .domain([opts.minValue, opts.maxValue]);

         var ticks = scale.ticks(opts.ticksNumber);
        var ticksContainer= svg.append('g')
            .attr('class', 'ticks')
            .attr('transform', 'translate('+opts.radius +','+ opts.radius +')');

        ticksContainer.selectAll('text')
            .data(ticks)
            .enter().append('text')
            .attr('transform', function(d) {
                var ratio = scale(d);
                var newAngle = opts.minAngle + (ratio * opts.range);
                return 'rotate(' +newAngle +') translate(0,' +(-opts.radius + opts.arcPadding - 3) +')';
            })
            .attr('font-size',opts.tickTextSize)
            .text(d=>d);

        // Draw the text
        svg.append('text')
            .attr('class','valueText')
            .attr('transform', 'translate('+opts.radius +','+ opts.radius +')')
            .attr('text-anchor','middle')
            .attr('font-size',opts.textSize)
            .text(opts.value);
    }

    render () {
        return (
            <div className='gaugeContainer'>
                <svg className='gauge' ref='svg'/>
            </div>
        );
    }
};
