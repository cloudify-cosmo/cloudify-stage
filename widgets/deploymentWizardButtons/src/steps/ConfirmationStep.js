/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

import TaskList from './helpers/TaskList';
import Task from './helpers/Task';

const confirmationStepId = 'confirm';
const {createWizardStep} = Stage.Basic.Wizard.Utils;

class ConfirmationStepActions extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        return this.props.onLoading()
            .then(this.props.fetchData)
            .then(({stepData}) => this.props.onNext(id, {
                tasks: stepData.tasks,
                installOutputs: {
                    deploymentId: stepData.deploymentId,
                    blueprintId: stepData.blueprintId
                }
            }))
            .catch((error) => this.props.onError(id, error));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)}
                                    nextLabel='Install' nextIcon='download' />
    }
}

class ConfirmationStepContent extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    chooseId(baseId, promise, idName) {
        const maxSuffixNumber = 1000;
        const isIdInList = (items, id) => !_.isUndefined(_.find(items, {id}));

        let id = baseId;
        let idChosen = false;
        return promise()
            .then(({items}) => {
                idChosen = !isIdInList(items, id);

                for (let i = 0; i < maxSuffixNumber && !idChosen; i++) {
                    id = `${baseId}_${i}`;
                    idChosen = !isIdInList(items, id);
                }

                return idChosen
                    ? Promise.resolve(id)
                    : Promise.reject(`Not found unused ${idName} ID.`);
            });
    }

    addPluginsTasks(plugins, tasks) {
        const pluginActions = new Stage.Common.PluginActions(this.props.toolbox);

        for (let pluginName of _.keys(plugins)) {
            const plugin = plugins[pluginName];
            const wagonUrl = plugin.wagonFile ? '' : plugin.wagonUrl;
            const yamlUrl = plugin.yamlFile ? '' : plugin.yamlUrl;

            tasks.push(
                new Task(
                    `Upload plugin ${pluginName}`,
                    () => pluginActions.doUpload(plugin.visibility, wagonUrl, yamlUrl, plugin.wagonFile, plugin.yamlFile)
                )
            );
        }

        return Promise.resolve();
    }

    addSecretsTasks(secrets, tasks) {
        const secretActions = new Stage.Common.SecretActions(this.props.toolbox);

        for (let secret of _.keys(secrets)) {
            const secretValue = secrets[secret].value;
            const secretVisibility = secrets[secret].visibility;

            tasks.push(
                new Task(
                    `Create secret ${secret}`,
                    () => secretActions.doCreate(secret, secretValue, secretVisibility, false)
                )
            )
        }

        return Promise.resolve();
    }

    chooseBlueprintId(initialBlueprintId) {
        const blueprintActions = new Stage.Common.BlueprintActions(this.props.toolbox);
        return this.chooseId(initialBlueprintId, () => blueprintActions.doGetBlueprints({_search: initialBlueprintId}), 'blueprint');
    }

    addBlueprintUploadTask(blueprint, tasks) {
        const blueprintActions = new Stage.Common.BlueprintActions(this.props.toolbox);
        const blueprintUrl = blueprint.blueprintFile ? '' : blueprint.blueprintUrl;
        const imageUrl = blueprint.imageFile ? '' : blueprint.imageUrl;

        tasks.push(
            new Task(
                `Upload blueprint ${blueprint.blueprintName}`,
                () => blueprintActions.doUpload(blueprint.blueprintName, blueprint.blueprintFileName,
                                                blueprintUrl, blueprint.blueprintFile,
                                                imageUrl, blueprint.imageFile,
                                                blueprint.visibility)
            )
        );

        return Promise.resolve();
    }

    chooseDeploymentId(initialDeploymentId) {
        const deploymentActions = new Stage.Common.DeploymentActions(this.props.toolbox);
        return this.chooseId(initialDeploymentId, () => deploymentActions.doGetDeployments({_search: initialDeploymentId}), 'deployment');
    }

    addDeployBlueprintTask(deploymentId, blueprintId, inputs, visibility, tasks) {
        const blueprintActions = new Stage.Common.BlueprintActions(this.props.toolbox);
        const executionActions = new Stage.Common.ExecutionActions(this.props.toolbox);

        const waitForDeploymentIsCreated = async () => {
            const maxNumberOfRetries = 60;
            const waitingInterval = 1000; //ms

            let deploymentCreated = false;
            for (let i = 0; i < maxNumberOfRetries && !deploymentCreated; i++) {
                await new Promise(resolve => {
                        console.debug('Waiting for deployment is created...', i);
                        setTimeout(resolve, waitingInterval);
                    })
                    .then(() => executionActions.doGetExecutions(deploymentId))
                    .then(({items}) => {
                        deploymentCreated = !_.isEmpty(items) && _.isUndefined(_.find(items, {ended_at: null}));
                    });
            }

            if (deploymentCreated) {
                return Promise.resolve();
            } else {
                const timeout = Math.floor(maxNumberOfRetries * waitingInterval / 1000);
                return Promise.reject(`Timeout exceeded. Deployment was not created after ${timeout} seconds.`);
            }
        };

        tasks.push(
            new Task(
                `Create ${deploymentId} deployment from ${blueprintId} blueprint`,
                () => blueprintActions.doDeploy({id: blueprintId}, deploymentId, inputs, visibility)
                    .then(() => waitForDeploymentIsCreated())
            )
        );

        return Promise.resolve();
    }

    addRunInstallWorkflowTask(deploymentId, tasks) {
        const deploymentActions = new Stage.Common.DeploymentActions(this.props.toolbox);

        tasks.push(
            new Task(
                `Execute install workflow on ${deploymentId} deployment`,
                () => deploymentActions.doExecute({id: deploymentId}, {name: 'install'}, {}, false)
            )
        );

        return Promise.resolve();
    }

    componentDidMount() {
        const wizardData = this.props.wizardData;

        let tasks = [];
        let blueprintId = '';
        let deploymentId = '';

        this.props.onLoading()
            .then(() => this.addPluginsTasks(wizardData.plugins, tasks))
            .then(() => this.addSecretsTasks(wizardData.secrets, tasks))
            .then(() => this.chooseBlueprintId(wizardData.blueprint.blueprintName))
            .then((id) => {blueprintId = id; return this.addBlueprintUploadTask({...wizardData.blueprint, blueprintName: id}, tasks)})
            .then(() => this.chooseDeploymentId(blueprintId))
            .then((id) => {deploymentId = id; this.addDeployBlueprintTask(id, blueprintId, wizardData.inputs, wizardData.blueprint.visibility, tasks)})
            .then(() => this.addRunInstallWorkflowTask(deploymentId, tasks))
            .then(() => ({stepData: {tasks, blueprintId, deploymentId}}))
            .then(({stepData}) => this.props.onChange(this.props.id, stepData))
            .catch((error) => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady());
    }

    render() {
        let {Form} = Stage.Basic;
        const tasks = _.get(this.props.stepData, 'tasks', []);

        return (
            <Form loading={this.props.loading}>
                <TaskList tasks={tasks} />
            </Form>
        );
    }
}

export default createWizardStep(confirmationStepId,
                                'Confirm',
                                'Confirm installation',
                                ConfirmationStepContent,
                                ConfirmationStepActions);