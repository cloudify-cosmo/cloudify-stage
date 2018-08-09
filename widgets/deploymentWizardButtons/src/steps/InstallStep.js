/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

import TaskStatus from './helpers/TaskStatus';
import TaskList from './helpers/TaskList';

const installStepId = 'install';

class InstallStepActions extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            tasks: []
        };
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    componentWillReceiveProps(nextProps) {
        nextProps.fetchData()
            .then(({stepData}) => this.setState({...stepData}))
    }

    render() {
        let {Button, Link, Progress, Wizard} = Stage.Basic;

        const tasks = this.state.tasks;
        const endedTasks = _.filter(tasks, (task) => task.status === TaskStatus.finished || task.status === TaskStatus.failed);
        const allTasksEnded = endedTasks.length === tasks.length;
        const someTasksFailed = _.filter(tasks, (task) => task.status === TaskStatus.failed).length > 0;
        const percent = tasks.length > 0 ? Math.floor(endedTasks.length / tasks.length * 100) : 0;

        return (
            <Wizard.Step.Actions {...this.props} showNext={false} showPrev={false}>
                {
                    _.isEmpty(tasks)
                    ?
                        null
                    :
                        allTasksEnded
                        ?
                            <Link to='/page/deployments'>
                                <Button icon='rocket' content='Go to Deployments page' labelPosition='left' />
                            </Link>
                        :
                            <Progress progress percent={percent} error={someTasksFailed} indicating={!allTasksEnded}  />
                }
            </Wizard.Step.Actions>
        );
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
        tasks = _.map(tasks, (task) => ({...task, status: TaskStatus.pending}));
        this.setState({tasks}, () => {
            this.updateTasksInWizard()
                .then(() => this.handleTasks(tasks))
                .catch((error) => this.props.onError(this.props.id, error));
        });
    }

    updateTasksInWizard() {
        let tasks =  {tasks: _.map(this.state.tasks, (task) => ({status: task.status}))};

        return new Promise((resolve) => {
            this.props.onChange(this.props.id, tasks);
            resolve(tasks);
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

                return new Promise((resolve) => this.setState({tasks}, resolve));
            })
            .catch((error) => {
                let tasks = [...this.state.tasks];
                error = _.isString(error)
                    ? error
                    : _.get(error, 'message', Stage.Common.JsonUtils.getStringValue(error));

                tasks[index].status = TaskStatus.failed;
                tasks[index].error = error;

                return new Promise((resolve, reject) => this.setState({tasks}, reject(error)));
            })
            .finally(() => this.updateTasksInWizard());
    }

    async handleTasks(tasks) {
        for(let i = 0; i < tasks.length; i++) {
            await this.handleTask(i);
        }
    };

    render() {
        let {Wizard} = Stage.Basic;
        const tasks = this.state.tasks;

        return (
            <Wizard.Step.Content {...this.props}>
                <TaskList list={tasks} withStatus />
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep(installStepId, 'Install', 'Install resources', InstallStepContent, InstallStepActions);