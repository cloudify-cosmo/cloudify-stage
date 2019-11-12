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
        deploymentName: '',
        yamlFile: null,
        fileLoading: false,
        deploymentInputs: [],
        visibility: Stage.Common.Consts.defaultVisibility,
        skipPluginsValidation: false,
        siteName: '',
        sites: { items: [] },
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
        blueprint: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: () => {}
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            const deploymentInputs = Stage.Common.InputsUtils.getInputsInitialValuesFrom(this.props.blueprint.plan);
            const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
            actions
                .doGetSites()
                .then(sites => {
                    this.setState({ ...DeployBlueprintModal.initialState, deploymentInputs, sites });
                })
                .catch(err => {
                    this.setState({ loading: false, error: err.message });
                });
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

    _submitDeploy() {
        const { InputsUtils } = Stage.Common;
        const errors = {};

        if (!this.props.blueprint) {
            errors.error = 'Blueprint not selected';
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors.deploymentName = 'Please provide deployment name';
        }

        const inputsWithoutValue = {};
        const deploymentInputs = InputsUtils.getInputsToSend(
            this.props.blueprint.plan.inputs,
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
                this.props.blueprint,
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
                    this.props.blueprint.plan.inputs,
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
        const { DataTypesButton, InputsHeader, InputsUtils, YamlFileButton } = Stage.Common;

        const blueprint = { ...DeployBlueprintModal.EMPTY_BLUEPRINT, ...this.props.blueprint };
        const site_options = _.map(this.state.sites.items, site => {
            return { text: site.name, value: site.name };
        });

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
                            <Form.Dropdown
                                search
                                selection
                                value={this.state.siteName}
                                name="siteName"
                                options={site_options}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>

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
                        color="green"
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
