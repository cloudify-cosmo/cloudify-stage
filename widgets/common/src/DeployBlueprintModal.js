/**
 * Created by kinneretzin on 05/10/2016.
 */

const steps = Object.freeze({
    validateData: 'validateData',
    deployBlueprint: 'deployBlueprint',
    waitForDeployment: 'waitForDeployment',
    installDeployment: 'installDeployment'
});

const paths = Object.freeze({
    deploy: 'deploy',
    deployAndInstall: 'deployAndInstall'
});

const messages = Object.freeze({
    [paths.deploy]: {
        [steps.validateData]: '1/2: Validating data...',
        [steps.deployBlueprint]: '2/2: Deploying blueprint...'
    },
    [paths.deployAndInstall]: {
        [steps.validateData]: '1/4: Validating data...',
        [steps.deployBlueprint]: '2/4: Deploying blueprint...',
        [steps.waitForDeployment]: '3/4: Creating deployment environment... ',
        [steps.installDeployment]: '4/4: Installing deployment...'
    }
});

class DeployBlueprintModal extends React.Component {
    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {}, workflows: { install: {} } } };

    static initialState = {
        blueprint: DeployBlueprintModal.EMPTY_BLUEPRINT,
        deploymentInputs: [],
        deploymentName: '',
        errors: {},
        fileLoading: false,
        loading: false,
        loadingMessage: '',
        runtimeOnlyEvaluation: false,
        showInstallModal: false,
        siteName: '',
        skipPluginsValidation: false,
        visibility: Stage.Common.Consts.defaultVisibility,
        workflow: {},
        yamlFile: null
    };

    constructor(props) {
        super(props);

        this.state = DeployBlueprintModal.initialState;

        this.selectBlueprint = this.selectBlueprint.bind(this);

        this.handleDeploymentInputChange = this.handleDeploymentInputChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleYamlFileChange = this.handleYamlFileChange.bind(this);

        this.onCancel = this.onCancel.bind(this);
        this.onDeploy = this.onDeploy.bind(this);
        this.onDeployAndInstall = this.onDeployAndInstall.bind(this);

        this.hideInstallModal = this.hideInstallModal.bind(this);
        this.showInstallModal = this.showInstallModal.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { blueprintId, open } = this.props;
        if (!prevProps.open && open) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(DeployBlueprintModal.initialState, () => this.selectBlueprint(blueprintId));
        }
    }

    setLoadingMessage(path, step) {
        // eslint-disable-next-line security/detect-object-injection
        this.setState({ loadingMessage: messages[path][step] });
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    openDeploymentPage(deploymentId) {
        const { toolbox } = this.props;
        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId }, deploymentId);
    }

    onDeploy() {
        const { onHide, toolbox } = this.props;

        this.setState({ loading: true, errors: {} });
        this.setLoadingMessage(paths.deploy, steps.validateData);
        return this.validateInputs()
            .then(deploymentInputs => {
                this.setLoadingMessage(paths.deploy, steps.deployBlueprint);
                return this.deployBlueprint(deploymentInputs);
            })
            .then(({ id }) => {
                this.setState({ loading: false, errors: {} });
                toolbox.getEventBus().trigger('deployments:refresh');
                onHide();
                this.openDeploymentPage(id);
            })
            .catch(errors => {
                this.setState({ loading: false, errors });
            });
    }

    onDeployAndInstall(workflowParameters, force, dryRun, queue, scheduledTime) {
        const { onHide, toolbox } = this.props;

        this.setState({ loading: true, errors: {} });
        let deploymentId = null;
        this.setLoadingMessage(paths.deployAndInstall, steps.validateData);
        return this.validateInputs()
            .then(deploymentInputs => {
                this.setLoadingMessage(paths.deployAndInstall, steps.deployBlueprint);
                return this.deployBlueprint(deploymentInputs);
            })
            .then(deployment => {
                deploymentId = deployment.id;
                this.setLoadingMessage(paths.deployAndInstall, steps.waitForDeployment);
                return this.waitForDeploymentIsCreated(deploymentId);
            })
            .then(() => {
                this.setLoadingMessage(paths.deployAndInstall, steps.installDeployment);
                return this.installDeployment(deploymentId, workflowParameters, force, dryRun, queue, scheduledTime);
            })
            .then(({ deployment_id: id }) => {
                this.setState({ loading: false, errors: {} });
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
                onHide();
                this.openDeploymentPage(id);
            })
            .catch(errors => {
                this.setState({ loading: false, errors });
            });
    }

    showInstallModal() {
        this.setState({ loading: true, errors: {} });
        return this.validateInputs()
            .then(() => this.setState({ loading: false, showInstallModal: true }))
            .catch(errors => {
                this.setState({ loading: false, errors });
            });
    }

    hideInstallModal() {
        this.setState({ showInstallModal: false });
    }

    isBlueprintSelectable() {
        const { blueprintId } = this.props;
        return _.isEmpty(blueprintId);
    }

    selectBlueprint(id) {
        if (!_.isEmpty(id)) {
            this.setState({ loading: true, loadingMessage: 'Loading inputs...' });
            const { toolbox } = this.props;
            const { BlueprintActions, InputsUtils } = Stage.Common;

            const actions = new BlueprintActions(toolbox);
            actions
                .doGetFullBlueprintData({ id })
                .then(blueprint => {
                    const deploymentInputs = InputsUtils.getInputsInitialValuesFrom(blueprint.plan);
                    this.setState({ deploymentInputs, blueprint, errors: {}, loading: false });
                })
                .catch(err => {
                    this.setState({
                        blueprint: DeployBlueprintModal.EMPTY_BLUEPRINT,
                        loading: false,
                        errors: { error: err.message }
                    });
                });
        } else {
            this.setState({ blueprint: DeployBlueprintModal.EMPTY_BLUEPRINT, errors: {} });
        }
    }

    validateInputs() {
        return new Promise((resolve, reject) => {
            const { InputsUtils } = Stage.Common;
            const { blueprint, deploymentName, deploymentInputs: stateDeploymentInputs } = this.state;
            const errors = {};

            if (_.isEmpty(blueprint.id)) {
                errors.blueprintName = 'Please select blueprint from the list';
            }

            if (_.isEmpty(deploymentName)) {
                errors.deploymentName = 'Please provide deployment name';
            }

            const inputsWithoutValue = {};
            const deploymentInputs = InputsUtils.getInputsToSend(
                blueprint.plan.inputs,
                stateDeploymentInputs,
                inputsWithoutValue
            );
            InputsUtils.addErrors(inputsWithoutValue, errors);

            if (!_.isEmpty(errors)) {
                reject(errors);
            } else {
                resolve(deploymentInputs);
            }
        });
    }

    deployBlueprint(deploymentInputs) {
        const { BlueprintActions, InputsUtils } = Stage.Common;
        const { toolbox } = this.props;
        const {
            blueprint,
            deploymentName,
            runtimeOnlyEvaluation,
            siteName,
            skipPluginsValidation,
            visibility
        } = this.state;

        const blueprintActions = new BlueprintActions(toolbox);
        return blueprintActions
            .doDeploy(
                blueprint,
                deploymentName,
                deploymentInputs,
                visibility,
                skipPluginsValidation,
                siteName,
                runtimeOnlyEvaluation
            )
            .catch(err => Promise.reject(InputsUtils.getErrorObject(err.message)));
    }

    waitForDeploymentIsCreated(deploymentId) {
        const { DeploymentActions } = Stage.Common;
        const { toolbox } = this.props;

        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .waitUntilCreated(deploymentId)
            .catch(err => Promise.reject(`Deployment ${deploymentId} environment creation failed. ${err}`));
    }

    installDeployment(deploymentId, parameters, force, dryRun, queue, scheduledTime) {
        const { DeploymentActions } = Stage.Common;
        const { toolbox } = this.props;

        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .doExecute({ id: deploymentId }, { name: 'install' }, parameters, force, dryRun, queue, scheduledTime)
            .catch(err => Promise.reject({ errors: `Deployment ${deploymentId} installation failed: ${err.message}` }));
    }

    handleYamlFileChange(file) {
        if (!file) {
            return;
        }

        const { FileActions, InputsUtils } = Stage.Common;
        const { blueprint, deploymentInputs: deploymentInputsState } = this.state;
        const { toolbox } = this.props;
        const actions = new FileActions(toolbox);

        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                const deploymentInputs = InputsUtils.getUpdatedInputs(
                    blueprint.plan.inputs,
                    deploymentInputsState,
                    yamlInputs
                );
                this.setState({ errors: {}, deploymentInputs, fileLoading: false });
            })
            .catch(err => {
                const errorMessage = `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}`;
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    handleInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState(fieldNameValue);
    }

    handleDeploymentInputChange(proxy, field) {
        const { deploymentInputs } = this.state;
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...deploymentInputs, ...fieldNameValue } });
    }

    render() {
        const {
            ApproveButton,
            CancelButton,
            Form,
            Icon,
            LoadingOverlay,
            Message,
            Modal,
            VisibilityField
        } = Stage.Basic;
        const {
            DataTypesButton,
            InputsHeader,
            InputsUtils,
            YamlFileButton,
            DynamicDropdown,
            ExecuteDeploymentModal
        } = Stage.Common;
        const { onHide, open, toolbox } = this.props;
        const {
            blueprint,
            deploymentInputs,
            deploymentName,
            errors,
            fileLoading,
            loading,
            loadingMessage,
            runtimeOnlyEvaluation,
            showInstallModal,
            skipPluginsValidation,
            siteName,
            visibility
        } = this.state;
        const workflow = { ...blueprint.plan.workflows.install, name: 'install' };

        return (
            <Modal open={open} onClose={() => onHide()} className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="rocket" /> Deploy blueprint {blueprint.id}
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={v => this.setState({ visibility: v })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form errors={errors} scrollToError onErrorsDismiss={() => this.setState({ errors: {} })}>
                        {loading && <LoadingOverlay message={loadingMessage} />}
                        <Form.Field
                            error={errors.deploymentName}
                            label="Deployment name"
                            required
                            help="Specify a name for this deployment instance."
                        >
                            <Form.Input
                                name="deploymentName"
                                value={deploymentName}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field
                            error={errors.siteName}
                            label="Site name"
                            help="(Optional) Specify a site to which this deployment will be assigned."
                        >
                            <DynamicDropdown
                                value={siteName}
                                onChange={value => this.setState({ siteName: value })}
                                name="siteName"
                                fetchUrl="/sites?_include=name"
                                valueProp="name"
                                toolbox={toolbox}
                            />
                        </Form.Field>

                        {this.isBlueprintSelectable() && (
                            <Form.Field
                                error={errors.blueprintName}
                                label="Blueprint"
                                required
                                help="Select the blueprint based on which this deployment will be created."
                            >
                                <DynamicDropdown
                                    value={blueprint.id}
                                    name="blueprintName"
                                    fetchUrl="/blueprints?_include=id"
                                    onChange={this.selectBlueprint}
                                    toolbox={toolbox}
                                    prefetch
                                />
                            </Form.Field>
                        )}

                        {blueprint.id && (
                            <>
                                {!_.isEmpty(blueprint.plan.inputs) && (
                                    <YamlFileButton
                                        onChange={this.handleYamlFileChange}
                                        dataType="deployment's inputs"
                                        fileLoading={fileLoading}
                                    />
                                )}
                                {!_.isEmpty(blueprint.plan.data_types) && (
                                    <DataTypesButton types={blueprint.plan.data_types} />
                                )}
                                <InputsHeader />
                                {_.isEmpty(blueprint.plan.inputs) && (
                                    <Message content="No inputs available for the blueprint" />
                                )}
                            </>
                        )}

                        {InputsUtils.getInputFields(
                            blueprint.plan.inputs,
                            this.handleDeploymentInputChange,
                            deploymentInputs,
                            errors,
                            blueprint.plan.data_types
                        )}

                        <Form.Field className="skipPluginsValidationCheckbox">
                            <Form.Checkbox
                                toggle
                                label="Skip plugins validation"
                                name="skipPluginsValidation"
                                checked={skipPluginsValidation}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>
                        {skipPluginsValidation && (
                            <Message>
                                The recommended path is uploading plugins as wagons to Cloudify. This option is designed
                                for plugin development and advanced users only.
                            </Message>
                        )}

                        <Form.Field
                            help="If set, then get_property and get_input intrinsic functions will be evaluated
                                  on demand at runtime. If not set, then evaluation will be done at deployment creation time."
                        >
                            <Form.Checkbox
                                toggle
                                label="Runtime only evaluation"
                                name="runtimeOnlyEvaluation"
                                checked={runtimeOnlyEvaluation}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>
                    </Form>

                    <ExecuteDeploymentModal
                        open={showInstallModal}
                        workflow={workflow}
                        onExecute={this.onDeployAndInstall}
                        onHide={this.hideInstallModal}
                        toolbox={toolbox}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel} disabled={loading} />
                    <ApproveButton
                        onClick={this.onDeploy}
                        disabled={loading}
                        content="Deploy"
                        icon="rocket"
                        className="green"
                    />
                    <ApproveButton
                        onClick={this.showInstallModal}
                        disabled={loading}
                        content="Deploy & Install"
                        icon="cogs"
                        className="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

DeployBlueprintModal.propTypes = {
    /**
     * specifies whether the deploy modal is displayed
     */
    open: PropTypes.bool.isRequired,

    /**
     * Toolbox object
     */
    toolbox: PropTypes.shape({
        drillDown: PropTypes.func.isRequired,
        getEventBus: PropTypes.func.isRequired,
        getWidget: PropTypes.func.isRequired
    }).isRequired,

    /**
     * blueprintId, if set then Blueprint selection dropdown is not displayed
     */
    blueprintId: PropTypes.string,

    /**
     * function to be called when the modal is closed
     */
    onHide: PropTypes.func
};

DeployBlueprintModal.defaultProps = {
    blueprintId: '',
    onHide: _.noop
};

Stage.defineCommon({
    name: 'DeployBlueprintModal',
    common: DeployBlueprintModal
});
