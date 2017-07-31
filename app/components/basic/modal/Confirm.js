/**
 * Created by kinneretzin on 18/10/2016.
 */

import React, { Component } from 'react';

import { Confirm as ConfirmSemanticUiReact } from 'semantic-ui-react';

/**
 * Confirm is a wrapper component to present simple Yes/No confirmation modal window.
 *
 * It wraps [Semantic UI-React's Confirm component](https://react.semantic-ui.com/addons/confirm),
 * so all properties of that component (eg. content, header, ...) can be used here.
 *
 * ## Access
 * `Stage.Basic.Confirm`
 *
 * ## Usage
 * ![Confirm](manual/asset/modals/Confirm_0.png)
 * ```
 * <Confirm content='Are you sure you want to remove this blueprint?'
 *          open={true}
 *          onConfirm={()=>{}}
 *          onCancel={()=>{}} />
 * ```
 */
export default class Confirm extends Component {

    static defaultProps = {
        className: ''
    };

    render() {
        const {confirmButton, cancelButton, className, ...rest} = this.props;

        return (
            <ConfirmSemanticUiReact {...rest} confirmButton={confirmButton?confirmButton:'Yes'}
                                    cancelButton={cancelButton?cancelButton:'No'}
                                    className={`confirmModal ${className}`}/>
        );
    }
}

