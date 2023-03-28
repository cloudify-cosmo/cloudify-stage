import type { ChangeEvent, SyntheticEvent } from 'react';
import React from 'react';
import type { AccordionTitleProps, CheckboxProps } from 'semantic-ui-react';
import type { DateInputProps } from 'cloudify-ui-components';
import { compact, isEmpty, mapValues, noop } from 'lodash';
import i18n from 'i18next';
import FileActions from '../actions/FileActions';
import type { BlueprintDeployParams, FullBlueprintData } from '../blueprints/BlueprintActions';
import BlueprintActions from '../blueprints/BlueprintActions';
import DynamicDropdown from '../components/DynamicDropdown';
import Consts from '../Consts';
import LabelsInput from '../labels/LabelsInput';
import MissingSecretsError from '../secrets/MissingSecretsError';
import AccordionSectionWithDivider from '../components/accordion/AccordionSectionWithDivider';
import DeploymentInputs from './DeploymentInputs';
import DeployModalActions, { Buttons as ApproveButtons } from './DeployModalActions';
import type {
    BaseWorkflowInputs,
    UserWorkflowInputsState,
    Workflow,
    WorkflowOptions,
    WorkflowParameters
} from '../executeWorkflow';
import { executeWorkflow, ExecuteWorkflowInputs } from '../executeWorkflow';
import type { DropdownValue, Field } from '../types';
import type { Label } from '../labels/types';
import getInputFieldInitialValue from '../inputs/utils/getInputFieldInitialValue';
import getUpdatedInputs from '../inputs/utils/getUpdatedInputs';
import getInputsMap from '../inputs/utils/getInputsMap';
import getInputsInitialValues from '../inputs/utils/getInputsInitialValues';
import { addErrors } from '../inputs/utils/errors';
import getInputsWithoutValues from '../inputs/utils/getInputsWithoutValues';
import type { FilterRule } from '../filters/types';
import { parentDeploymentLabelKey } from '../deploymentsView/common';
import StageUtils from '../../../utils/stageUtils';
import { Accordion, Form, Icon, LoadingOverlay, Message, Modal, VisibilityField } from '../../../components/basic';
import EnvironmentDropdown from './EnvironmentDropdown';
import BlueprintDropdown from './BlueprintDropdown';
import type { FullDeploymentData } from '../deployments/DeploymentActions';

const t = StageUtils.getT('widgets.common.deployments.deployModal');

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

type ExecuteStep = (
    deploymentIdOrPreviousStepOutcome: string | any,
    deploymentParameters: BlueprintDeployParams,
    installWorkflowParameters?: WorkflowParameters,
    installWorkflowOptions?: WorkflowOptions
) => void;

type StepsProp = {
    message?: string;
    executeStep: ExecuteStep;
};

export type GenericDeployModalProps = {
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
    blueprintId?: string;

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

    /**
     * Filter rules for blueprints listing
     */
    blueprintFilterRules?: FilterRule[];

    /**
     * Deployment on which submitted blueprint should be deployed on
     */
    environmentToDeployOn?: {
        id: string;
        displayName: string;
        capabilities: FullDeploymentData['capabilities'];
    };
};

const defaultProps: Partial<GenericDeployModalProps> = {
    blueprintId: '',
    onHide: noop,
    showDeploymentNameInput: false,
    showDeploymentIdInput: false,
    showDeployButton: false,
    showInstallOptions: false,
    showSitesInput: false,
    deploySteps: [],
    deployValidationMessage: '',
    deployAndInstallValidationMessage: '',
    blueprintFilterRules: []
};

type GenericDeployModalState = {
    activeSection: any;
    areSecretsMissing: boolean;
    blueprint: typeof GenericDeployModal.EMPTY_BLUEPRINT | FullBlueprintData;
    deploymentId: string;
    deploymentInputs: Record<string, unknown>;
    deploymentName: string;
    errors: Errors;
    fileLoading: boolean;
    labels: Label[];
    initialLabels?: Label[];
    loading: boolean;
    loadingMessage: string;
    runtimeOnlyEvaluation: boolean;
    siteName: string;
    skipPluginsValidation: boolean;
    visibility: any;
    installWorkflow: Workflow;
    baseInstallWorkflowParams: BaseWorkflowInputs;
    userInstallWorkflowParams: UserWorkflowInputsState;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
    selectedApproveButton: ApproveButtons;
    showDeployOnDropdown: boolean;
    deploymentIdToDeployOn: string;
};

