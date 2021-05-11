import Consts from './Consts';

const { i18n } = Stage;
const t = (key, options) => i18n.t(`widgets.common.deployments.deployModal.${key}`, options);

class GenericDeployModal extends React.Component {
    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {}, workflows: { install: {} } } };

    static initialState = {
        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
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
        visibility: Consts.defaultVisibility,
        workflow: {},
        yamlFile: null
    };

    constructor(props) {
        super(props);

        this.state = GenericDeployModal.initialState;

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
            this.setState(GenericDeployModal.initialState, () => this.selectBlueprint(blueprintId));
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

    onSubmit(validationMessage, steps, installWorkflowParameters, installWorkflowOptions) {
        this.setState({ loading: true, errors: {} });
        this.setLoadingMessage(validationMessage);

        let stepPromise = this.validateInputs();

        const deploymentParameters = this.getDeploymentParams();

        steps.forEach(step => {
            stepPromise = stepPromise.then(previousStepOutcome => {
                this.setLoadingMessage(step.message);
                return step.executeStep(
                    previousStepOutcome,
                    deploymentParameters,
                    installWorkflowParameters,
                    installWorkflowOptions
                );
            });
        });

        return stepPromise.catch(errors => {
            this.setState({ loading: false, errors });
        });
    }

    onDeploy() {
        const { deployValidationMessage, deploySteps } = this.props;
        return this.onSubmit(deployValidationMessage, deploySteps);
    }

    onDeployAndInstall(installWorkflowParameters, installWorkflowOptions) {
        const { deployAndInstallValidationMessage, deployAndInstallSteps } = this.props;
        return this.onSubmit(
            deployAndInstallValidationMessage,
            deployAndInstallSteps,
            installWorkflowParameters,
            installWorkflowOptions
        );
    }

    getDeploymentParams() {
        const { InputsUtils } = Stage.Common;
        const {
            blueprint,
            deploymentName,
            runtimeOnlyEvaluation,
            labels,
            siteName,
            skipPluginsValidation,
            visibility,
            deploymentInputs
        } = this.state;

        return {
            blueprintId: blueprint.id,
            deploymentId: deploymentName,
            inputs: InputsUtils.getInputsMap(blueprint.plan.inputs, deploymentInputs),
            visibility,
            labels,
            skipPluginsValidation,
            siteName,
            runtimeOnlyEvaluation
        };
    }

    setLoadingMessage(message) {
        this.setState({ loadingMessage: message });
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
            this.setState({ loading: true, loadingMessage: t('inputs.deploymentInputs.loading') });
            const { toolbox } = this.props;
            const { BlueprintActions, InputsUtils } = Stage.Common;

            const actions = new BlueprintActions(toolbox);
            actions
                .doGetFullBlueprintData(id)
                .then(blueprint => {
                    const deploymentInputs = InputsUtils.getInputsInitialValuesFrom(blueprint.plan);
                    this.setState({ deploymentInputs, blueprint, errors: {}, loading: false });
                })
                .catch(err => {
                    this.setState({
                        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
                        loading: false,
                        errors: { error: err.message }
                    });
                });
        } else {
            this.setState({ blueprint: GenericDeployModal.EMPTY_BLUEPRINT, errors: {} });
        }
    }

    validateInputs() {
        return new Promise((resolve, reject) => {
            const { InputsUtils } = Stage.Common;
            const { blueprint, deploymentName, deploymentInputs: stateDeploymentInputs } = this.state;
            const { showDeploymentNameInput } = this.props;
            const errors = {};

            if (_.isEmpty(blueprint.id)) {
                errors.blueprintName = t('errors.noBlueprintName');
            }

            if (showDeploymentNameInput && _.isEmpty(deploymentName)) {
                errors.deploymentName = t('errors.noDeploymentName');
            }

            const inputsWithoutValue = InputsUtils.getInputsWithoutValues(blueprint.plan.inputs, stateDeploymentInputs);
            InputsUtils.addErrors(inputsWithoutValue, errors);

            if (!_.isEmpty(errors)) {
                reject(errors);
            } else {
                resolve();
            }
        });
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
        const {
            onHide,
            open,
            toolbox,
            i18nHeaderKey,
            showInstallOptions,
            showDeploymentNameInput,
            showDeployButton,
            showSitesInput
        } = this.props;
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
                    <Icon name="rocket" /> {i18n.t(i18nHeaderKey, { blueprintId: blueprint.id })}
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={v => this.setState({ visibility: v })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form errors={errors} scrollToError onErrorsDismiss={() => this.setState({ errors: {} })}>
                        {loading && <LoadingOverlay message={loadingMessage} />}
                        {showDeploymentNameInput && (
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
                        )}

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

                        {showSitesInput && (
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
                        )}

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
                        hideOptions={!showInstallOptions}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel} disabled={loading} />
                    {showDeployButton && (
                        <ApproveButton
                            onClick={this.onDeploy}
                            disabled={loading}
                            content={t('buttons.deploy')}
                            icon="rocket"
                            className="basic"
                        />
                    )}
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

const StepsPropType = PropTypes.arrayOf(
    PropTypes.shape({
        /**
         * Message to be displayed during step execution
         */
        message: PropTypes.string,

        /**
         * Function receiving previous step outcome and deployment parameters. In case of deploy & install flow install
         * workflow parameters and install workflow options are also passed to the function
         */
        executeStep: PropTypes.func
    })
);

GenericDeployModal.propTypes = {
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
    onHide: PropTypes.func,

    i18nHeaderKey: PropTypes.string.isRequired,

    /**
     * Whether to show deployment name input
     */
    showDeploymentNameInput: PropTypes.bool,

    /**
     * Whether to show 'Deploy' button, if not set only 'Deploy & Install' button is shown
     */
    showDeployButton: PropTypes.bool,

    /**
     * Whether to show install workflow options (force, dry run, queue, schedule)
     */
    showInstallOptions: PropTypes.bool,

    /**
     * Whether to show site selection input
     */
    showSitesInput: PropTypes.bool,

    /**
     * Steps to be executed on 'Deploy' button press, needs to be specified only when `showDeployButton` is enabled
     */
    deploySteps: StepsPropType,

    /**
     * Message to be displayed during inputs validation, before steps defined by `deploySteps` are executed, needs to be
     * specified only when `showDeployButton` is enabled
     */
    deployValidationMessage: PropTypes.string,

    /**
     * Steps to be executed on 'Deploy & Install' button press
     */
    deployAndInstallSteps: StepsPropType.isRequired,

    /**
     * Message to be displayed during inputs validation, before steps defined by `deployAndInstallSteps` are executed
     */
    deployAndInstallValidationMessage: PropTypes.string
};

GenericDeployModal.defaultProps = {
    blueprintId: '',
    onHide: _.noop,
    showDeploymentNameInput: false,
    showDeployButton: false,
    showInstallOptions: false,
    showSitesInput: false,
    deploySteps: null,
    deployValidationMessage: null,
    deployAndInstallValidationMessage: null
};

export default GenericDeployModal;
