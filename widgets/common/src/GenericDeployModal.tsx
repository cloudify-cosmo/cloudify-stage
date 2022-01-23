// @ts-nocheck File not migrated fully to TS
import Consts from './Consts';
import MissingSecretsError from './MissingSecretsError';
import AccordionSectionWithDivider from './AccordionSectionWithDivider';
import DeplomentInputsSection from './deployModal/DeploymentInputsSection';
import DeployModalActions, { Buttons } from './deployModal/DeployModalActions';
import InstallSection from './GenericInstall';
import { createInstallFunction, isWorkflowName, getWorkflowName } from './deployModal/execution';

const { i18n } = Stage;
const t = Stage.Utils.getT('widgets.common.deployments.deployModal');
const tExecute = Stage.Utils.getT('widgets.common.deployments.execute');

enum DEPLOYMENT_SECTIONS {
    deploymentInputs,
    deploymentMetadata,
    executionParameters,
    advanced,
    install
}
class GenericDeployModal extends React.Component {
    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {}, workflows: { install: {} } } };

    static initialInstallWorkflow = { ...GenericDeployModal.EMPTY_BLUEPRINT.plan.workflows.install, name: 'install' };

    static initialState = {
        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
        deploymentInputs: [],
        deploymentName: '',
        errors: {},
        areSecretsMissing: false,
        fileLoading: false,
        loading: false,
        loadingMessage: '',
        runtimeOnlyEvaluation: false,
        siteName: '',
        skipPluginsValidation: false,
        visibility: Consts.defaultVisibility,
        workflow: GenericDeployModal.initialInstallWorkflow,
        activeSection: 0,
        yamlFile: null,
        baseWorkflowParams: {},
        userWorkflowParams: {},
        force: false,
        dryRun: false,
        queue: false,
        schedule: false,
        scheduledTime: '',
        selectedButton: Buttons.install
    };

    constructor(props) {
        super(props);

        this.state = GenericDeployModal.initialState;

        this.selectBlueprint = this.selectBlueprint.bind(this);

        this.handleDeploymentInputChange = this.handleDeploymentInputChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleExecuteInputChange = this.handleExecuteInputChange.bind(this);
        this.handleYamlFileChange = this.handleYamlFileChange.bind(this);

        this.onCancel = this.onCancel.bind(this);
        this.onDeploy = this.onDeploy.bind(this);
        this.onDeployAndInstall = this.onDeployAndInstall.bind(this);

        this.onAccordionClick = this.onAccordionClick.bind(this);
        this.onErrorsDismiss = this.onErrorsDismiss.bind(this);
        this.setWorkflowParams = this.setWorkflowParams.bind(this);
        this.submitExecute = this.submitExecute.bind(this);
        this.createChangeEvent = this.createChangeEvent.bind(this);
    }

    componentDidMount() {
        const { DeploymentActions } = Stage.Common;
        const { toolbox } = this.props;
        const { workflow, deploymentId } = this.state;
        const actions = new DeploymentActions(toolbox);
        const workflowName = getWorkflowName(workflow);

        if (isWorkflowName(workflow)) {
            this.setState({ loading: true });
            actions
                .doGetWorkflows(deploymentId)
                .then(({ workflows }: { workflows: unknown[] }) => {
                    const selectedWorkflow: { name: string; [key: string]: undefined | unknown } = _.find(workflows, {
                        name: workflowName
                    });
                    if (selectedWorkflow) {
                        this.setWorkflowParams(selectedWorkflow);
                    } else {
                        this.setState({
                            errors: tExecute('errors.workflowError', {
                                deploymentId,
                                workflowName
                            })
                        });
                    }
                })
                .catch((err: { message: string }) => setErrors({ errors: err.message }))
                .finally(() => this.setState({ loading: false }));
        } else {
            this.setWorkflowParams(workflow);
        }
    }

    componentDidUpdate(prevProps) {
        const { blueprintId, open } = this.props;
        if (!prevProps.open && open) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ ...GenericDeployModal.initialState, deploymentId: Stage.Utils.uuid() }, () =>
                this.selectBlueprint(blueprintId)
            );
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

    handleExecuteInputChange(event, field) {
        this.setState(prevState => ({
            userWorkflowParams: { ...prevState.userWorkflowParams, ...Stage.Basic.Form.fieldNameValue(field) }
        }));
    }

    onAccordionClick(e, { index }) {
        const { activeSection } = this.state;
        const newIndex = activeSection === index ? -1 : index;

        this.setState({ activeSection: newIndex });
    }

    onErrorsDismiss() {
        this.setState({
            areSecretsMissing: false,
            errors: {}
        });
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

        const isMissingSecretsError = errors => {
            return errors.error?.includes('dsl_parser.exceptions.UnknownSecretError');
        };

        return stepPromise.catch(errors => {
            const { activeSection, deploymentInputs } = this.state;
            const errorKeys = Object.keys(errors);
            const deploymentInputKeys = Object.keys(deploymentInputs);
            let errorActiveSection = activeSection;
            if (errorKeys.some(errorKey => deploymentInputKeys.includes(errorKey))) {
                errorActiveSection = DEPLOYMENT_SECTIONS.deploymentInputs;
            } else if (errorKeys.includes('siteName')) {
                errorActiveSection = DEPLOYMENT_SECTIONS.deploymentMetadata;
            } else if (errorKeys.includes('deploymentId')) {
                errorActiveSection = DEPLOYMENT_SECTIONS.advanced;
            }
            this.setState({
                loading: false,
                errors,
                areSecretsMissing: isMissingSecretsError(errors),
                activeSection: errorActiveSection
            });
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

    setWorkflowParams(workflowResource) {
        const { InputsUtils } = Stage.Common;
        this.setState({
            baseWorkflowParams: workflowResource.parameters,
            userWorkflowParams: _.mapValues(workflowResource.parameters, parameterData =>
                InputsUtils.getInputFieldInitialValue(parameterData.default, parameterData.type)
            )
        });
    }

    getDeploymentParams() {
        const { InputsUtils } = Stage.Common;
        const {
            blueprint,
            deploymentName,
            deploymentId,
            runtimeOnlyEvaluation,
            labels,
            siteName,
            skipPluginsValidation,
            visibility,
            deploymentInputs
        } = this.state;

        return {
            blueprintId: blueprint.id,
            deploymentId,
            deploymentName,
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

    submitExecute() {
        const { toolbox } = this.props;
        const {
            workflow,
            baseWorkflowParams,
            userWorkflowParams,
            schedule,
            scheduledTime,
            force,
            dryRun,
            queue,
            deploymentId
        } = this.state;
        this.setState({ loading: true, errors: {} });
        return this.validateInputs()
            .then(
                createInstallFunction({
                    setLoading: () => this.setState({ loading: false }),
                    toolbox,
                    workflow,
                    baseWorkflowParams,
                    userWorkflowParams,
                    schedule,
                    scheduledTime,
                    force,
                    dryRun,
                    queue,
                    deploymentId,
                    setErrors: errors => this.setState({ errors }),
                    unsetLoading: () => this.setState({ loading: false }),
                    clearErrors: () => this.setState({ errors: {} }),
                    onExecute: this.onDeployAndInstall
                })
            )
            .catch(errors => {
                this.setState({ loading: false, errors });
            });
    }

    createChangeEvent(fieldName: string) {
        return (event, field) => {
            switch (fieldName) {
                case 'force':
                    this.setState({
                        errors: {},
                        queue: false,
                        force: field.checked
                    });
                    break;
                case 'dryRun':
                    this.setState({
                        errors: {},
                        queue: false,
                        dryRun: field.checked
                    });
                    break;
                case 'queue':
                    this.setState({
                        errors: {},
                        force: false,
                        dryRun: false,
                        schedule: false,
                        scheduledTime: '',
                        queue: field.checked
                    });
                    break;
                case 'schedule':
                    this.setState({
                        errors: {},
                        queue: false,
                        schedule: field.checked
                    });
                    break;
                case 'scheduledTime':
                    this.setState({ errors: {}, queue: false, scheduledTime: field.value });
                    break;
                default:
                    break;
            }
        };
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
                    this.setState({
                        deploymentInputs,
                        blueprint,
                        // workflow: blueprint.plan.workflows, // TODO: check if adding this line is the correct way to add workflows from blueprint
                        errors: {},
                        loading: false
                    });
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
            const { blueprint, deploymentId, deploymentName, deploymentInputs: stateDeploymentInputs } = this.state;
            const { showDeploymentNameInput, showDeploymentIdInput } = this.props;
            const errors = {};

            if (showDeploymentNameInput && _.isEmpty(deploymentName)) {
                errors.deploymentName = t('errors.noDeploymentName');
            }
            if (showDeploymentIdInput && _.isEmpty(deploymentId)) {
                errors.deploymentId = t('errors.noDeploymentId');
            }

            if (_.isEmpty(blueprint.id)) {
                errors.blueprintName = t('errors.noBlueprintName');
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
            Accordion,
            CancelButton,
            Button,
            Dropdown,
            DateInput,
            Divider,
            Header,
            Form,
            Icon,
            LoadingOverlay,
            Message,
            Modal,
            VisibilityField
        } = Stage.Basic;
        const {
            InputsHeader,
            InputsUtils,
            YamlFileButton,
            DynamicDropdown,
            Labels: { Input: LabelsInput }
        } = Stage.Common;
        const {
            onHide,
            open,
            toolbox,
            i18nHeaderKey,
            showInstallOptions,
            showDeploymentIdInput,
            showDeploymentNameInput,
            showDeployButton,
            showSitesInput,
            deploymentNameLabel,
            deploymentNameHelp
        } = this.props;
        const {
            activeSection,
            blueprint,
            deploymentInputs,
            deploymentId,
            deploymentName,
            errors,
            areSecretsMissing,
            fileLoading,
            loading,
            loadingMessage,
            runtimeOnlyEvaluation,
            skipPluginsValidation,
            siteName,
            visibility,
            baseWorkflowParams,
            userWorkflowParams,
            force,
            dryRun,
            queue,
            schedule,
            scheduledTime,
            selectedButton,
            workflow
        } = this.state;

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
                    <Form
                        errors={
                            areSecretsMissing ? (
                                <MissingSecretsError
                                    error={errors?.error}
                                    toolbox={toolbox}
                                    onAdd={this.onErrorsDismiss}
                                />
                            ) : (
                                errors
                            )
                        }
                        errorMessageHeader={areSecretsMissing ? t('errors.missingSecretsHeading') : undefined}
                        scrollToError
                        onErrorsDismiss={this.onErrorsDismiss}
                    >
                        {loading && <LoadingOverlay message={loadingMessage} />}

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

                        {showDeploymentNameInput && (
                            <Form.Field
                                error={errors.deploymentName}
                                label={deploymentNameLabel}
                                required
                                help={deploymentNameHelp}
                            >
                                <Form.Input
                                    name="deploymentName"
                                    value={deploymentName}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Field>
                        )}
                        <Accordion fluid>
                            <AccordionSectionWithDivider
                                title={t('sections.deploymentInputs')}
                                index={DEPLOYMENT_SECTIONS.deploymentInputs}
                                activeSection={activeSection}
                                onClick={this.onAccordionClick}
                            >
                                <DeplomentInputsSection
                                    blueprint={blueprint}
                                    onYamlFileChange={this.handleYamlFileChange}
                                    fileLoading={fileLoading}
                                    onDeploymentInputChange={this.handleDeploymentInputChange}
                                    deploymentInputs={deploymentInputs}
                                    errors={errors}
                                />
                            </AccordionSectionWithDivider>
                            <AccordionSectionWithDivider
                                title={t('sections.deploymentMetadata')}
                                index={DEPLOYMENT_SECTIONS.deploymentMetadata}
                                activeSection={activeSection}
                                onClick={this.onAccordionClick}
                            >
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
                            </AccordionSectionWithDivider>
                            <AccordionSectionWithDivider
                                title={t('sections.executionParameters')}
                                index={DEPLOYMENT_SECTIONS.executionParameters}
                                activeSection={activeSection}
                                onClick={this.onAccordionClick}
                            >
                                <Form.Field className="skipPluginsValidationCheckbox">
                                    <Form.Checkbox
                                        toggle
                                        label={t('inputs.skipPluginsValidation.label')}
                                        name="skipPluginsValidation"
                                        checked={skipPluginsValidation}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field>
                            </AccordionSectionWithDivider>
                            <AccordionSectionWithDivider
                                title={t('sections.advanced')}
                                index={DEPLOYMENT_SECTIONS.advanced}
                                activeSection={activeSection}
                                onClick={this.onAccordionClick}
                            >
                                {showDeploymentIdInput && (
                                    <Form.Field
                                        error={errors.deploymentId}
                                        label={t('inputs.deploymentId.label')}
                                        required
                                        help={t('inputs.deploymentId.help')}
                                    >
                                        <Form.Input
                                            name="deploymentId"
                                            value={deploymentId}
                                            onChange={this.handleInputChange}
                                        />
                                    </Form.Field>
                                )}
                                {skipPluginsValidation && (
                                    <Message>{t('inputs.skipPluginsValidation.message')}</Message>
                                )}

                                <Form.Field help={t('inputs.runtimeOnlyEvaluation.help')}>
                                    <Form.Checkbox
                                        toggle
                                        label={t('inputs.runtimeOnlyEvaluation.label')}
                                        name="runtimeOnlyEvaluation"
                                        checked={runtimeOnlyEvaluation}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field>
                            </AccordionSectionWithDivider>
                            {selectedButton === Buttons.install && (
                                <AccordionSectionWithDivider
                                    title={t('sections.install')}
                                    index={DEPLOYMENT_SECTIONS.install}
                                    activeSection={activeSection}
                                    onClick={this.onAccordionClick}
                                >
                                    <InstallSection
                                        baseWorkflowParams={baseWorkflowParams}
                                        userWorkflowParams={userWorkflowParams}
                                        handleYamlFileChange={this.handleYamlFileChange}
                                        handleExecuteInputChange={this.handleExecuteInputChange}
                                        fileLoading={fileLoading}
                                        errors={errors}
                                        showInstallOptions={showInstallOptions}
                                        force={force}
                                        dryRun={dryRun}
                                        queue={queue}
                                        schedule={schedule}
                                        scheduledTime={scheduledTime}
                                        createChangeEvent={this.createChangeEvent}
                                    />
                                </AccordionSectionWithDivider>
                            )}
                        </Accordion>
                    </Form>
                </Modal.Content>

                <DeployModalActions
                    loading={loading}
                    showDeployButton={showDeployButton}
                    onCancel={this.onCancel}
                    onInstall={this.submitExecute}
                    onDeploy={this.onDeploy}
                    selectedButton={selectedButton}
                    setSelectedButton={(value, field) =>
                        this.setState({ selectedButton: field ? field.value ?? field.checked : value })
                    }
                />
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
     * Whether to show deployment ID input
     */
    showDeploymentIdInput: PropTypes.bool,

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
    deployAndInstallValidationMessage: PropTypes.string,

    /**
     * Deployment Name input label
     */
    deploymentNameLabel: PropTypes.string,

    /**
     * Deployment Name input help description
     */
    deploymentNameHelp: PropTypes.string
};

GenericDeployModal.defaultProps = {
    blueprintId: '',
    onHide: _.noop,
    showDeploymentNameInput: false,
    showDeploymentIdInput: false,
    showDeployButton: false,
    showInstallOptions: false,
    showSitesInput: false,
    deploySteps: null,
    deployValidationMessage: null,
    deployAndInstallValidationMessage: null,
    deploymentNameLabel: t('inputs.deploymentName.label'),
    deploymentNameHelp: t('inputs.deploymentName.help')
};

export default GenericDeployModal;
