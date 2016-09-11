/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddWidget from '../containers/AddWidget';
import WidgetsList from './WidgetsList';

export default class Page extends Component {
    static propTypes = {
        page: PropTypes.object.isRequired
    }

    render() {
        return (
            <div className="">
                <h3 className='ui header dividing'>
                    {this.props.page.name}
                </h3>
                <AddWidget pageId={this.props.page.id}/>

                <WidgetsList widgets={this.props.page.widgets}/>

            </div>
        );
    }
}
