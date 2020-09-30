/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import StepActions from '../wizard/StepActions';
import { createWizardStep } from '../wizard/wizardUtils';
import Task from './helpers/Task';
import TaskList from './helpers/TaskList';
import StepContentPropTypes from './StepContentPropTypes';

const confirmationStepId = 'confirm';

class ConfirmationStepActions extends React.Component {
    constructor(props) {
        super(props);
    }

    onNext = id => {
        const { fetchData, onError, onLoading, onNext } = this.props;
        return onLoading()
            .then(fetchData)
            .then(({ stepData }) =>
                this.isUsed(stepData.deploymentId).then(isDeploymentNameUsed => ({ stepData, isDeploymentNameUsed }))
            )
            .then(({ stepData, isDeploymentNameUsed }) => {
                if (isDeploymentNameUsed) {
                    onError(
                        id,
                        `Deployment name '${stepData.deploymentId}' is already used. Please choose a different one.`,
                        { deploymentId: true }
                    );
                } else {
                    onNext(id, {
                        tasks: stepData.tasks,
                        installOutputs: {
                            deploymentId: stepData.deploymentId,
                            blueprintId: stepData.blueprintId
                        }
                    });
                }
            })
            .catch(error => onError(id, error));
    };

    async isUsed(deploymentId) {
        const { toolbox } = this.props;
        const deploymentActions = new Stage.Common.DeploymentActions(toolbox);
        const deploymentPromise = () => deploymentActions.doGetDeployments({ _search: deploymentId });

        return !_.isEqual(
            deploymentId,
            await ConfirmationStepContent.chooseId(deploymentId, deploymentPromise, 'deployment')
        );
    }

    render() {
        const {
            onClose,
            onStartOver,
            onPrev,
            onError,
            onLoading,
            onReady,
            disabled,
            showPrev,
            fetchData,
            wizardData,
            toolbox,
            id
        } = this.props;
        return (
            <StepActions
                id={id}
                onClose={onClose}
                onStartOver={onStartOver}
                onPrev={onPrev}
                onError={onError}
                onLoading={onLoading}
                onReady={onReady}
                disabled={disabled}
                showPrev={showPrev}
                fetchData={fetchData}
                wizardData={wizardData}
                toolbox={toolbox}
                onNext={this.onNext}
                nextLabel="Install"
                nextIcon="download"
            />
        );
    }
}

ConfirmationStepActions.propTypes = StepActions.propTypes;

class ConfirmationStepContent extends React.Component {
    static chooseId(baseId, promise, idName) {
        const maxSuffixNumber = 1000;
        const isIdInList = (items, id) => !_.isUndefined(_.find(items, { id }));

        let id = baseId;
        let idChosen = false;
        return promise().then(({ items }) => {
            idChosen = !isIdInList(items, id);

            for (let i = 0; i < maxSuffixNumber && !idChosen; i++) {
                id = `${baseId}_${i}`;
                idChosen = !isIdInList(items, id);
            }

            return idChosen ? Promise.resolve(id) : Promise.reject(`Not found unused ${idName} ID.`);
        });
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { wizardData, id, onChange, onError, onLoading, onReady } = this.props;

        const tasks = [];
        let blueprintId = '';
        let deploymentId = '';

        onLoading()
            .then(() => this.addPluginsTasks(wizardData.plugins, tasks))
            .then(() => this.addSecretsTasks(wizardData.secrets, tasks))
            .then(() => this.chooseBlueprintId(wizardData.blueprint.blueprintName))
            .then(id => {
                blueprintId = id;
                return this.addBlueprintUploadTask({ ...wizardData.blueprint, blueprintName: id }, tasks);
            })
            .then(() => this.chooseDeploymentId(blueprintId))
            .then(id => {
                deploymentId = id;
                this.addDeployBlueprintTask(id, blueprintId, wizardData.inputs, wizardData.blueprint.visibility, tasks);
            })
            .then(() => this.addRunInstallWorkflowTask(deploymentId, tasks))
            .then(() => ({ stepData: { tasks, blueprintId, deploymentId } }))
            .then(({ stepData }) => onChange(id, stepData))
            .catch(error => onError(id, error))
            .finally(() => onReady());
    }

    handleInputChange = (proxy, field) => {
        const { id, onChange, stepData, wizardData } = this.props;
        // Remove last two tasks: create deployment and execute install workflow
        const tasks = _.dropRight(stepData.tasks, 2);

        this.addDeployBlueprintTask(
            field.value,
            stepData.blueprintId,
            wizardData.inputs,
            wizardData.blueprint.visibility,
            tasks
        );
        this.addRunInstallWorkflowTask(field.value, tasks);
        onChange(id, {
            ...stepData,
            tasks,
            ...Stage.Basic.Form.fieldNameValue(field)
        });
    };

