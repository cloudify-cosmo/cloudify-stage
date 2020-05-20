/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import Task from './Task';

export default class TaskStatus extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        status: PropTypes.oneOf([Task.Status.pending, Task.Status.inProgress, Task.Status.finished, Task.Status.failed])
            .isRequired,
        error: PropTypes.string
    };

    getStatusIcon() {
        const { Icon } = Stage.Basic;
        const iconProps = {
            color: '',
            loading: false,
            name: ''
        };

        const { status } = this.props;
        switch (status) {
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

        return <Icon {...iconProps} />;
    }

    getStatusText() {
        const { error, status } = this.props;
        let statusText = '';
        const errorText = error ? <em>{error}</em> : null;

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
            <>
                <strong>{statusText}</strong>
                {errorText}
            </>
        );
    }

    render() {
        const { name } = this.props;
        const statusIcon = this.getStatusIcon();
        const statusText = this.getStatusText();

        return (
            <span>
                {name}... {statusIcon} {statusText}
            </span>
        );
    }
}
