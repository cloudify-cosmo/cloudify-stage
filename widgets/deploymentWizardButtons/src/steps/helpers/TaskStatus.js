/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TaskStatus extends Component {

    static pending = 0;
    static inProgress = 1;
    static finished = 2;
    static failed = 3;

    static propTypes = {
        name: PropTypes.string.isRequired,
        status: PropTypes.oneOf([
            TaskStatus.pending,
            TaskStatus.inProgress,
            TaskStatus.finished,
            TaskStatus.failed]).isRequired,
        error: PropTypes.string
    };

    getStatusIcon() {
        let {Icon} = Stage.Basic;
        let iconProps = {
            color: '',
            loading: false,
            name: ''
        };

        switch (this.props.status) {
            case TaskStatus.pending:
                iconProps.color = 'black';
                iconProps.name = 'clock';
                break;
            case TaskStatus.inProgress:
                iconProps.color = 'grey';
                iconProps.loading = true;
                iconProps.name = 'spinner';
                break;
            case TaskStatus.finished:
                iconProps.color = 'green';
                iconProps.name = 'check';
                break;
            case TaskStatus.failed:
                iconProps.color = 'red';
                iconProps.name = 'remove';
                break;
        }

        return <Icon {...iconProps} />
    }

    getStatusText() {
        const {error, status} = this.props;
        let statusText = '';
        let errorText = !!error
            ? <em>{error}</em>
            : null;

        switch (status) {
            case TaskStatus.pending:
                statusText = 'Pending.';
                break;
            case TaskStatus.inProgress:
                statusText = 'In progress.';
                break;
            case TaskStatus.finished:
                statusText = 'Finished successfully.';
                break;
            case TaskStatus.failed:
                statusText = 'Failed with error: ';
                break;
        }

        return (
            <React.Fragment>
                <strong>{statusText}</strong>{errorText}
            </React.Fragment>
        );
    }

    render() {
        const name = this.props.name;
        const statusIcon = this.getStatusIcon();
        const statusText = this.getStatusText();

        return <span>{name}... {statusIcon} {statusText}</span>
    }
}