    addPluginsTasks(plugins, tasks) {
        const { toolbox } = this.props;
        const pluginActions = new Stage.Common.PluginActions(toolbox);

        for (const pluginName of _.keys(plugins)) {
            const plugin = plugins[pluginName];

            const createUploadResource = name => ({
                [name]: { url: plugin[`${name}Url`], file: plugin[`${name}File`] }
            });

            tasks.push(
                new Task(`Upload plugin ${pluginName}`, () =>
                    pluginActions.doUpload(plugin.visibility, plugin.title, {
                        ...createUploadResource('wagon'),
                        ...createUploadResource('yaml'),
                        ...createUploadResource('icon')
                    })
                )
            );
        }

        return Promise.resolve();
    }

    addSecretsTasks(secrets, tasks) {
        const { toolbox } = this.props;
        const secretActions = new Stage.Common.SecretActions(toolbox);

        for (const secret of _.keys(secrets)) {
            const secretValue = secrets[secret].value;
            const secretVisibility = secrets[secret].visibility;

            tasks.push(
                new Task(`Create secret ${secret}`, () =>
                    secretActions.doCreate(secret, secretValue, secretVisibility, false)
                )
            );
        }

        return Promise.resolve();
    }

    chooseBlueprintId(initialBlueprintId) {
        const { toolbox } = this.props;
        const blueprintActions = new Stage.Common.BlueprintActions(toolbox);
        return ConfirmationStepContent.chooseId(
            initialBlueprintId,
            () => blueprintActions.doGetBlueprints({ _search: initialBlueprintId }),
            'blueprint'
        );
    }

    addBlueprintUploadTask(blueprint, tasks) {
        const { toolbox } = this.props;
        const blueprintActions = new Stage.Common.BlueprintActions(toolbox);
        const blueprintUrl = blueprint.blueprintFile ? '' : blueprint.blueprintUrl;
        const imageUrl = blueprint.imageFile ? '' : blueprint.imageUrl;

        tasks.push(
            new Task(`Upload blueprint ${blueprint.blueprintName}`, () =>
                blueprintActions.doUpload(
                    blueprint.blueprintName,
                    blueprint.blueprintFileName,
                    blueprintUrl,
                    blueprint.blueprintFile,
                    imageUrl,
                    blueprint.imageFile,
                    blueprint.visibility
                )
            )
        );

        return Promise.resolve();
    }

    chooseDeploymentId(initialDeploymentId) {
        const { toolbox } = this.props;
        const deploymentActions = new Stage.Common.DeploymentActions(toolbox);
        return ConfirmationStepContent.chooseId(
            initialDeploymentId,
            () => deploymentActions.doGetDeployments({ _search: initialDeploymentId }),
            'deployment'
        );
    }

    addDeployBlueprintTask(deploymentId, blueprintId, inputs, visibility, tasks) {
        const { toolbox } = this.props;
        const blueprintActions = new Stage.Common.BlueprintActions(toolbox);
        const deploymentActions = new Stage.Common.DeploymentActions(toolbox);

        tasks.push(
            new Task(`Create ${deploymentId} deployment from ${blueprintId} blueprint`, () =>
                blueprintActions
                    .doDeploy({ id: blueprintId }, deploymentId, inputs, visibility)
                    .then(() => deploymentActions.waitUntilCreated(deploymentId))
            )
        );

        return Promise.resolve();
    }

    addRunInstallWorkflowTask(deploymentId, tasks) {
        const { toolbox } = this.props;
        const deploymentActions = new Stage.Common.DeploymentActions(toolbox);

        tasks.push(
            new Task(`Execute install workflow on ${deploymentId} deployment`, () =>
                deploymentActions.doExecute({ id: deploymentId }, { name: 'install' }, {}, false)
            )
        );

        return Promise.resolve();
    }

    render() {
        const { errors, loading, stepData } = this.props;
        const { Form } = Stage.Basic;
        const tasks = _.get(stepData, 'tasks', []);
        const deploymentId = _.get(stepData, 'deploymentId', []);

        return (
            <Form loading={loading}>
                <Form.Input
                    label="Deployment name"
                    name="deploymentId"
                    value={deploymentId}
                    fluid
                    error={errors.deploymentId}
                    required
                    onChange={this.handleInputChange}
                />
                <TaskList tasks={tasks} />
            </Form>
        );
    }
}

ConfirmationStepContent.propTypes = StepContentPropTypes;

export default createWizardStep(
    confirmationStepId,
    'Confirm',
    'Confirm installation',
    ConfirmationStepContent,
    ConfirmationStepActions
);
