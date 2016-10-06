/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetIcon extends Component {
    static propTypes = {
        widgetId: PropTypes.string.isRequired
    };

    componentDidMount () {
//        $('.editWidgetIcon').click(()=>{
//            $('#editWidgetModal-'+this.props.widgetId).modal('show');
//        });
    }

    render() {
        return (
            <i className="setting link icon small editWidgetIcon" onClick={()=> $('#editWidgetModal-'+this.props.widgetId).modal('show')}/>
        );
    }
}
