/**
 * Created by kinneretzin on 18/10/2016.
 */

import React, { Component } from 'react';

import { Confirm } from 'semantic-ui-react';

export default class ConfirmWrapper extends Component {

    render() {
        return (
            <Confirm {...this.props} confirmButton='Yes' cancelButton='No' className='confirmModal' />
        );
    }
}

