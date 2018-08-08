/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const installStepId = 'install';

class TaskStatus extends Component {

    static notStarted = 0;
    static inProgress = 1;
    static finished = 2;
    static failed = 3;

    static propTypes = {
        name: PropTypes.string.isRequired,
        status: PropTypes.oneOf([TaskStatus.notStarted, TaskStatus.inProgress, TaskStatus.finished, TaskStatus.failed]).isRequired,
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
            case TaskStatus.notStarted:
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
            case TaskStatus.notStarted:
                statusText = 'Not started.';
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

class TaskStatusList extends Component {
    static propTypes = {
        list: PropTypes.arrayOf(PropTypes.shape(TaskStatus.propTypes))
    };

    render() {
        const taskStatusList = this.props.list;
        let {List} = Stage.Basic;

        return (
            <List ordered relaxed>
                {
                    _.map(taskStatusList, (taskStatusProps) =>
                        <List.Item key={taskStatusProps.name}>
                            <TaskStatus {...taskStatusProps} />
                        </List.Item>)
                }
            </List>
        );
    }
}

class InstallStepActions extends Component {

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} nextLabel='Exit' nextIcon='close' />
    }
}

class InstallStepContent extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            tasks: []
        };
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    componentDidMount() {
        let tasks = this.props.wizardData.tasks;
        tasks = _.map(tasks, (task) => ({...task, status: TaskStatus.notStarted}));
        this.setState({tasks}, () => {
            this.handleTasks(tasks)
                .catch((error) => this.props.onError(this.props.id, error));
        });
    }

    handleTask(index) {
        let tasks = [...this.state.tasks];
        let task = tasks[index];
        task.status = TaskStatus.inProgress;

        return new Promise((resolve) => this.setState({tasks}, resolve))
            .then(() => task.promise())
            .then(() => {
                let tasks = [...this.state.tasks];

                tasks[index].status = TaskStatus.finished;

                this.setState({tasks});
            })
            .catch((error) => {
                let tasks = [...this.state.tasks];
                error = _.isString(error)
                    ? error
                    : _.get(error, 'message', Stage.Common.JsonUtils.getStringValue(error));

                tasks[index].status = TaskStatus.failed;
                tasks[index].error = error;

                this.setState({tasks}, () => Promise.reject(error));
            });
    }

    async handleTasks(tasks) {
        for(let i = 0; i < tasks.length; i++) {
            await this.handleTask(i);
        }
    };

    render() {
        let {Header, Progress, Wizard} = Stage.Basic;
        const tasks = this.state.tasks;
        const endedTasks = _.filter(tasks, (task) => task.status === TaskStatus.finished || task.status === TaskStatus.failed);
        const allTasksEnded = endedTasks.length === tasks.length;
        const someTasksFailed = _.filter(tasks, (task) => task.status === TaskStatus.failed).length > 0;
        const percent = tasks.length > 0 ? Math.floor(endedTasks.length / tasks.length * 100) : 0;

        return (
            <Wizard.Step.Content {...this.props}>
                <Header as='h4'>Action list</Header>
                <TaskStatusList list={tasks} />
                <Progress progress percent={percent}
                          error={someTasksFailed} indicating={!allTasksEnded}  />
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep(installStepId, 'Install', 'Install resources', InstallStepContent, InstallStepActions);