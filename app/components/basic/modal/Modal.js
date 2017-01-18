/**
 * Created by kinneretzin on 30/08/2016.
 */

import React, { Component, PropTypes } from 'react';

import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import ModalBody from './ModalBody';
import {ApproveButton, CancelButton} from './ModalButton';

export default class Modal extends Component {

    static Header = ModalHeader;
    static Body = ModalBody;
    static Footer = ModalFooter;
    static Approve = ApproveButton;
    static Cancel = CancelButton;

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        onDeny: PropTypes.func,
        onApprove: PropTypes.func,
        onVisible: PropTypes.func,
        show: PropTypes.bool,
        loading: PropTypes.bool
    };

    static defaultProps = {
        className: '',
        onDeny: ()=>{return true;},
        onApprove: ()=>{return true;},
        onVisible: ()=>{},
        show: false,
        loading: false
    };

    componentDidUpdate() {
        if (this.props.show) {
            var thi$ = this;
            $(this.refs.modalObj).modal({
                closable: false,
                observeChanges: true,
                onDeny: ()=>{ return thi$.props.onDeny() },
                onApprove: ()=>{ return thi$.props.onApprove() },
                onVisible: ()=>{ thi$.props.onVisible(this.refs.modalObj) }
            }).modal('show');
        } else {
            //Protection against useless modal initializing -> any .modal() execution including "hide" creates dimmer and rebind the content to it
            if ($(this.refs.modalObj).parent(".dimmer").length > 0) {
                $(this.refs.modalObj).modal("hide");
            }
        }
    }

    componentWillUnmount() {
        $(this.refs.modalObj)
            .modal('hide')
            .modal('destroy')
            .remove();
    }

    render() {
        var modalBody = null;
        var modalHeader = null;
        var modalFooter = null;

        var self = this;
        React.Children.forEach(this.props.children, function(child,index) {
            if (child.type && child.type.name === "ModalBody") {
                modalBody = React.cloneElement(child, {loading:self.props.loading});
            } else if (child.type && child.type.name === "ModalHeader") {
                modalHeader = child;
            } else if (child.type && child.type.name === "ModalFooter") {
                modalFooter = React.cloneElement(child, {loading:self.props.loading});;
            }
        });

        return (
            <div style={{display:'none'}}>
                <div className={"ui modal "+this.props.className} ref='modalObj'>
                    {modalHeader}
                    {modalBody}
                    {modalFooter}
                </div>
            </div>
        );
    }
}