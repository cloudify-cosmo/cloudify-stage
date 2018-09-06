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
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    render() {
        let {Button, Link, Progress, Wizard} = Stage.Basic;

        const tasksStats = _.get(this.props, 'wizardData.tasksStats', emptyTasksStats);
        const numberOfTasks = _.get(this.props, 'wizardData.tasks.length', 0);

        const numberOfEndedTasks
            = tasksStats[Task.Status.finished] + tasksStats[Task.Status.failed];
        const allTasksEnded = numberOfEndedTasks === numberOfTasks;
        const anyTaskFailed = tasksStats[Task.Status.failed] > 0;
        const percent = numberOfTasks > 0 ? Math.floor(numberOfEndedTasks / numberOfTasks * 100) : 0;

        return (
            <Wizard.Step.Actions {...this.props} showNext={false} showPrev={true}>
                {
                    allTasksEnded && !anyTaskFailed
                    ?
                        <Link to='/page/deployments'>
                            <Button icon='rocket' content='Go to Deployments page' labelPosition='left' />
                        </Link>
                    :
                        <Progress progress={!anyTaskFailed} size='large'
                                  percent={anyTaskFailed ? 100 : percent}
                                  error={anyTaskFailed}
                                  indicating={!anyTaskFailed}>
                            {anyTaskFailed && 'Installation failed. Check details above.'}
                        </Progress>
                }
            </Wizard.Step.Actions>
        );
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