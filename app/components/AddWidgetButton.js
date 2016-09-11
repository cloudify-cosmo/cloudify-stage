/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component } from 'react';

import AddButton from '../components/AddButton'

export default class AddWidgetButton extends Component {
    componentDidMount () {
        $('.addWidgetBtn')
            .popup({
                transition: 'vertical flip',
                popup: '.addWidgetPopup',
                on: 'click',
                position: 'bottom left'
            })
        ;
    }

    render() {
        return (
            <AddButton className='compact addWidgetBtn'>Add Widget</AddButton>
        );
    }
}
