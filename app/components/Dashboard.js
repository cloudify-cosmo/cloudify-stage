/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddWidgetButton from '../containers/AddWidgetButton';
import Widgets from '../containers/Widgets';

export default class Dashboard extends Component {
    render() {
        return (
            <div className="pusher">
                <AddWidgetButton/>
                <div className='ui divider'/>
                <Widgets/>
            </div>
        );
    }
}
