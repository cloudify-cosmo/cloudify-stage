/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

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
        const endedTasks = _.filter(tasks, (task) => task.isFinished() || task.isFailed());
        const allTasksEnded = endedTasks.length === tasks.length;
        const someTasksFailed = _.filter(tasks, (task) => task.isFailed()).length > 0;
        const percent = tasks.length > 0 ? Math.floor(endedTasks.length / tasks.length * 100) : 0;

        return (
            <Wizard.Step.Actions {...this.props} showNext={false} showPrev={someTasksFailed}>
                {
                    _.isEmpty(tasks) || someTasksFailed
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

        this.setState({tasks}, () => {
            this.updateTasksInWizard()
                .then(() => this.handleTasks(tasks))
                .catch((error) => this.props.onError(this.props.id, error));
        });
    }

    updateTasksInWizard() {
        let tasks = this.state.tasks;

        return new Promise((resolve) => {
            this.props.onChange(this.props.id, {tasks});
            resolve(tasks);
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
                <TaskList tasks={tasks} withStatus />
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep(installStepId, 'Install', 'Install resources', InstallStepContent, InstallStepActions);