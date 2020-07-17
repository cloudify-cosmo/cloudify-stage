/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import StepActions from '../wizard/StepActions';
import { createWizardStep } from '../wizard/wizardUtils';
import Task from './helpers/Task';
import TaskList from './helpers/TaskList';
import StepContentPropTypes from './StepContentPropTypes';

const installStepId = 'install';
const emptyTasksStats = _.reduce(_.values(Task.Status), (acc, status) => ({ ...acc, [status]: 0 }), {});

class InstallStepActions extends React.Component {
    constructor(props) {
        super(props);

        this.redirectionInterval = null;
        this.state = InstallStepActions.initialState;
    }

    static propTypes = StepActions.propTypes;

    static initialState = {
        secondsRemaining: -1
    };

    componentDidMount() {
        this.setState(InstallStepActions.initialState);
    }

    componentDidUpdate() {
        const { secondsRemaining } = this.state;
        const tasksStats = this.getTasksStats();

        if (secondsRemaining === -1 && tasksStats.allTasksEnded) {
            const tick = () => {
                this.setState({ secondsRemaining: secondsRemaining - 1 }, () => {
                    if (secondsRemaining <= 0) {
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
        const { toolbox } = this.props;
        const deploymentId = _.get(this.props, 'wizardData.installOutputs.deploymentId', null);
        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId }, deploymentId);
    }

    cancelRedirection() {
        this.setState({ secondsRemaining: 0 });
        clearInterval(this.redirectionInterval);
    }

    getTasksStats() {
        const tasksStats = _.get(this.props, 'wizardData.tasksStats', emptyTasksStats);
        const numberOfTasks = _.get(this.props, 'wizardData.tasks.length', 0);

        const numberOfEndedTasks = tasksStats[Task.Status.finished] + tasksStats[Task.Status.failed];
        const allTasksEnded = numberOfEndedTasks === numberOfTasks;
        const anyTaskFailed = tasksStats[Task.Status.failed] > 0;
        const installationEnded = allTasksEnded || anyTaskFailed;

        return {
            numberOfTasks,
            numberOfEndedTasks,
            anyTaskFailed,
            allTasksEnded,
            installationEnded
        };
    }

    render() {
        const { secondsRemaining } = this.state;
        const { Button, Progress } = Stage.Basic;

        const tasksStats = this.getTasksStats();
        const percent =
            tasksStats.numberOfTasks > 0
                ? Math.floor((tasksStats.numberOfEndedTasks / tasksStats.numberOfTasks) * 100)
                : 0;

        if (!tasksStats.installationEnded && secondsRemaining === -1) {
            // in progress
            return (
                <StepActions {...this.props} showNext={false} showPrev={false} showStartOver={false} closeOnRight>
                    <Progress progress size="large" percent={percent} indicating>
                        Installation in progress...
                    </Progress>
                </StepActions>
            );
        }
        if (tasksStats.allTasksEnded && secondsRemaining > 0) {
            // success, waiting for redirection
            return (
                <StepActions {...this.props} showNext={false} showPrev={false} showStartOver={false} showClose={false}>
                    <Progress size="large" percent={percent} autoSuccess>
                        Installation started! Redirecting to deployment page in {secondsRemaining} seconds...
                    </Progress>
                    <Button
                        content="Stay on this page"
                        icon="hand paper"
                        labelPosition="left"
                        onClick={this.cancelRedirection.bind(this)}
                    />
                </StepActions>
            );
        }
        if (tasksStats.allTasksEnded && secondsRemaining === 0) {
            // success, no redirection
            return (
                <StepActions
                    {...this.props}
                    showNext={false}
                    showPrev={false}
                    showStartOver
                    startOverLabel="Install another blueprint"
                    resetDataOnStartOver
                >
                    <Progress size="large" percent={percent} autoSuccess>
                        Installation started!
                    </Progress>
                    <Button
                        icon="rocket"
                        labelPosition="left"
                        content="Go to Deployment page"
                        onClick={this.drillDownToDeploymentPage.bind(this)}
                    />
                </StepActions>
            );
        }
        if (tasksStats.anyTaskFailed) {
            // failure
            return (
                <StepActions
                    {...this.props}
                    showNext={false}
                    showPrev={false}
                    showStartOver
                    startOverLabel="Start over to fix"
                    resetDataOnStartOver={false}
                >
                    <Progress size="large" percent={100} error>
                        Installation failed. Check error details above.
                    </Progress>
                </StepActions>
            );
        }
        return null;
    }
}

class InstallStepContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };
    }

    static propTypes = StepContentPropTypes;

    componentDidMount() {
        const { id, onError, wizardData } = this.props;
        const { tasks } = wizardData;

        this.setState({ tasks }, () => {
            this.updateTasksInWizard()
                .then(() => this.handleTasks(tasks))
                .catch(error => onError(id, error));
        });
    }

    updateTasksInWizard() {
        const { id, onChange } = this.props;
        const { tasks } = this.state;

        return new Promise(resolve => {
            const tasksStats = {
                ...emptyTasksStats,
                ..._.countBy(tasks, task => task.status)
            };
            onChange(id, { tasksStats }, false);
            resolve({ tasksStats });
        });
    }

    handleTask(index) {
        const { tasks: stateTasks } = this.state;
        const tasks = [...stateTasks];
        const task = tasks[index];
        task.changeToInProgress();

        return new Promise(resolve => this.setState({ tasks }, resolve))
            .then(() => task.run())
            .then(() => {
                const { tasks: stateTasks } = this.state;
                const tasks = [...stateTasks];

                tasks[index].changeToFinished();

                return new Promise(resolve => this.setState({ tasks }, resolve));
            })
            .catch(error => {
                const { tasks: stateTasks } = this.state;
                const tasks = [...stateTasks];
                error = _.isString(error) ? error : _.get(error, 'message', Stage.Utils.Json.getStringValue(error));

                tasks[index].changeToFailed(error);

                return new Promise((resolve, reject) =>
                    this.setState({ tasks }, reject(`Task '${task.name}' failed with error: ${error}`))
                );
            })
            .finally(() => this.updateTasksInWizard());
    }

    async handleTasks(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            await this.handleTask(i);
        }
    }

    render() {
        const { Form } = Stage.Basic;
        const { loading } = this.props;
        const { tasks } = this.state;

        return (
            <Form loading={loading}>
                <TaskList tasks={tasks} withStatus />
            </Form>
        );
    }
}

export default createWizardStep(installStepId, 'Install', 'Install resources', InstallStepContent, InstallStepActions);
