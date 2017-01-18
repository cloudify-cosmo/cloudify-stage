'use strict';

import React, { Component, PropTypes } from 'react';

class ModalButton extends Component {

    static propTypes = {
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        icon: '',
        className: ''
    };

    render () {
        return (
            <button className={`ui ${this.props.className} button`}>
                {this.props.icon && <i className={`${this.props.icon} icon`}></i>}
                {this.props.label}
            </button>
        );
    }
}

export class ApproveButton extends Component {

    static propTypes = {
        label: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        label: 'Save',
        icon: 'checkmark',
        className: 'basic'
    };

    render () {
        return (
            <ModalButton label={this.props.label} icon={this.props.icon} className={`ok ${this.props.className}`}/>
        );
    }
}

export class CancelButton extends Component {

    static propTypes = {
        label: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        label: 'Cancel',
        icon: 'remove',
        className: 'basic'
    };

    render () {
        return (
            <ModalButton label={this.props.label} icon={this.props.icon}  className={`cancel ${this.props.className}`}/>
        );
    }
}