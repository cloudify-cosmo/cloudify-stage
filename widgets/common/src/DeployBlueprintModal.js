/**
 * Created by kinneretzin on 05/10/2016.
 */

class DeployBlueprintModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = DeployBlueprintModal.initialState;
    }

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

    /**
     * propTypes
     *
     * @property {object} toolbox Toolbox object
     * @property {boolean} open specifies whether the deploy modal is displayed
     * @property {object} blueprints holds list of blueprints
     * @property {Function} onHide function to be called when the modal is closed
     */
    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        blueprintId: PropTypes.string,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: _.noop,
        blueprintId: ''
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(DeployBlueprintModal.initialState, () => this.selectBlueprint(this.props.blueprintId));
        }
    }

    isBlueprintSelectable() {
        return _.isEmpty(this.props.blueprintId);
    }

    onApprove() {
        this.setState({ errors: {} }, this._submitDeploy);
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    selectBlueprint(id) {
        if (!_.isEmpty(id)) {
            this.setState({ loading: true });

            const actions = new Stage.Common.BlueprintActions(this.props.toolbox);
            actions
                .doGetFullBlueprintData({ id })
                .then(blueprint => {
                    const deploymentInputs = Stage.Common.InputsUtils.getInputsInitialValuesFrom(blueprint.plan);
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

    _submitDeploy() {
        const { InputsUtils } = Stage.Common;
        const { blueprint } = this.state;
        const errors = {};

        if (_.isEmpty(this.state.blueprint.id)) {
            errors.blueprintName = 'Please select blueprint from the list';
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors.deploymentName = 'Please provide deployment name';
        }

        const inputsWithoutValue = {};
        const deploymentInputs = InputsUtils.getInputsToSend(
            blueprint.plan.inputs,
            this.state.deploymentInputs,
            inputsWithoutValue
        );
        InputsUtils.addErrors(inputsWithoutValue, errors);

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions
            .doDeploy(
                blueprint,
                this.state.deploymentName,
                deploymentInputs,
                this.state.visibility,
                this.state.skipPluginsValidation,
                this.state.siteName,
                this.state.runtimeOnlyEvaluation
            )
            .then((/* deployment */) => {
                this.setState({ loading: false, errors: {} });
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch(err => {
                const errors = InputsUtils.getErrorObject(err.message);
                this.setState({ loading: false, errors });
            });
    }

    _handleYamlFileChange(file) {
        if (!file) {
            return;
        }

        const { FileActions, InputsUtils } = Stage.Common;
        const actions = new FileActions(this.props.toolbox);
        const { blueprint } = this.state;
        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                const deploymentInputs = InputsUtils.getUpdatedInputs(
                    blueprint.plan.inputs,
                    this.state.deploymentInputs,
                    yamlInputs
                );
                this.setState({ errors: {}, deploymentInputs, fileLoading: false });
            })
            .catch(err => {
                const errorMessage = `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}`;
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    _handleInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState(fieldNameValue);
    }

    _handleDeploymentInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...this.state.deploymentInputs, ...fieldNameValue } });
    }

    render() {
        const { ApproveButton, CancelButton, Form, Icon, Message, Modal, VisibilityField } = Stage.Basic;
        const { DataTypesButton, InputsHeader, InputsUtils, YamlFileButton, DynamicDropdown } = Stage.Common;
        const { blueprint } = this.state;

        return (
            <Modal
                open={this.props.open}
                onClose={() => this.props.onHide()}
                closeOnEscape={false}
                className="deployBlueprintModal"
            >
                <Modal.Header>
                    <Icon name="rocket" /> Deploy blueprint {blueprint.id}
                    <VisibilityField
                        visibility={this.state.visibility}
                        className="rightFloated"
                        onVisibilityChange={visibility => this.setState({ visibility })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        scrollToError
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field
                            error={this.state.errors.deploymentName}
                            label="Deployment name"
                            required
                            help="Specify a name for this deployment instance."
                        >
                            <Form.Input
                                name="deploymentName"
                                value={this.state.deploymentName}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field
                            error={this.state.errors.siteName}
                            label="Site name"
                            help="(Optional) Specify a site to which this deployment will be assigned."
                        >
                            <DynamicDropdown
                                value={this.state.siteName}
                                onChange={value => this.setState({ siteName: value })}
                                name="siteName"
                                fetchUrl="/sites?_include=name"
                                valueProp="name"
                                toolbox={this.props.toolbox}
                            />
                        </Form.Field>

                        {this.isBlueprintSelectable() && (
                            <Form.Field
                                error={this.state.errors.blueprintName}
                                label="Blueprint"
                                required
                                help="Select the blueprint based on which this deployment will be created."
                            >
                                <DynamicDropdown
                                    value={this.state.blueprint.id}
                                    name="blueprintName"
                                    fetchUrl="/blueprints?_include=id"
                                    onChange={this.selectBlueprint.bind(this)}
                                    toolbox={this.props.toolbox}
                                    prefetch
                                />
                            </Form.Field>
                        )}

                        {blueprint.id && (
                            <>
                                {!_.isEmpty(blueprint.plan.inputs) && (
                                    <YamlFileButton
                                        onChange={this._handleYamlFileChange.bind(this)}
                                        dataType="deployment's inputs"
                                        fileLoading={this.state.fileLoading}
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
                            this._handleDeploymentInputChange.bind(this),
                            this.state.deploymentInputs,
                            this.state.errors,
                            blueprint.plan.data_types
                        )}

                        <Form.Field className="skipPluginsValidationCheckbox">
                            <Form.Checkbox
                                toggle
                                label="Skip plugins validation"
                                name="skipPluginsValidation"
                                checked={this.state.skipPluginsValidation}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        {this.state.skipPluginsValidation && (
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
                                checked={this.state.runtimeOnlyEvaluation}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={this.state.loading}
                        content="Deploy"
                        icon="rocket"
                        className="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

Stage.defineCommon({
    name: 'DeployBlueprintModal',
    common: DeployBlueprintModal
});
