/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import { Component } from 'react';
import React from 'react';

const confirmationStepId = 'confirm';

class ConfirmationStepActions extends Component {

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        return this.props.onLoading(id)
            .then(this.props.fetchData)
            .then(({stepData}) => this.props.onNext(id, {tasks: stepData.tasks}))
            .catch((error) => this.props.onError(id, error));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)}
                                    nextLabel='Install' nextIcon='download' />
    }
}

class ConfirmationStepContent extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            stepData: {
                tasks: []
            }
        };
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;


    componentDidMount() {
        const wizardData = this.props.wizardData;
        const pluginActions = new Stage.Common.PluginActions(this.props.toolbox);
        const secretActions = new Stage.Common.SecretActions(this.props.toolbox);
        const blueprintActions = new Stage.Common.BlueprintActions(this.props.toolbox);

        this.props.onLoading(this.props.id)
            .then(() => {
                const defaultVisibility = Stage.Common.Consts.defaultVisibility;
                let tasks = [];

                // Plugins
                for (let pluginName of _.keys(wizardData.plugins)) {
                    const plugin = wizardData.plugins[pluginName];
                    tasks.push({
                        name: `Upload plugin ${pluginName}`,
                        promise: () => pluginActions.doUpload(defaultVisibility, plugin.wagonUrl, plugin.yamlUrl, plugin.wagonFile, plugin.yamlFile)
                    })
                }

                // Secrets
                for (let secretKey of _.keys(wizardData.secrets)) {
                    const secretValue = wizardData.secrets[secretKey];
                    tasks.push({
                        name: `Create secret ${secretKey}`,
                        promise: () => secretActions.doCreate(secretKey, secretValue, defaultVisibility, false)
                    })
                }

                // Blueprint
                const blueprint = wizardData.blueprint;
                tasks.push({
                    name: `Upload blueprint ${blueprint.blueprintName}`,
                    promise: () => blueprintActions.doUpload(blueprint.blueprintName, blueprint.blueprintYaml, blueprint.blueprintUrl, null, blueprint.blueprintImageUrl, null, defaultVisibility)
                });

                // Deployment
                const inputs = wizardData.inputs;
                const deploymentId = `${blueprint.blueprintName}_${Math.floor((Math.random() * 100) + 1)}`;
                tasks.push({
                    name: `Deploy blueprint ${blueprint.blueprintName}`,
                    promise: () => blueprintActions.doDeploy(blueprint.blueprintName, deploymentId, inputs, defaultVisibility)
                });

                // Execution
                // TODO

                return {
                    stepData: {
                        tasks
                    }
                };
            })
            .then((newState) => new Promise((resolve) => this.setState(newState, resolve)))
            .then(() => this.props.onChange(this.props.id, this.state.stepData))
            .catch((error) => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady(this.props.id));
    }

    render() {
        let {Wizard} = Stage.Basic;
        const tasks = this.state.stepData.tasks;

        return (
            <Wizard.Step.Content {...this.props}>
                <h2>To be done:</h2>
                <ul>
                {
                    _.map(tasks, (task) => <li key={task.name}>{task.name}</li>)
                }
                </ul>
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep(confirmationStepId, 'Confirm', 'Confirm installation', ConfirmationStepContent, ConfirmationStepActions);