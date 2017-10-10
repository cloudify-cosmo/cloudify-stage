/**
 * Created by kinneretzin on 18/10/2016.
 */

import React, { Component, PropTypes } from 'react';

import {Modal} from 'semantic-ui-react';
import {ApproveButton} from './ModalButtons';

/**
 * Alert is component to present simple message in modal window with OK button.
 *
 * ## Access
 * `Stage.Basic.Alert`
 *
 * ## Usage
 * ```
 * <Alert message='This is the message'
 *        open={true}
 *        onDismiss={()=>{}}/>
 * ```
 */
export default class Alert extends Component {

    static propTypes = {
        open: PropTypes.bool,
        content: PropTypes.string,
        onDismiss: PropTypes.func
    }

    static defaultProps = {
        onDismiss: () => {}
    };

    render() {
        return (
            <Modal open={this.props.open} size="small">
                <Modal.Header>{this.props.content}</Modal.Header>
                <Modal.Actions>
                    <ApproveButton onClick={this.props.onDismiss} content="Ok" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
}

