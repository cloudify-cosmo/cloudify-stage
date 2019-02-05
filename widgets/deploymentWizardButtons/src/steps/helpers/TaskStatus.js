/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import Task from './Task';

export default class TaskStatus extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        status: PropTypes.oneOf([
            Task.Status.pending,
            Task.Status.inProgress,
            Task.Status.finished,
            Task.Status.failed]).isRequired,
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
            case Task.Status.pending:
                iconProps.color = 'black';
                iconProps.name = 'clock';
                break;
            case Task.Status.inProgress:
                iconProps.color = 'grey';
                iconProps.loading = true;
                iconProps.name = 'spinner';
                break;
            case Task.Status.finished:
                iconProps.color = 'green';
                iconProps.name = 'check';
                break;
            case Task.Status.failed:
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
            case Task.Status.pending:
                statusText = 'Pending.';
                break;
            case Task.Status.inProgress:
                statusText = 'In progress.';
                break;
            case Task.Status.finished:
                statusText = 'Finished successfully.';
                break;
            case Task.Status.failed:
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
