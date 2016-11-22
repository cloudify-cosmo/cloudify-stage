/**
 * Created by pawelposel on 21/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import { BarChart } from 'rd3';

export default class StageBarChart extends Component {

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    render() {
        return <BarChart {...this.props}/>
    }
}
 