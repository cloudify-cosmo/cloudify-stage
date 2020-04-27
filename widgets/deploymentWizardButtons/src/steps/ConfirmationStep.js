/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import TaskList from './helpers/TaskList';
import Task from './helpers/Task';
import { createWizardStep } from '../wizard/wizardUtils';
import StepActions from '../wizard/StepActions';
import StepContent from '../wizard/StepContent';

const confirmationStepId = 'confirm';

class ConfirmationStepActions extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = StepActions.propTypes;

    async isUsed(deploymentId) {
        const deploymentActions = new Stage.Common.DeploymentActions(this.props.toolbox);
        const deploymentPromise = () => deploymentActions.doGetDeployments({ _search: deploymentId });

        return !_.isEqual(
            deploymentId,
            await ConfirmationStepContent.chooseId(deploymentId, deploymentPromise, 'deployment')
        );
    }

    onNext(id) {
        return this.props
            .onLoading()
            .then(this.props.fetchData)
            .then(({ stepData }) =>
                this.isUsed(stepData.deploymentId).then(isDeploymentNameUsed => ({ stepData, isDeploymentNameUsed }))
            )
            .then(({ stepData, isDeploymentNameUsed }) => {
                if (isDeploymentNameUsed) {
                    this.props.onError(
                        id,
                        `Deployment name '${stepData.deploymentId}' is already used. Please choose a different one.`,
                        { deploymentId: true }
                    );
                } else {
                    this.props.onNext(id, {
                        tasks: stepData.tasks,
                        installOutputs: {
                            deploymentId: stepData.deploymentId,
                            blueprintId: stepData.blueprintId
                        }
                    });
                }
            })
            .catch(error => this.props.onError(id, error));
    }

    render() {
        return <StepActions {...this.props} onNext={this.onNext.bind(this)} nextLabel="Install" nextIcon="download" />;
    }
}

class ConfirmationStepContent extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = StepContent.propTypes;

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

    addPluginsTasks(plugins, tasks) {
        const pluginActions = new Stage.Common.PluginActions(this.props.toolbox);

        for (const pluginName of _.keys(plugins)) {
            const plugin = plugins[pluginName];

            const createUploadResource = name => ({
                [name]: { url: plugin[`${name}Url`], file: plugin[`${name}File`] }
            });

            tasks.push(
                new Task(`Upload plugin ${pluginName}`, () =>
                    pluginActions.doUpload(plugin.visibility, {
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
        const secretActions = new Stage.Common.SecretActions(this.props.toolbox);

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
        const blueprintActions = new Stage.Common.BlueprintActions(this.props.toolbox);
        return ConfirmationStepContent.chooseId(
            initialBlueprintId,
            () => blueprintActions.doGetBlueprints({ _search: initialBlueprintId }),
            'blueprint'
        );
    }

    addBlueprintUploadTask(blueprint, tasks) {
        const blueprintActions = new Stage.Common.BlueprintActions(this.props.toolbox);
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
        const deploymentActions = new Stage.Common.DeploymentActions(this.props.toolbox);
        return ConfirmationStepContent.chooseId(
            initialDeploymentId,
            () => deploymentActions.doGetDeployments({ _search: initialDeploymentId }),
            'deployment'
        );
    }

    addDeployBlueprintTask(deploymentId, blueprintId, inputs, visibility, tasks) {
        const blueprintActions = new Stage.Common.BlueprintActions(this.props.toolbox);
        const deploymentActions = new Stage.Common.DeploymentActions(this.props.toolbox);

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
        const deploymentActions = new Stage.Common.DeploymentActions(this.props.toolbox);

        tasks.push(
            new Task(`Execute install workflow on ${deploymentId} deployment`, () =>
                deploymentActions.doExecute({ id: deploymentId }, { name: 'install' }, {}, false)
            )
        );

        return Promise.resolve();
    }

    componentDidMount() {
        const { wizardData } = this.props;

        const tasks = [];
        let blueprintId = '';
        let deploymentId = '';

        this.props
            .onLoading()
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
            .then(({ stepData }) => this.props.onChange(this.props.id, stepData))
            .then(() => this.setState({ deploymentId }))
            .catch(error => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady());
    }

    handleInputChange(proxy, field) {
        // Remove last two tasks: create deployment and execute install workflow
        const tasks = _.dropRight(this.props.stepData.tasks, 2);

        this.addDeployBlueprintTask(
            field.value,
            this.props.stepData.blueprintId,
            this.props.wizardData.inputs,
            this.props.wizardData.blueprint.visibility,
            tasks
        );
        this.addRunInstallWorkflowTask(field.value, tasks);
        this.props.onChange(this.props.id, {
            ...this.props.stepData,
            tasks,
            ...Stage.Basic.Form.fieldNameValue(field)
        });
    }

    render() {
        const { Form } = Stage.Basic;
        const tasks = _.get(this.props.stepData, 'tasks', []);
        const deploymentId = _.get(this.props.stepData, 'deploymentId', []);

        return (
            <Form loading={this.props.loading}>
                <Form.Input
                    label="Deployment name"
                    name="deploymentId"
                    value={deploymentId}
                    fluid
                    error={this.props.errors.deploymentId}
                    required
                    onChange={this.handleInputChange.bind(this)}
                />
                <TaskList tasks={tasks} />
            </Form>
        );
    }
}

export default createWizardStep(
    confirmationStepId,
    'Confirm',
    'Confirm installation',
    ConfirmationStepContent,
    ConfirmationStepActions
);
