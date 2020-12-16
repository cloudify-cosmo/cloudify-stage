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

function InstallStepActions({
    wizardData,
    toolbox,
    onClose,
    onError,
    onLoading,
    onReady,
    disabled,
    fetchData,
    onStartOver,
    id
}) {
    const { useRef, useState, useEffect } = React;

    const [secondsRemaining, setSecondsRemaining] = useState(-1);
    const redirectionInterval = useRef(null);

    function getTasksStats() {
        const tasksStats = _.get(wizardData, 'tasksStats', emptyTasksStats);
        const numberOfTasks = _.get(wizardData, 'tasks.length', 0);

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

    function cancelRedirection() {
        setSecondsRemaining(0);
        clearInterval(redirectionInterval.current);
    }

    function drillDownToDeploymentPage() {
        const deploymentId = _.get(wizardData, 'installOutputs.deploymentId', null);
        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId }, deploymentId);
    }

    useEffect(() => {
        const tasksStats = getTasksStats();

        if (secondsRemaining === -1 && tasksStats.allTasksEnded) {
            const tick = () => {
                const updatedSecondsRemaining = secondsRemaining - 1;
                setSecondsRemaining(updatedSecondsRemaining);
                if (updatedSecondsRemaining <= 0) {
                    cancelRedirection();
                    drillDownToDeploymentPage();
                }
            };

            const redirectionTimeout = 10; // seconds
            setSecondsRemaining(redirectionTimeout);
            redirectionInterval.current = setInterval(tick, 1000);
        }
    });

    useEffect(() => cancelRedirection, []);

    const { Button, Progress } = Stage.Basic;

    const tasksStats = getTasksStats();
    const percent =
        tasksStats.numberOfTasks > 0 ? Math.floor((tasksStats.numberOfEndedTasks / tasksStats.numberOfTasks) * 100) : 0;

    if (!tasksStats.installationEnded && secondsRemaining === -1) {
        // in progress
        return (
            <StepActions
                id={id}
                onClose={onClose}
                onError={onError}
                onLoading={onLoading}
                onReady={onReady}
                disabled={disabled}
                fetchData={fetchData}
                wizardData={wizardData}
                toolbox={toolbox}
                showNext={false}
                showPrev={false}
                showStartOver={false}
                closeOnRight
            >
                <Progress progress size="large" percent={percent} indicating>
                    Installation in progress...
                </Progress>
            </StepActions>
        );
    }
    if (tasksStats.allTasksEnded && secondsRemaining > 0) {
        // success, waiting for redirection
        return (
            <StepActions
                id={id}
                onError={onError}
                onLoading={onLoading}
                onReady={onReady}
                disabled={disabled}
                fetchData={fetchData}
                wizardData={wizardData}
                toolbox={toolbox}
                showNext={false}
                showPrev={false}
                showStartOver={false}
                showClose={false}
            >
                <Progress size="large" percent={percent} autoSuccess>
                    Installation started! Redirecting to deployment page in {secondsRemaining} seconds...
                </Progress>
                <Button
                    content="Stay on this page"
                    icon="hand paper"
                    labelPosition="left"
                    onClick={cancelRedirection}
                />
            </StepActions>
        );
    }
    if (tasksStats.allTasksEnded && secondsRemaining === 0) {
        // success, no redirection
        return (
            <StepActions
                id={id}
                onClose={onClose}
                onError={onError}
                onLoading={onLoading}
                onReady={onReady}
                onStartOver={onStartOver}
                disabled={disabled}
                fetchData={fetchData}
                wizardData={wizardData}
                toolbox={toolbox}
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
                    onClick={drillDownToDeploymentPage}
                />
            </StepActions>
        );
    }
    if (tasksStats.anyTaskFailed) {
        // failure
        return (
            <StepActions
                id={id}
                onClose={onClose}
                onError={onError}
                onLoading={onLoading}
                onReady={onReady}
                onStartOver={onStartOver}
                disabled={disabled}
                fetchData={fetchData}
                wizardData={wizardData}
                toolbox={toolbox}
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

InstallStepActions.propTypes = StepActions.propTypes;

class InstallStepContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };
    }

    componentDidMount() {
        const { id, onError, wizardData } = this.props;
        const { tasks } = wizardData;

        this.setState({ tasks }, () => {
            this.updateTasksInWizard()
                .then(() => this.handleTasks(tasks))
                .catch(error => onError(id, error));
        });
    }

    handleTask(index) {
        let { tasks: stateTasks } = this.state;
        let tasks = [...stateTasks];
        const task = tasks[index];
        task.changeToInProgress();

        return new Promise(resolve => this.setState({ tasks }, resolve))
            .then(() => task.run())
            .then(() => {
                ({ tasks: stateTasks } = this.state);
                tasks = [...stateTasks];

                tasks[index].changeToFinished();

                return new Promise(resolve => this.setState({ tasks }, resolve));
            })
            .catch(error => {
                ({ tasks: stateTasks } = this.state);
                tasks = [...stateTasks];
                const formattedError = _.isString(error)
                    ? error
                    : _.get(error, 'message', Stage.Utils.Json.getStringValue(error));

                tasks[index].changeToFailed(formattedError);

                return new Promise((resolve, reject) =>
                    this.setState({ tasks }, reject(`Task '${task.name}' failed with error: ${formattedError}`))
                );
            })
            .finally(() => this.updateTasksInWizard());
    }

    async handleTasks(tasks) {
        for (let i = 0; i < tasks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await this.handleTask(i);
        }
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

InstallStepContent.propTypes = StepContentPropTypes;

export default createWizardStep(installStepId, 'Install', 'Install resources', InstallStepContent, InstallStepActions);
