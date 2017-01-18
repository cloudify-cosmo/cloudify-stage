/**
 * Created by kinneretzin on 18/10/2016.
 */

import React, { Component, PropTypes } from 'react';

import Modal from './modal/Modal';

export default class Confirm extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        className: PropTypes.string,
        onConfirm: PropTypes.func,
        show: PropTypes.bool
    };

    static defaultProps = {
        className: '',
        onConfirm: function() {return true;},
        onCancel: function() {return true;},
        show: false
    };

    render() {
        return (
            <Modal className={this.props.className} onApprove={this.props.onConfirm} onDeny={this.props.onCancel} show={this.props.show}>
                <Modal.Header>{this.props.title}</Modal.Header>
                <Modal.Footer>
                    <Modal.Cancel label="No" icon=""/>
                    <Modal.Approve label="Yes" className="green" icon=""/>
                </Modal.Footer>
            </Modal>

        );
    }
}

