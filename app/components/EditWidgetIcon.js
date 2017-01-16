/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetIcon extends Component {
    static propTypes = {
        widgetId: PropTypes.string.isRequired,
        onShowConfig: PropTypes.func.isRequired
    };

    render() {
        return (
            <i className="setting link icon small editWidgetIcon" onClick={(event)=> {event.stopPropagation(); this.props.onShowConfig();}}/>
        );
    }
}
