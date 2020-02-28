/**
 * Created by kinneretzin on 05/10/2016.
 */

export default class DeployModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = DeployModal.initialState;
    }

    static initialState = {
        loading: false,
        errors: {},
        blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT,
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
     * @property {Function} onHide function to be called when the modal is closed
     */
    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: _.noop
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(DeployModal.initialState);
        }
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
                        blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT,
                        loading: false,
                        errors: { error: err.message }
                    });
                });
        } else {
            this.setState({ blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, errors: {} });
        }
    }

    _handleInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState(fieldNameValue);
    }

    _handleDeploymentInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...this.state.deploymentInputs, ...fieldNameValue } });
    }

    _submitDeploy() {
        const { InputsUtils } = Stage.Common;
        const errors = {};

        if (_.isEmpty(this.state.blueprint.id)) {
            errors.blueprintName = 'Please select blueprint from the list';
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors.deploymentName = 'Please provide deployment name';
        }

        const inputsWithoutValue = {};
        const deploymentInputs = InputsUtils.getInputsToSend(
            this.state.blueprint.plan.inputs,
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
                this.state.blueprint,
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
        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                const deploymentInputs = InputsUtils.getUpdatedInputs(
                    this.state.blueprint.plan.inputs,
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

    render() {
        const { ApproveButton, CancelButton, Form, Icon, Message, Modal, VisibilityField } = Stage.Basic;
        const { DataTypesButton, InputsHeader, InputsUtils, YamlFileButton, DynamicDropdown } = Stage.Common;

        return (
            <Modal open={this.props.open} onClose={() => this.props.onHide()} closeOnEscape={false}>
                <Modal.Header>
                    <Icon name="rocket" /> Create new deployment
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

                        {this.state.blueprint.id && (
                            <>
                                {!_.isEmpty(this.state.blueprint.plan.inputs) && (
                                    <YamlFileButton
                                        onChange={this._handleYamlFileChange.bind(this)}
                                        dataType="deployment's inputs"
                                        fileLoading={this.state.fileLoading}
                                    />
                                )}
                                {!_.isEmpty(this.state.blueprint.plan.data_types) && (
                                    <DataTypesButton types={this.state.blueprint.plan.data_types} />
                                )}
                                <InputsHeader />
                                {_.isEmpty(this.state.blueprint.plan.inputs) && (
                                    <Message content="No inputs available for the selected blueprint" />
                                )}
                            </>
                        )}

                        {InputsUtils.getInputFields(
                            this.state.blueprint.plan.inputs,
                            this._handleDeploymentInputChange.bind(this),
                            this.state.deploymentInputs,
                            this.state.errors,
                            this.state.blueprint.plan.data_types
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
