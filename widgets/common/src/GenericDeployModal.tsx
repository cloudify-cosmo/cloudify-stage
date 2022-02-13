import type { AccordionTitleProps, CheckboxProps } from 'semantic-ui-react';
import type { ChangeEvent } from 'react';
import Consts from './Consts';
import MissingSecretsError from './MissingSecretsError';
import AccordionSectionWithDivider from './AccordionSectionWithDivider';
import DeplomentInputsSection from './deployModal/DeploymentInputsSection';
import DeployModalActions, { Buttons as ApproveButtons } from './deployModal/DeployModalActions';
import { ExecuteWorkflowInputs, getWorkflowName, executeWorkflow } from './executeWorkflow';
import type {
    BaseWorkflowInputs,
    UserWorkflowInputsState,
    Workflow,
    WorkflowParameters,
    WorkflowOptions
} from './executeWorkflow';
import type { DropdownValue, Field } from './types';
import type { BlueprintDeployParams } from './BlueprintActions';
import type { Label } from './labels/types';

const { i18n } = Stage;
const t = Stage.Utils.getT('widgets.common.deployments.deployModal');
const tExecute = Stage.Utils.getT('widgets.common.deployments.execute');

type Blueprint = {
    description?: string;
    imports?: string[];
    inputs?: Record<string, any>;
    // eslint-disable-next-line camelcase
    node_templates?: Record<string, any>;
    // eslint-disable-next-line camelcase
    tosca_definitions_version?: string;
};

type Errors = Record<string, string>;

type StepsProp = {
    message: string;
    executeStep: (
        previousStepOutcome: any,
        deploymentParameters: BlueprintDeployParams & { deploymentId: string },
        installWorkflowParameters?: WorkflowParameters,
        installWorkflowOptions?: WorkflowOptions
    ) => void;
};

type GenericDeployModalProps = {
    /**
     * specifies whether the deploy modal is displayed
     */
    open: boolean;

    /**
     * Toolbox object
     */
    toolbox: Stage.Types.Toolbox;

    /**
     * blueprintId, if set then Blueprint selection dropdown is not displayed
     */
    blueprintId: string;

    /**
     * function to be called when the modal is closed
     */
    onHide: () => void;

    i18nHeaderKey: string;

    /**
     * Whether to show deployment name input
     */
    showDeploymentNameInput?: boolean;

    /**
     * Whether to show deployment ID input
     */
    showDeploymentIdInput?: boolean;

    /**
     * Whether to show 'Deploy' button, if not set only 'Deploy & Install' button is shown
     */
    showDeployButton: boolean;

    /**
     * Whether to show install workflow options (force, dry run, queue, schedule)
     */
    showInstallOptions?: boolean;

    /**
     * Whether to show site selection input
     */
    showSitesInput?: boolean;

    /**
     * Steps to be executed on 'Deploy' button press, needs to be specified only when `showDeployButton` is enabled
     */
    deploySteps: StepsProp[];

    /**
     * Message to be displayed during inputs validation, before steps defined by `deploySteps` are executed, needs to be
     * specified only when `showDeployButton` is enabled
     */
    deployValidationMessage: string;

    /**
     * Steps to be executed on 'Deploy & Install' button press
     */
    deployAndInstallSteps: StepsProp[];

    /**
     * Message to be displayed during inputs validation, before steps defined by `deployAndInstallSteps` are executed
     */
    deployAndInstallValidationMessage: string;

    /**
     * Deployment Name input label
     */
    deploymentNameLabel?: string;

    /**
     * Deployment Name input help description
     */
    deploymentNameHelp?: string;
};

const defaultProps: Partial<GenericDeployModalProps> = {
    blueprintId: '',
    onHide: _.noop,
    showDeploymentNameInput: false,
    showDeploymentIdInput: false,
    showDeployButton: false,
    showInstallOptions: false,
    showSitesInput: false,
    deploySteps: [],
    deployValidationMessage: '',
    deployAndInstallValidationMessage: '',
    deploymentNameLabel: t('inputs.deploymentName.label'),
    deploymentNameHelp: t('inputs.deploymentName.help')
};

type GenericDeployModalState = {
    activeSection: any;
    areSecretsMissing: boolean;
    blueprint: any;
    deploymentId: string;
    deploymentInputs: Record<string, unknown>;
    deploymentName: string;
    errors: Errors;
    fileLoading: boolean;
    labels: Label[];
    loading: boolean;
    loadingMessage: string;
    runtimeOnlyEvaluation: boolean;
    showInstallModal: boolean;
    siteName: string;
    skipPluginsValidation: boolean;
    visibility: any;
    workflow: Workflow;
    baseWorkflowParams: BaseWorkflowInputs;
    userWorkflowParams: UserWorkflowInputsState;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
    selectedApproveButton: ApproveButtons;
};

