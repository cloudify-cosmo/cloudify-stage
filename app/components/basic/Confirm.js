/**
 * Created by kinneretzin on 18/10/2016.
 */

import React, { Component, PropTypes } from 'react';

import Modal from './modal/Modal';
import Footer from './modal/ModalFooter';
import Header from './modal/ModalHeader';

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
                <Header>{this.props.title}</Header>
                <Footer>
                    <Footer>
                        <div className="ui cancel basic button">
                            No
                        </div>
                        <div className="ui ok green  button">
                            Yes
                        </div>
                    </Footer>
                </Footer>
            </Modal>

        );
    }
}

