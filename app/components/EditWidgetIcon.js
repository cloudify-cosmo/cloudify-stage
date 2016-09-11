/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component } from 'react';

import EditIcon from '../components/EditIcon'

export default class EditWidgetIcon extends Component {
    componentDidMount () {
        $('.editWidgetIcon')
        .click(function(){
          $('.editWidgetModal.modal').modal('show');
          });    }

    render() {
        return (
            <EditIcon className='compact editWidgetIcon'/>
        );
    }
}