class GenericDeployModal extends React.Component<GenericDeployModalProps, GenericDeployModalState> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = defaultProps;

    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {}, workflows: { install: {} } }, requirements: {} };

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
        plugin: '',
        is_available: true
    };

    static initialState: GenericDeployModalState = {
        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
        deploymentInputs: {},
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
        installWorkflow: GenericDeployModal.initialInstallWorkflow,
        activeSection: 0,
        deploymentId: '',
        labels: [],
        baseInstallWorkflowParams: {},
        userInstallWorkflowParams: {},
        force: false,
        dryRun: false,
        queue: false,
        schedule: false,
        scheduledTime: '',
        selectedApproveButton: ApproveButtons.install,
        showDeployOnDropdown: false,
        deploymentIdToDeployOn: ''
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

        this.onAccordionClick = this.onAccordionClick.bind(this);
        this.onErrorsDismiss = this.onErrorsDismiss.bind(this);

        this.onForceChange = this.onForceChange.bind(this);
        this.onDryRunChange = this.onDryRunChange.bind(this);
        this.onQueueChange = this.onQueueChange.bind(this);
        this.onScheduleChange = this.onScheduleChange.bind(this);

        this.getModalHeader = this.getModalHeader.bind(this);
    }

    componentDidMount() {
        const { installWorkflow } = this.state;
        this.setState({
            baseInstallWorkflowParams: installWorkflow.parameters,
            userInstallWorkflowParams: mapValues(installWorkflow.parameters, parameterData =>
                getInputFieldInitialValue(parameterData.default, parameterData.type)
            ),
            deploymentId: StageUtils.uuid()
        });
    }

    componentDidUpdate(prevProps: GenericDeployModalProps) {
        const { blueprintId, open, toolbox } = this.props;

        const getStateFromContext = (
            contextKey: 'siteName' | 'deploymentName' | 'labels' | 'deploymentInputs',
            stateKey?: 'initialLabels'
        ) => {
            const contextValue = toolbox.getContext().getValue(contextKey);
            if (contextValue) {
                this.setState({ [stateKey ?? contextKey]: contextValue } as GenericDeployModalState);
                toolbox.getContext().setValue(contextKey, undefined);
            }
        };

        if (!prevProps.open && open) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                ...GenericDeployModal.initialState,
                deploymentId: StageUtils.uuid()
            });

            getStateFromContext('siteName');
            getStateFromContext('deploymentName');
            getStateFromContext('labels', 'initialLabels');

            this.selectBlueprint(blueprintId!).then(() => getStateFromContext('deploymentInputs'));
        }
    }

    handleDeploymentInputChange(_: SyntheticEvent | null, field: Field) {
        const { deploymentInputs } = this.state;
        const fieldNameValue = Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...deploymentInputs, ...fieldNameValue } });
    }

    handleYamlFileChange(file: File) {
        if (!file) {
            return;
        }

        const { blueprint, deploymentInputs: deploymentInputsState } = this.state;
        const { toolbox } = this.props;
        const actions = new FileActions(toolbox);

        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent<Blueprint>(file)
            .then(yamlInputs => {
                const deploymentInputs = getUpdatedInputs(blueprint.plan.inputs, deploymentInputsState, yamlInputs);
                this.setState({ errors: {}, deploymentInputs, fileLoading: false });
            })
            .catch((err: string | { message: string }) => {
                const errorMessage = t('errors.loadingYamlFileFailed', {
                    reason: typeof err === 'string' ? err : err.message
                });
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    handleExecuteInputChange(_event: React.SyntheticEvent<HTMLElement> | null, field: any) {
        this.setState((prevState: any) => {
            return {
                userInstallWorkflowParams: {
                    ...prevState.userInstallWorkflowParams,
                    ...Form.fieldNameValue(field)
                }
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
        this.setState({ activeSection: -1, loading: true, errors: {} });
        this.setLoadingMessage(validationMessage);

        let stepPromise = this.validateInputs();

        const deploymentParameters = this.getDeploymentParams();

        steps.forEach(step => {
            stepPromise = stepPromise.then(previousStepOutcome => {
                this.setLoadingMessage(step.message || '');
                return step.executeStep(
                    previousStepOutcome as any,
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

    onDeployAndInstall() {
        const { toolbox, deployAndInstallValidationMessage, deployAndInstallSteps } = this.props;
        const {
            installWorkflow,
            baseInstallWorkflowParams,
            userInstallWorkflowParams,
            schedule,
            scheduledTime,
            force,
            dryRun,
            queue,
            deploymentId
        } = this.state;
        const deploymentsList: string[] = compact([deploymentId]);
        this.setState({ activeSection: -1, loading: true, errors: {} });
        return this.validateInputs()
            .then(() =>
                executeWorkflow({
                    deploymentsList,
                    setLoading: () => this.setState({ loading: true }),
                    unsetLoading: () => this.setState({ loading: false }),
                    toolbox,
                    workflow: installWorkflow,
                    baseWorkflowInputs: baseInstallWorkflowParams,
                    userWorkflowInputsState: userInstallWorkflowParams,
                    schedule,
                    scheduledTime,
                    force,
                    dryRun,
                    queue,
                    clearErrors: () => this.setState({ errors: {} }),
                    onExecute: (
                        installWorkflowParameters: WorkflowParameters,
                        installWorkflowOptions: WorkflowOptions
                    ) => {
                        return this.onSubmit(
                            deployAndInstallValidationMessage,
                            deployAndInstallSteps,
                            installWorkflowParameters,
                            installWorkflowOptions
                        );
                    },
                    onHide: () => {}
                })
            )
            .catch(err => {
                if (typeof err === 'string') {
                    this.setState({ errors: { message: err }, loading: false });
                } else {
                    this.setState({ errors: err, loading: false });
                }
            });
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

    onScheduledTimeChange: DateInputProps['onChange'] = (_event, { value }) => {
        this.setState({ errors: {}, queue: false, scheduledTime: value });
    };

    getDeploymentParams() {
        const { environmentToDeployOn } = this.props;
        const {
            blueprint,
            deploymentName,
            deploymentId,
            runtimeOnlyEvaluation,
            labels,
            siteName,
            skipPluginsValidation,
            visibility,
            deploymentInputs,
            deploymentIdToDeployOn
        } = this.state;

        const parentDeploymentId = deploymentIdToDeployOn || environmentToDeployOn?.id;

        const deploymentLabels = parentDeploymentId
            ? [...labels, { key: parentDeploymentLabelKey, value: parentDeploymentId }]
            : labels;

        return {
            blueprintId: blueprint.id,
            deploymentId,
            deploymentName,
            inputs: getInputsMap(blueprint.plan.inputs, deploymentInputs),
            visibility,
            labels: deploymentLabels,
            skipPluginsValidation,
            siteName,
            runtimeOnlyEvaluation
        };
    }

    setLoadingMessage(message: string) {
        this.setState({ loadingMessage: message });
    }

    getModalHeader() {
        const { i18nHeaderKey, environmentToDeployOn } = this.props;
        const { blueprint } = this.state;
        const translationParameters: Record<string, string> = environmentToDeployOn
            ? { deploymentName: environmentToDeployOn.displayName }
            : { blueprintId: blueprint.id };

        return i18n.t(i18nHeaderKey, translationParameters);
    }

    isBlueprintSelectable() {
        const { blueprintId } = this.props;
        return isEmpty(blueprintId);
    }

    selectBlueprint(id: DropdownValue) {
        if (!isEmpty(id) && typeof id === 'string') {
            this.setState({ loading: true, loadingMessage: t('inputs.deploymentInputs.loading') });
            const { toolbox, environmentToDeployOn } = this.props;

            const actions = new BlueprintActions(toolbox);
            return actions
                .doGetFullBlueprintData(id)
                .then(blueprint => {
                    const deploymentInputs = getInputsInitialValues(blueprint.plan);
                    const installWorkflow = {
                        ...(blueprint.plan.workflows.install as Record<string, unknown>),
                        name: 'install'
                    } as Workflow;
                    this.setState({
                        deploymentInputs,
                        blueprint,
                        installWorkflow,
                        baseInstallWorkflowParams: installWorkflow.parameters,
                        userInstallWorkflowParams: mapValues(installWorkflow.parameters, parameterData =>
                            getInputFieldInitialValue(parameterData.default, parameterData.type)
                        ),
                        errors: {},
                        loading: false,
                        showDeployOnDropdown:
                            !environmentToDeployOn && !isEmpty(blueprint.requirements?.parent_capabilities)
                    });
                })
                .catch(err => {
                    this.setState({
                        blueprint: GenericDeployModal.EMPTY_BLUEPRINT,
                        loading: false,
                        errors: { error: err.message }
                    });
                });
        }
        this.setState({ blueprint: GenericDeployModal.EMPTY_BLUEPRINT, errors: {} });
        return Promise.resolve();
    }

    validateInputs() {
        return new Promise<void>((resolve, reject) => {
            const {
                blueprint,
                deploymentId,
                deploymentName,
                deploymentInputs: stateDeploymentInputs,
                showDeployOnDropdown,
                deploymentIdToDeployOn
            } = this.state;
            const { showDeploymentNameInput, showDeploymentIdInput } = this.props;
            const errors: Errors = {};

            if (showDeploymentNameInput && isEmpty(deploymentName)) {
                errors.deploymentName = t('errors.noDeploymentName');
            }

            if (showDeploymentIdInput && isEmpty(deploymentId)) {
                errors.deploymentId = t('errors.noDeploymentId');
            }

            if (showDeployOnDropdown && isEmpty(deploymentIdToDeployOn)) {
                errors.deploymentIdToDeployOn = t('errors.noDeploymentIdToDeployOn');
            }

            if (isEmpty(blueprint.id)) {
                errors.blueprintName = t('errors.noBlueprintName');
            }

            const inputsWithoutValue = getInputsWithoutValues(blueprint.plan.inputs, stateDeploymentInputs);
            addErrors(inputsWithoutValue, errors);

            if (!isEmpty(errors)) {
                reject(errors);
            } else {
                resolve();
            }
        });
    }

    render() {
        const {
            onHide,
            open,
            toolbox,
            showInstallOptions,
            showDeploymentIdInput,
            showDeploymentNameInput,
            showDeployButton,
            showSitesInput,
            deploySteps,
            deploymentNameLabel,
            deploymentNameHelp,
            blueprintFilterRules,
            environmentToDeployOn
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
            baseInstallWorkflowParams,
            userInstallWorkflowParams,
            force,
            dryRun,
            queue,
            schedule,
            scheduledTime,
            selectedApproveButton,
            showDeployOnDropdown,
            deploymentIdToDeployOn,
            initialLabels
        } = this.state;
        const { DEPLOYMENT_SECTIONS } = GenericDeployModal;

        return (
            <Modal open={open} onClose={onHide} className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="rocket" /> {this.getModalHeader()}
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
                                <BlueprintDropdown
                                    value={blueprint.id}
                                    name="blueprintName"
                                    onChange={this.selectBlueprint}
                                    toolbox={toolbox}
                                    filterRules={blueprintFilterRules}
                                    environmentCapabilities={environmentToDeployOn?.capabilities}
                                />
                            </Form.Field>
                        )}

                        {showDeploymentNameInput && (
                            <Form.Field
                                error={errors.deploymentName}
                                label={deploymentNameLabel ?? t('inputs.deploymentName.label')}
                                required
                                help={deploymentNameHelp ?? t('inputs.deploymentName.help')}
                            >
                                <Form.Input
                                    name="deploymentName"
                                    value={deploymentName}
                                    onChange={(_: ChangeEvent<HTMLInputElement>, { value }: { value: string }) =>
                                        this.setState({ deploymentName: value })
                                    }
                                />
                            </Form.Field>
                        )}

                        {showDeployOnDropdown && (
                            <Form.Field
                                error={errors.deploymentIdToDeployOn}
                                label={t('inputs.deploymentIdToDeployOn.label')}
                                required
                            >
                                <EnvironmentDropdown
                                    value={deploymentIdToDeployOn}
                                    name="deploymentIdToDeployOn"
                                    placeholder={t('inputs.deploymentIdToDeployOn.placeholder')}
                                    onChange={value => this.setState({ deploymentIdToDeployOn: value as string })}
                                    toolbox={toolbox}
                                    capabilitiesToMatch={
                                        (blueprint as FullBlueprintData).requirements?.parent_capabilities
                                    }
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
                                <DeploymentInputs
                                    toolbox={toolbox}
                                    blueprint={blueprint as FullBlueprintData}
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
                                            onChange={value =>
                                                typeof value === 'string' && this.setState({ siteName: value })
                                            }
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
                                        initialLabels={initialLabels}
                                        onChange={(newLabels: Label[]) => this.setState({ labels: newLabels })}
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
                                        onChange={(_, { checked }) =>
                                            this.setState({ skipPluginsValidation: !!checked })
                                        }
                                        help=""
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
                                            onChange={(
                                                _: ChangeEvent<HTMLInputElement>,
                                                { value }: { value: string }
                                            ) => this.setState({ deploymentId: value })}
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
                                        onChange={(_, { checked }) =>
                                            this.setState({ runtimeOnlyEvaluation: !!checked })
                                        }
                                        help=""
                                    />
                                </Form.Field>
                            </AccordionSectionWithDivider>
                            {selectedApproveButton === ApproveButtons.install && (
                                <AccordionSectionWithDivider
                                    title={t('sections.install')}
                                    index={DEPLOYMENT_SECTIONS.install}
                                    activeSection={activeSection}
                                    onClick={this.onAccordionClick}
                                >
                                    <ExecuteWorkflowInputs
                                        toolbox={toolbox}
                                        baseWorkflowInputs={baseInstallWorkflowParams}
                                        userWorkflowInputsState={userInstallWorkflowParams}
                                        onYamlFileChange={this.handleYamlFileChange}
                                        onWorkflowInputChange={this.handleExecuteInputChange}
                                        fileLoading={fileLoading}
                                        errors={errors}
                                        showInstallOptions={showInstallOptions || false}
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
                    showDeployButton={showDeployButton && !isEmpty(deploySteps)}
                    onCancel={this.onCancel}
                    onInstall={this.onDeployAndInstall}
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