class GenericDeployModal extends React.Component<GenericDeployModalProps, GenericDeployModalState> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = defaultProps;

    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {}, workflows: { install: {} } } };

    static DEPLOYMENT_SECTIONS = {
        deploymentInputs: 0,
        deploymentMetadata: 1,
        executionParameters: 2,
        advanced: 3,
        install: 4
    };

    static initialInstallWorkflow: Workflow = {
        ...GenericDeployModal.EMPTY_BLUEPRINT.plan.workflows.install,
        name: 'install',
        parameters: {},
        plugin: ''
    };

    static initialState = {
        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
        deploymentInputs: {},
        deploymentName: '',
        errors: {},
        areSecretsMissing: false,
        fileLoading: false,
        loading: false,
        loadingMessage: '',
        runtimeOnlyEvaluation: false,
        showInstallModal: false,
        siteName: '',
        skipPluginsValidation: false,
        visibility: Consts.defaultVisibility,
        workflow: GenericDeployModal.initialInstallWorkflow,
        activeSection: 0,
        deploymentId: '',
        labels: [],
        baseWorkflowParams: {},
        userWorkflowParams: {},
        force: false,
        dryRun: false,
        queue: false,
        schedule: false,
        scheduledTime: '',
        selectedApproveButton: ApproveButtons.install
    };

    constructor(props: GenericDeployModalProps) {
        super(props);

        this.state = GenericDeployModal.initialState;

        this.selectBlueprint = this.selectBlueprint.bind(this);

        this.handleDeploymentInputChange = this.handleDeploymentInputChange.bind(this);
        this.handleYamlFileChange = this.handleYamlFileChange.bind(this);
        this.handleExecuteInputChange = this.handleExecuteInputChange.bind(this);

        this.onCancel = this.onCancel.bind(this);
        this.onDeploy = this.onDeploy.bind(this);
        this.onDeployAndInstall = this.onDeployAndInstall.bind(this);
        this.submitExecute = this.submitExecute.bind(this);

        this.onAccordionClick = this.onAccordionClick.bind(this);
        this.onErrorsDismiss = this.onErrorsDismiss.bind(this);
        this.setWorkflowParams = this.setWorkflowParams.bind(this);

        this.onForceChange = this.onForceChange.bind(this);
        this.onDryRunChange = this.onDryRunChange.bind(this);
        this.onQueueChange = this.onQueueChange.bind(this);
        this.onScheduleChange = this.onScheduleChange.bind(this);
        this.onScheduledTimeChange = this.onScheduledTimeChange.bind(this);
    }

    componentDidMount() {
        const { DeploymentActions } = Stage.Common;
        const { toolbox } = this.props;
        const { workflow, deploymentId } = this.state;
        const actions = new DeploymentActions(toolbox);
        const workflowName = getWorkflowName(workflow);

        if (typeof workflow === 'string') {
            this.setState({ loading: true });
            actions
                .doGetWorkflows(deploymentId)
                .then(({ workflows }: { workflows: unknown[] }) => {
                    const selectedWorkflow = _.find(workflows, {
                        name: workflowName
                    }) as { parameters: BaseWorkflowInputs };
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
                .catch((err: { message: string }) => this.setState({ errors: err }))
                .finally(() => this.setState({ loading: false }));
        } else {
            this.setWorkflowParams(workflow);
        }
    }

    componentDidUpdate(prevProps: GenericDeployModalProps) {
        const { blueprintId, open } = this.props;
        if (!prevProps.open && open) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ ...GenericDeployModal.initialState, deploymentId: Stage.Utils.uuid() }, () =>
                this.selectBlueprint(blueprintId)
            );
        }
    }

    handleDeploymentInputChange(_: ChangeEvent<Element>, field: Field) {
        const { deploymentInputs } = this.state;
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...deploymentInputs, ...fieldNameValue } });
    }

    handleYamlFileChange(file: File) {
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
            .then((yamlInputs: Blueprint) => {
                const deploymentInputs = InputsUtils.getUpdatedInputs(
                    blueprint.plan.inputs,
                    deploymentInputsState,
                    yamlInputs
                );
                this.setState({ errors: {}, deploymentInputs, fileLoading: false });
            })
            .catch((err: string | { message: string }) => {
                const errorMessage = t('errors.loadingYamlFileFailed', {
                    reason: typeof err === 'string' ? err : err.message
                });
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    handleExecuteInputChange(_event: React.SyntheticEvent<HTMLElement>, field: any) {
        this.setState((prevState: any) => {
            return {
                userWorkflowParams: { ...prevState.userWorkflowParams, ...Stage.Basic.Form.fieldNameValue(field) }
            };
        });
    }

    onAccordionClick(_: React.MouseEvent<HTMLDivElement, MouseEvent>, { index }: AccordionTitleProps) {
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

    onSubmit(
        validationMessage: string,
        steps: StepsProp[],
        installWorkflowParameters?: WorkflowParameters,
        installWorkflowOptions?: WorkflowOptions
    ) {
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

        const isMissingSecretsError = (errors: Errors) => {
            return errors.error?.includes('dsl_parser.exceptions.UnknownSecretError');
        };

        return stepPromise.catch(errors => {
            const { DEPLOYMENT_SECTIONS } = GenericDeployModal;
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

    onDeployAndInstall(installWorkflowParameters: WorkflowParameters, installWorkflowOptions: WorkflowOptions) {
        const { deployAndInstallValidationMessage, deployAndInstallSteps } = this.props;
        return this.onSubmit(
            deployAndInstallValidationMessage,
            deployAndInstallSteps,
            installWorkflowParameters,
            installWorkflowOptions
        );
    }

    onForceChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            queue: false,
            force: checked as boolean
        });
    }

    onDryRunChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            queue: false,
            dryRun: checked as boolean
        });
    }

    onQueueChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            force: false,
            dryRun: false,
            schedule: false,
            scheduledTime: '',
            queue: checked as boolean
        });
    }

    onScheduleChange(_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        this.setState({
            errors: {},
            queue: false,
            schedule: checked as boolean
        });
    }

    onScheduledTimeChange(_event: Event, { value }: { name?: string | undefined; value?: string | undefined }) {
        this.setState({ errors: {}, queue: false, scheduledTime: value as string });
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

    setWorkflowParams(workflowResource: { parameters: BaseWorkflowInputs }) {
        const { InputsUtils } = Stage.Common;
        this.setState({
            baseWorkflowParams: workflowResource.parameters,
            userWorkflowParams: _.mapValues(workflowResource.parameters, parameterData =>
                InputsUtils.getInputFieldInitialValue(parameterData.default, parameterData.type)
            )
        });
    }

    setLoadingMessage(message: string) {
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
        const deploymentsList: string[] = _.compact([deploymentId]);
        // const deploymentsList: string[] = _.isEmpty(deployments) ? _.compact([deploymentId]) : deployments;
        this.setState({ loading: true, errors: {} });
        return this.validateInputs()
            .then(() =>
                executeWorkflow({
                    deploymentsList,
                    setLoading: () => this.setState({ loading: false }),
                    toolbox,
                    workflow,
                    baseWorkflowInputs: baseWorkflowParams,
                    userWorkflowInputsState: userWorkflowParams,
                    schedule,
                    scheduledTime,
                    force,
                    dryRun,
                    queue,
                    setErrors: err => {
                        if (typeof err === 'string') {
                            this.setState({ errors: { message: err } });
                        } else {
                            this.setState({ errors: err });
                        }
                    },
                    unsetLoading: () => this.setState({ loading: false }),
                    clearErrors: () => this.setState({ errors: {} }),
                    onExecute: this.onDeployAndInstall,
                    onHide: () => {}
                })
            )
            .catch(errors => {
                this.setState({ loading: false, errors });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    isBlueprintSelectable() {
        const { blueprintId } = this.props;
        return _.isEmpty(blueprintId);
    }

    selectBlueprint(id: DropdownValue) {
        if (!_.isEmpty(id) && typeof id === 'string') {
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
        return new Promise<void>((resolve, reject) => {
            const { InputsUtils } = Stage.Common;
            const { blueprint, deploymentId, deploymentName, deploymentInputs: stateDeploymentInputs } = this.state;
            const { showDeploymentNameInput, showDeploymentIdInput } = this.props;
            const errors: Errors = {};

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
            Accordion,
            Form,
            UnsafelyTypedFormField,
            Icon,
            LoadingOverlay,
            Message,
            Modal,
            VisibilityField
        } = Stage.Basic;
        const {
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
            selectedApproveButton
        } = this.state;
        const { DEPLOYMENT_SECTIONS } = GenericDeployModal;

        return (
            <Modal open={open} onClose={onHide} className="deployBlueprintModal">
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
                            <UnsafelyTypedFormField
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
                            </UnsafelyTypedFormField>
                        )}

                        {showDeploymentNameInput && (
                            <UnsafelyTypedFormField
                                error={errors.deploymentName}
                                label={deploymentNameLabel}
                                required
                                help={deploymentNameHelp}
                            >
                                <Form.Input
                                    name="deploymentName"
                                    value={deploymentName}
                                    onChange={(_: ChangeEvent<HTMLInputElement>, { value }: { value: string }) =>
                                        this.setState({ deploymentName: value })
                                    }
                                />
                            </UnsafelyTypedFormField>
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
                                    <UnsafelyTypedFormField
                                        error={errors.siteName}
                                        label={t('inputs.siteName.label')}
                                        help={t('inputs.siteName.help')}
                                    >
                                        <DynamicDropdown
                                            value={siteName}
                                            onChange={value =>
                                                typeof value === 'string' && this.setState({ siteName: value })
                                            }
                                            name="siteName"
                                            fetchUrl="/sites?_include=name"
                                            valueProp="name"
                                            toolbox={toolbox}
                                        />
                                    </UnsafelyTypedFormField>
                                )}

                                <UnsafelyTypedFormField
                                    label={i18n.t('widgets.common.labels.input.label')}
                                    help={i18n.t('widgets.common.labels.input.help')}
                                >
                                    <LabelsInput
                                        toolbox={toolbox}
                                        hideInitialLabels
                                        onChange={(labels: Label[]) => this.setState({ labels })}
                                    />
                                </UnsafelyTypedFormField>
                            </AccordionSectionWithDivider>
                            <AccordionSectionWithDivider
                                title={t('sections.executionParameters')}
                                index={DEPLOYMENT_SECTIONS.executionParameters}
                                activeSection={activeSection}
                                onClick={this.onAccordionClick}
                            >
                                <UnsafelyTypedFormField className="skipPluginsValidationCheckbox">
                                    <Form.Checkbox
                                        toggle
                                        label={t('inputs.skipPluginsValidation.label')}
                                        name="skipPluginsValidation"
                                        checked={skipPluginsValidation}
                                        onChange={(_: undefined, { checked }: { checked: boolean }) =>
                                            this.setState({ skipPluginsValidation: checked })
                                        }
                                        help=""
                                    />
                                </UnsafelyTypedFormField>
                            </AccordionSectionWithDivider>
                            <AccordionSectionWithDivider
                                title={t('sections.advanced')}
                                index={DEPLOYMENT_SECTIONS.advanced}
                                activeSection={activeSection}
                                onClick={this.onAccordionClick}
                            >
                                {showDeploymentIdInput && (
                                    <UnsafelyTypedFormField
                                        error={errors.deploymentId}
                                        label={t('inputs.deploymentId.label')}
                                        required
                                        help={t('inputs.deploymentId.help')}
                                    >
                                        <Form.Input
                                            name="deploymentId"
                                            value={deploymentId}
                                            onChange={(
                                                _: ChangeEvent<HTMLInputElement>,
                                                { value }: { value: string }
                                            ) => this.setState({ deploymentId: value })}
                                        />
                                    </UnsafelyTypedFormField>
                                )}
                                {skipPluginsValidation && (
                                    <Message>{t('inputs.skipPluginsValidation.message')}</Message>
                                )}

                                <UnsafelyTypedFormField help={t('inputs.runtimeOnlyEvaluation.help')}>
                                    <Form.Checkbox
                                        toggle
                                        label={t('inputs.runtimeOnlyEvaluation.label')}
                                        name="runtimeOnlyEvaluation"
                                        checked={runtimeOnlyEvaluation}
                                        onChange={(_: undefined, { checked }: { checked: boolean }) =>
                                            this.setState({ runtimeOnlyEvaluation: checked })
                                        }
                                        help=""
                                    />
                                </UnsafelyTypedFormField>
                            </AccordionSectionWithDivider>
                            {selectedApproveButton === ApproveButtons.install && (
                                <AccordionSectionWithDivider
                                    title={t('sections.install')}
                                    index={DEPLOYMENT_SECTIONS.install}
                                    activeSection={activeSection}
                                    onClick={this.onAccordionClick}
                                >
                                    <ExecuteWorkflowInputs
                                        baseWorkflowInputs={baseWorkflowParams}
                                        userWorkflowInputsState={userWorkflowParams}
                                        onYamlFileChange={this.handleYamlFileChange}
                                        onWorkflowInputChange={this.handleExecuteInputChange}
                                        fileLoading={fileLoading}
                                        errors={errors}
                                        showInstallOptions={showInstallOptions}
                                        force={force}
                                        dryRun={dryRun}
                                        queue={queue}
                                        schedule={schedule}
                                        scheduledTime={scheduledTime}
                                        onForceChange={this.onForceChange}
                                        onDryRunChange={this.onDryRunChange}
                                        onQueueChange={this.onQueueChange}
                                        onScheduleChange={this.onScheduleChange}
                                        onScheduledTimeChange={this.onScheduledTimeChange}
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
                    selectedApproveButton={selectedApproveButton}
                    onApproveButtonChange={(value, field) =>
                        this.setState({ selectedApproveButton: field ? field.value ?? field.checked : value })
                    }
                />
            </Modal>
        );
    }
}

export default GenericDeployModal;
