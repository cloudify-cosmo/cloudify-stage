/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component } from 'react';

import AddButton from '../components/AddButton'

export default class AddWidgetButton extends Component {
    componentDidMount () {
        $('.addWidgetBtn').click(()=>{
            $('.addWidgetModal.modal').modal('show');
        });
    }

    render() {
        return (
            <AddButton className='compact addWidgetBtn'>Add Widget</AddButton>
        );
    }
}
