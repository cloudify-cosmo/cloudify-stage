/**
 * Created by kinneretzin on 30/08/2016.
 */

import React, { Component, PropTypes } from 'react';

import Header from './ModalHeader';
import Footer from './ModalFooter';
import Body from './ModalBody';

export {Header,Footer,Body};

export default class Modal extends Component {
    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        onDeny: PropTypes.func,
        onApprove: PropTypes.func,
        show: PropTypes.bool
    };

    static defaultProps = {
        className: '',
        onDeny: function() {return true;},
        onApprove: function() {return true;},
        show: false
    };

    componentDidMount() {
        this._initModal(this.refs.modalObj);

        $(this.refs.modalObj).modal(this.props.show ? 'show': 'hide');
    }
    componentDidUpdate() {
        $(this.refs.modalObj).modal('refresh');
        $(this.refs.modalObj).modal(this.props.show ? 'show': 'hide');
    }
    componentWillUnmount() {
        $(this.refs.modalObj).modal('destroy');
        $(this.refs.modalObj).remove();
    }

    _initModal(modalObj) {
        var thi$ = this;
        $(modalObj).modal({
            closable  : false,
            onDeny    : function(){
                return thi$.props.onDeny();
            },
            onApprove : function() {
                return thi$.props.onApprove();
            }
        });

    }

    _showModal() {
        $(this.refs.modalObj).modal('show');
    }
    render() {

        var modalBody = null;
        var modalHeader = null;
        var modalFooter = null;

        React.Children.forEach(this.props.children, function(child,index) {
            if (child.type && child.type.name === "ModalBody") {
                modalBody = child;
            } else if (child.type && child.type.name === "ModalHeader") {
                modalHeader = child;
            } else if (child.type && child.type.name === "ModalFooter") {
                modalFooter = child;
            }

        });

        return (
            <div className={"ui modal "+this.props.className} ref='modalObj'>
                {modalHeader}
                {modalBody}
                {modalFooter}
            </div>
        );
    }
}

