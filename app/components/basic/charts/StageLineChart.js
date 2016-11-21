/**
 * Created by pawelposel on 21/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import { LineChart } from 'rd3';

export default class StageLineChart extends Component {

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    render() {
        return <LineChart {...this.props}/>
    }
}
 