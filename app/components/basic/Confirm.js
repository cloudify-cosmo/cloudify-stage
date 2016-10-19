/**
 * Created by kinneretzin on 18/10/2016.
 */

import React, { Component, PropTypes } from 'react';

import Modal from './Modal';
import Footer from './ModalFooter';
import Header from './ModalHeader';

export default class Confirm extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onConfirm: PropTypes.func,
        show: PropTypes.bool
    };

    static defaultProps = {
        onConfirm: function() {return true;},
        onCancel: function() {return true;},
        show: false
    };

    render() {
        return (
            <Modal onApprove={this.props.onConfirm} onDeny={this.props.onCancel} show={this.props.show}>
                <Header>{this.props.title}</Header>
                <Footer>
                    <Footer>
                        <div className="ui cancel basic button">
                            <i className="icon"></i>
                            No
                        </div>
                        <div className="ui ok green  button">
                            <i className="icon"></i>
                            Yes
                        </div>
                    </Footer>
                </Footer>
            </Modal>

        );
    }
}

