/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class PagesList extends Component {

    static propTypes = {
        widgets: PropTypes.array.isRequired
    };

    render() {
        return (
            <div className="ui grid">
                {
                    this.props.widgets.map(function(widget){
                        return (
                            <div key={widget.id} className='four wide column'>
                                <div className='ui segment red'>
                                    {widget.name}
                                </div>
                            </div>
                            )
                    },this)
                }
            </div>
        );
    }
}

