/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

import TaskList from './helpers/TaskList';
import Task from './helpers/Task';

const installStepId = 'install';
const {createWizardStep} = Stage.Basic.Wizard.Utils;
const emptyTasksStats = _.reduce(_.values(Task.Status), (acc, status) => ({ ...acc, [status]: 0 }), {});

class InstallStepActions extends Component {

    constructor(props) {
        super(props);

        this.redirectionInterval = null;
        this.state = InstallStepActions.initialState;
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    static initialState = {
        secondsRemaining: -1
    };

    componentDidMount() {
        this.setState(InstallStepActions.initialState);
    }

    componentDidUpdate() {
        const tasksStats = this.getTasksStats();

        if (this.state.secondsRemaining === -1 && tasksStats.allTasksEnded) {
            let tick = () => {
                this.setState({secondsRemaining: this.state.secondsRemaining - 1}, () => {
                    if (this.state.secondsRemaining <= 0) {
                        this.cancelRedirection();
                        this.drillDownToDeploymentPage();
                    }
                });
            };

            const redirectionTimeout = 10; // seconds
            this.setState({ secondsRemaining: redirectionTimeout });
            this.redirectionInterval = setInterval(tick, 1000);
        }
    }

    componentWillUnmount() {
        this.cancelRedirection();
    }

    drillDownToDeploymentPage() {
        const deploymentId = _.get(this.props, 'wizardData.installOutputs.deploymentId', null);
        this.props.toolbox.drillDown(this.props.toolbox.getWidget(), 'deployment', {deploymentId}, deploymentId);
    }

    cancelRedirection() {
        this.setState({secondsRemaining: 0});
        clearInterval(this.redirectionInterval);
    }

    getTasksStats() {
        const tasksStats = _.get(this.props, 'wizardData.tasksStats', emptyTasksStats);
        const numberOfTasks = _.get(this.props, 'wizardData.tasks.length', 0);

        const numberOfEndedTasks
            = tasksStats[Task.Status.finished] + tasksStats[Task.Status.failed];
        const allTasksEnded = numberOfEndedTasks === numberOfTasks;
        const anyTaskFailed = tasksStats[Task.Status.failed] > 0;
        const installationEnded = allTasksEnded || anyTaskFailed;

        return {
            numberOfTasks, numberOfEndedTasks, anyTaskFailed, allTasksEnded, installationEnded
        };
    }

    render() {
        let {Button, Progress, Wizard} = Stage.Basic;

        const tasksStats = this.getTasksStats();
        const percent = tasksStats.numberOfTasks > 0
            ? Math.floor(tasksStats.numberOfEndedTasks / tasksStats.numberOfTasks * 100)
            : 0;

        if (!tasksStats.installationEnded && this.state.secondsRemaining === -1) { // in progress
            return (
                <Wizard.Step.Actions {...this.props} showNext={false} showPrev={false} showStartOver={false} closeFloated={null}>
                    <Progress progress size='large' percent={percent} indicating>
                        Installation in progress...
                    </Progress>
                </Wizard.Step.Actions>
            );
        } else if (tasksStats.allTasksEnded && this.state.secondsRemaining > 0) { // success, waiting for redirection
            return (
                <Wizard.Step.Actions {...this.props} showNext={false} showPrev={false} showStartOver={false} showClose={false}>
                    <Progress size='large' percent={percent} autoSuccess>
                        Installation started! Redirecting to deployment page in {this.state.secondsRemaining} seconds...
                    </Progress>
                    <Button content='Cancel' icon='cancel' labelPosition='left'
                            onClick={this.cancelRedirection.bind(this)} />
                </Wizard.Step.Actions>
            );
        } else if (tasksStats.allTasksEnded && this.state.secondsRemaining === 0) { // success, no redirection
            return (
                <Wizard.Step.Actions {...this.props} showNext={false} showPrev={false} showStartOver
                                     startOverLabel={'Install another blueprint'} resetDataOnStartOver>
                    <Progress size='large' percent={percent} autoSuccess>
                        Installation started!
                    </Progress>
                    <Button icon='rocket' labelPosition='left'
                            content={'Go to Deployment page'}
                            onClick={this.drillDownToDeploymentPage.bind(this)} />
                </Wizard.Step.Actions>
            );
        } else if (tasksStats.anyTaskFailed) { // failure
            return (
                <Wizard.Step.Actions {...this.props} showNext={false} showPrev={false} showStartOver
                                     startOverLabel={'Start over to fix'} resetDataOnStartOver={false}>
                    <Progress size='large' percent={100} error>
                        Installation failed. Check error details above.
                    </Progress>
                </Wizard.Step.Actions>
            );
        } else {
            return null;
        }
    }
}

class InstallStepContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    componentDidMount() {
        let tasks = this.props.wizardData.tasks;

        this.setState({tasks}, () => {
            this.updateTasksInWizard()
                .then(() => this.handleTasks(tasks))
                .catch((error) => this.props.onError(this.props.id, error));
        });
    }

    updateTasksInWizard() {
        const tasks = this.state.tasks;

        return new Promise((resolve) => {
            const tasksStats = {
                ...emptyTasksStats,
                ..._.countBy(tasks, (task) => task.status)
            };
            this.props.onChange(this.props.id, {tasksStats}, false);
            resolve({tasksStats});
        });
    }

    handleTask(index) {
        let tasks = [...this.state.tasks];
        let task = tasks[index];
        task.changeToInProgress();

        return new Promise((resolve) => this.setState({tasks}, resolve))
            .then(() => task.run())
            .then(() => {
                let tasks = [...this.state.tasks];

                tasks[index].changeToFinished();

                return new Promise((resolve) => this.setState({tasks}, resolve));
            })
            .catch((error) => {
                let tasks = [...this.state.tasks];
                error = _.isString(error)
                    ? error
                    : _.get(error, 'message', Stage.Common.JsonUtils.getStringValue(error));

                tasks[index].changeToFailed(error);

                return new Promise((resolve, reject) =>
                    this.setState({tasks}, reject(`Task '${task.name}' failed with error: ${error}`)));
            })
            .finally(() => this.updateTasksInWizard());
    }

    async handleTasks(tasks) {
        for(let i = 0; i < tasks.length; i++) {
            await this.handleTask(i);
        }
    };

    render() {
        let {Form} = Stage.Basic;
        const tasks = this.state.tasks;

        return (
            <Form loading={this.props.loading}>
                <TaskList tasks={tasks} withStatus />
            </Form>
        );
    }
}

export default createWizardStep(installStepId,
                               'Install',
                               'Install resources',
                               InstallStepContent,
                               InstallStepActions);