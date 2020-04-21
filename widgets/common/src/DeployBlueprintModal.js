/**
 * Created by kinneretzin on 05/10/2016.
 */

class DeployBlueprintModal extends React.Component {
    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {} } };

    static initialState = {
        loading: false,
        errors: {},
        blueprint: DeployBlueprintModal.EMPTY_BLUEPRINT,
        deploymentName: '',
        yamlFile: null,
        fileLoading: false,
        deploymentInputs: [],
        visibility: Stage.Common.Consts.defaultVisibility,
        skipPluginsValidation: false,
        siteName: '',
        runtimeOnlyEvaluation: false
    };

    constructor(props) {
        super(props);

        this.state = DeployBlueprintModal.initialState;

        this.selectBlueprint = this.selectBlueprint.bind(this);
        this.handleDeploymentInputChange = this.handleDeploymentInputChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleYamlFileChange = this.handleYamlFileChange.bind(this);
        this.onApprove = this.onApprove.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { blueprintId, open } = this.props;
        if (!prevProps.open && open) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(DeployBlueprintModal.initialState, () => this.selectBlueprint(blueprintId));
        }
    }

    onApprove() {
        this.setState({ errors: {} }, this.submitDeploy);
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    isBlueprintSelectable() {
        const { blueprintId } = this.props;
        return _.isEmpty(blueprintId);
    }

    selectBlueprint(id) {
        if (!_.isEmpty(id)) {
            this.setState({ loading: true });
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

    submitDeploy() {
        const { BlueprintActions, InputsUtils } = Stage.Common;
        const {
            blueprint,
            deploymentName,
            deploymentInputs: stateDeploymentInputs,
            runtimeOnlyEvaluation,
            siteName,
            skipPluginsValidation,
            visibility
        } = this.state;
        const { onHide, toolbox } = this.props;
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
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new BlueprintActions(toolbox);
        return actions
            .doDeploy(
                blueprint,
                deploymentName,
                deploymentInputs,
                visibility,
                skipPluginsValidation,
                siteName,
                runtimeOnlyEvaluation
            )
            .then((/* deployment */) => {
                this.setState({ loading: false, errors: {} });
                toolbox.getEventBus().trigger('deployments:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ loading: false, errors: InputsUtils.getErrorObject(err.message) });
            });
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
        const { ApproveButton, CancelButton, Form, Icon, Message, Modal, VisibilityField } = Stage.Basic;
        const { DataTypesButton, InputsHeader, InputsUtils, YamlFileButton, DynamicDropdown } = Stage.Common;
        const { onHide, open, toolbox } = this.props;
        const {
            blueprint,
            deploymentInputs,
            deploymentName,
            errors,
            fileLoading,
            loading,
            runtimeOnlyEvaluation,
            skipPluginsValidation,
            siteName,
            visibility
        } = this.state;

        return (
            <Modal open={open} onClose={() => onHide()} closeOnEscape={false} className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="rocket" /> Deploy blueprint {blueprint.id}
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={v => this.setState({ visibility: v })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={loading}
                        errors={errors}
                        scrollToError
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
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
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove}
                        disabled={loading}
                        content="Deploy"
                        icon="rocket"
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
        getEventBus: PropTypes.func.isRequired
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
