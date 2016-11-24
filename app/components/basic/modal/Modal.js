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
        show: PropTypes.bool,
        loading: PropTypes.bool
    };

    static defaultProps = {
        className: '',
        onDeny: function() {return true;},
        onApprove: function() {return true;},
        show: false,
        loading: false
    };

    componentDidUpdate() {
        if (this.props.show) {
            var thi$ = this;
            $(this.refs.modalObj).modal({
                closable: false,
                observeChanges: true,
                onDeny: function () {
                    return thi$.props.onDeny();
                },
                onApprove: function () {
                    return thi$.props.onApprove();
                }
            }).modal('show');
        } else {
            $(this.refs.modalObj).modal("hide");
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
            <div>
                <div className={"ui modal "+this.props.className} ref='modalObj'>
                    {modalHeader}
                    {modalBody}
                    {modalFooter}
                </div>
            </div>
        );
    }
}

