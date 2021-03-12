const { i18n } = Stage;
const t = (key, options) => i18n.t(`widgets.common.deployments.deployModal.${key}`, options);

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
        [steps.validateData]: t('steps.deploy.validatingData'),
        [steps.deployBlueprint]: t('steps.deploy.deployingBlueprint')
    },
    [paths.deployAndInstall]: {
        [steps.validateData]: t('steps.deployAndInstall.validatingData'),
        [steps.deployBlueprint]: t('steps.deployAndInstall.deployingBlueprint'),
        [steps.waitForDeployment]: t('steps.deployAndInstall.waitingForDeployment'),
        [steps.installDeployment]: t('steps.deployAndInstall.installingDeployment')
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

    handleDeploymentInputChange(proxy, field) {
        const { deploymentInputs } = this.state;
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...deploymentInputs, ...fieldNameValue } });
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
                const errorMessage = t('errors.loadingYamlFileFailed', {
                    reason: _.isString(err) ? err : err.message
                });
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    handleInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState(fieldNameValue);
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
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

    setLoadingMessage(path, step) {
        // eslint-disable-next-line security/detect-object-injection
        this.setState({ loadingMessage: messages[path][step] });
    }

    openDeploymentPage(deploymentId) {
        const { toolbox } = this.props;
        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId }, deploymentId);
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
            this.setState({ loading: true, loadingMessage: t('deploymentInputs.loading') });
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
                errors.blueprintName = t('errors.noBlueprintName');
            }

            if (_.isEmpty(deploymentName)) {
                errors.deploymentName = t('errors.noDeploymentName');
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

    deployBlueprint(inputs) {
        const { BlueprintActions, InputsUtils } = Stage.Common;
        const { toolbox } = this.props;
        const {
            blueprint,
            deploymentName,
            runtimeOnlyEvaluation,
            labels,
            siteName,
            skipPluginsValidation,
            visibility
        } = this.state;

        const blueprintActions = new BlueprintActions(toolbox);
        return blueprintActions
            .doDeploy({
                blueprintId: blueprint.id,
                deploymentId: deploymentName,
                inputs,
                visibility,
                labels,
                skipPluginsValidation,
                siteName,
                runtimeOnlyEvaluation
            })
            .catch(err => Promise.reject(InputsUtils.getErrorObject(err.message)));
    }

    waitForDeploymentIsCreated(deploymentId) {
        const { DeploymentActions } = Stage.Common;
        const { toolbox } = this.props;

        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .waitUntilCreated(deploymentId)
            .catch(error => Promise.reject(t('errors.deploymentCreationFailed', { deploymentId, error })));
    }

    installDeployment(deploymentId, parameters, force, dryRun, queue, scheduledTime) {
        const { DeploymentActions } = Stage.Common;
        const { toolbox } = this.props;

        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .doExecute({ id: deploymentId }, { name: 'install' }, parameters, force, dryRun, queue, scheduledTime)
            .catch(error =>
                Promise.reject({
                    errors: t('errors.deploymentInstallationFailed', {
                        deploymentId,
                        error: error.message
                    })
                })
            );
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
            ExecuteDeploymentModal,
            Labels: { Input: LabelsInput }
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
                            label={t('inputs.deploymentName.label')}
                            required
                            help={t('inputs.deploymentName.help')}
                        >
                            <Form.Input
                                name="deploymentName"
                                value={deploymentName}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        {this.isBlueprintSelectable() && (
                            <Form.Field
                                error={errors.blueprintName}
                                label={t('inputs.blueprintName.label')}
                                required
                                help={t('inputs.blueprintName.help')}
                            >
                                <DynamicDropdown
                                    value={blueprint.id}
                                    name="blueprintName"
                                    fetchUrl="/blueprints?_include=id&state=uploaded"
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
                                    <Message content={t('inputs.deploymentInputs.noInputs')} />
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

                        <Form.Divider>{t('sections.deploymentMetadata')}</Form.Divider>

                        <Form.Field
                            error={errors.siteName}
                            label={t('inputs.siteName.label')}
                            help={t('inputs.siteName.help')}
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

                        <Form.Field
                            label={i18n.t('widgets.common.labels.input.label')}
                            help={i18n.t('widgets.common.labels.input.help')}
                        >
                            <LabelsInput
                                toolbox={toolbox}
                                hideInitialLabels
                                onChange={labels => this.setState({ labels })}
                            />
                        </Form.Field>

                        <Form.Divider>{t('sections.executionParameters')}</Form.Divider>

                        <Form.Field className="skipPluginsValidationCheckbox">
                            <Form.Checkbox
                                toggle
                                label={t('inputs.skipPluginsValidation.label')}
                                name="skipPluginsValidation"
                                checked={skipPluginsValidation}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>
                        {skipPluginsValidation && <Message>{t('inputs.skipPluginsValidation.message')}</Message>}

                        <Form.Field help={t('inputs.runtimeOnlyEvaluation.help')}>
                            <Form.Checkbox
                                toggle
                                label={t('inputs.runtimeOnlyEvaluation.label')}
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
                        content={t('buttons.deploy')}
                        icon="rocket"
                        className="basic"
                    />
                    <ApproveButton
                        onClick={this.showInstallModal}
                        disabled={loading}
                        content={t('buttons.deployAndInstall')}
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
    toolbox: Stage.PropTypes.Toolbox.isRequired,

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
