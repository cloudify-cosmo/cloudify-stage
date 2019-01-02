/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ResourceStatus extends Component {

    static unknown = 0;
    static noActionRequired = 1;
    static actionRequired = 2;
    static errorOccurred = 3;

    static propTypes = {
        status: PropTypes.oneOf([
            ResourceStatus.unknown,
            ResourceStatus.noActionRequired,
            ResourceStatus.actionRequired,
            ResourceStatus.errorOccurred]).isRequired,
        text: PropTypes.string.isRequired
    };

    shouldComponentUpdate(nextProps) {
        return this.props.status !== nextProps.status
            || this.props.text !== nextProps.text;
    }

    render() {
        let {Icon, Popup} = Stage.Basic;

        let status = this.props.status;
        let statusIcon = null;
        let statusText = this.props.text;

        switch (status) {
            case ResourceStatus.unknown:
                statusIcon = <Icon name='question' color='grey' size='big' />;
                break;
            case ResourceStatus.noActionRequired:
                statusIcon = <Icon name='check' color='green' size='big' />;
                break;
            case ResourceStatus.actionRequired:
                statusIcon = <Icon name='warning' color='yellow' size='big' />;
                break;
            case ResourceStatus.errorOccurred:
            default:
                statusIcon = <Icon name='cancel' color='red' size='big' />;
                break;
        }

        return <Popup hoverable trigger={statusIcon} header='Status' content={statusText} />;
    }
}