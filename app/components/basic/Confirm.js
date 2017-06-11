/**
 * Created by kinneretzin on 18/10/2016.
 */

import React, { Component } from 'react';

import { Confirm } from 'semantic-ui-react';

export default class ConfirmWrapper extends Component {

    static defaultProps = {
        className: ""
    };

    render() {
        const {confirmButton, cancelButton, className, ...rest} = this.props;

        return (
            <Confirm {...rest} confirmButton={confirmButton?confirmButton:'Yes'}
                               cancelButton={cancelButton?cancelButton:'No'}
                               className={`confirmModal ${className}`}/>
        );
    }
}

